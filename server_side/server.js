const express = require("express");
const mongoose = require("mongoose");
const Group = require("./models/group");
const cors = require('cors');

const app = express();
const PORT = 3001;

app.use(express.json());
app.use(cors());

// Connect to MongoDB
mongoose
  .connect("mongodb://localhost:27017/shift-web-app", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("Connected to MongoDB");
  })
  .catch((error) => {
    console.error("Failed to connect to MongoDB:", error);
  });

// Define your API endpoints here

// Create a new group
app.post("/api/groups", (req, res) => {
  console.log("ddddd");
  const { groupName, shifts } = req.body;

  const newGroup = new Group({
    groupName,
    shifts,
  });

  newGroup
    .save()
    .then((group) => {
      res.status(201).json(group);
    })
    .catch((error) => {
      res
        .status(500)
        .json({ error: "An error occurred while saving the group." });
    });
});


// Fetch all groups
app.get("/api/groups", (req, res) => {
  Group.find()
    .then((groups) => {
      res.json(groups);
    })
    .catch((error) => {
      res
        .status(500)
        .json({ error: "An error occurred while fetching the groups." });
    });
});

// Submit a group configuration
app.post("/api/groups/:groupId/configurations", (req, res) => {
  const groupId = req.params.groupId;
  const { configuration } = req.body;

  // Perform any necessary validation and store the group configuration

  res.json({
    success: true,
    message: "Group configuration submitted successfully",
  });
});

// Route to serve the form for joining a specific group
app.get("/join/:groupId", (req, res) => {
  const groupId = req.params.groupId;

  // Fetch the group from the database based on the groupId
  Group.findById(groupId)
    .then((group) => {
      if (!group) {
        return res.status(404).json({ error: "Group not found" });
      }

      // Extract the shift details from the group and send it to the client
      const shiftsData = group.shifts;
      res.json(shiftsData);
    })
    .catch((error) => {
      res.status(500).json({ error: "An error occurred while fetching the group" });
    });
});

// API endpoint to add employee data to the selectedGroup
app.post("/api/groups/:groupId/join", async (req, res) => {
  const groupId = req.params.groupId;
  const { employeeName, employeeEmail, groupConfiguration } = req.body;

  try {
    const group = await Group.findById(groupId);

    if (!group) {
      return res.status(404).json({ error: "Group not found." });
    }

    // Find the index of the employee data in the groupEmployees array based on their email
    const employeeIndex = group.groupEmployees.findIndex(
      (employee) => employee.employeeEmail === employeeEmail
    );

    if (employeeIndex !== -1) {
      // If the employee is already in the groupEmployees array, update their availability
      const updatedEmployeeAvailability = groupConfiguration.map((dayShifts) =>
        dayShifts.map((shift) =>
          shift.employeeAvailable ? true : false // Set employee availability to true if the shift is selected
        )
      );

      group.groupEmployees[employeeIndex].employeeAvailability = updatedEmployeeAvailability;
    } else {
      // If the employee is not in the groupEmployees array, add them with their availability
      group.groupEmployees.push({
        employeeName,
        employeeEmail,
        employeeAvailability: groupConfiguration.map((dayShifts) =>
          dayShifts.map((shift) =>
            shift.employeeAvailable ? true : false // Set employee availability to true if the shift is selected
          )
        ),
      });
    }

    // Save the updated group to the database
    const updatedGroup = await group.save();

    res.status(201).json(updatedGroup);
  } catch (error) {
    res.status(500).json({ error: "An error occurred while adding the employee data to the group." });
  }
});

// // Function to assign workers to a shift based on the employee availability
// const assignWorkersToShift = (shift, workersNeeded, employees) => {
//   let remainingWorkers = workersNeeded;

//   for (const employee of employees) {
//     for (let dayIndex = 0; dayIndex < 7; dayIndex++) {
//       for (let shiftIndex = 0; shiftIndex < shift[dayIndex].length; shiftIndex++) {
//         const currentShift = shift[dayIndex][shiftIndex];

//         if (currentShift.workersNeeded === 0) continue; // Skip shifts that are already fully assigned

//         if (employee.employeeAvailability[dayIndex][shiftIndex] && remainingWorkers > 0) {
//           // Assign the shift to the employee
//           currentShift.assignedEmployees.push({
//             employeeName: employee.employeeName,
//             employeeEmail: employee.employeeEmail,
//           });
//           currentShift.workersNeeded -= 1;
//           remainingWorkers -= 1;

//           // Decrease the total shifts of the assigned employee
//           employee.totalShifts -= 1;
//         }
//       }
//     }
//   }
// };

const assignShiftsAutomatically = (shifts, groupEmployees) => {
  const updatedShifts = JSON.parse(JSON.stringify(shifts)); // Create a deep copy of shifts
  const updatedGroupEmployees = JSON.parse(JSON.stringify(groupEmployees)); // Create a deep copy of groupEmployees

  // Iterate through each shift
  updatedShifts.forEach((dayShifts, dayIndex) => {
    dayShifts.forEach((shift, shiftIndex) => {
      const availableEmployees = updatedGroupEmployees.filter(
        (employee) => employee.totalShifts > 0 && employee.employeeAvailability[dayIndex][shiftIndex]
      );

      // Sort employees based on the total shifts they are assigned to (if available)
      availableEmployees.sort((a, b) => (a.totalShifts || 0) - (b.totalShifts || 0));

      // Assign workers to the shift until the workersNeeded is fulfilled
      const assignedEmployees = [];
      for (let i = 0; i < shift.workersNeeded && i < availableEmployees.length; i++) {
        availableEmployees[i].totalShifts--;

        assignedEmployees.push({
          employeeName: availableEmployees[i].employeeName,
          employeeEmail: availableEmployees[i].employeeEmail,
        });
      }

      // Update the assignedEmployees field for the shift
      updatedShifts[dayIndex][shiftIndex].assignedEmployees = assignedEmployees;
    });
  });

  return { updatedShifts, updatedGroupEmployees };
};


// API endpoint to perform automatic shift assignment
app.post("/api/groups/:groupId/assign-automatically", async (req, res) => {
  const groupId = req.params.groupId;

  try {
    const group = await Group.findById(groupId);

    if (!group) {
      return res.status(404).json({ error: "Group not found." });
    }

    const employees = group.groupEmployees;
    const shifts = group.shifts;

    // Calculate the total shifts for each employee based on the number of "true" entries in employeeAvailability
    employees.forEach((employee) => {
      employee.totalShifts = employee.employeeAvailability.flat().filter((shift) => shift).length;
    });

    
    // Call assignShiftsAutomatically function to perform shift assignment
    const { updatedShifts, updatedEmployees } = assignShiftsAutomatically(shifts, employees);

    // Update shifts data
    group.shifts = updatedShifts;

    // Save the updated shifts in the group first
    await group.save();

    // Update groupEmployees data
    group.groupEmployees = updatedEmployees;

    // Save the updated groupEmployees
    await group.save();

    group.autoAssigned = true;
    await group.save();

    res.status(200).json({ message: "Shifts assigned automatically." });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "An error occurred while performing the automatic shift assignment." });
  }
});

// Fetch a specific group by ID
app.get("/api/groups/:groupId", async (req, res) => {
  const groupId = req.params.groupId;

  try {
    const group = await Group.findById(groupId);

    if (!group) {
      return res.status(404).json({ error: "Group not found." });
    }

    res.json(group);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "An error occurred while fetching the group data." });
  }
});

// API endpoint to delete a group
app.delete("/api/groups/:groupId", async (req, res) => {
  const groupId = req.params.groupId;

  try {
    const result = await Group.deleteOne({ _id: groupId });

    if (result.deletedCount === 0) {
      return res.status(404).json({ error: "Group not found." });
    }

    res.status(200).json({ message: "Group deleted successfully." });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "An error occurred while deleting the group.", detailedError: error.message });
  }
});




app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
