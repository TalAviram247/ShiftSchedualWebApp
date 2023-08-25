import React, { useState } from 'react';
import axios from 'axios';

import styles from './Home.module.css';


const JoinGroupForm = ({ selectedGroup, handleHideJoinGroupForm }) => {
  const [employeeName, setEmployeeName] = useState('');
  const [employeeEmail, setEmployeeEmail] = useState('');
  const [employeeAvailability, setEmployeeAvailability] = useState(
    // Initialize the employeeAvailability state with an array of false values (no availability)
    selectedGroup.shifts.map((dayShifts) => dayShifts.map(() => false))
  );

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      // Combine the employeeAvailability state with the selectedGroup.shifts to form the groupConfiguration
      const groupConfiguration = selectedGroup.shifts.map((dayShifts, dayIndex) =>
        dayShifts.map((shift, shiftIndex) => ({
          ...shift,
          employeeAvailable: employeeAvailability[dayIndex][shiftIndex],
        }))
      );

      const response = await axios.post(
        `http://localhost:3001/api/groups/${selectedGroup._id}/join`,
        {
          employeeName,
          employeeEmail,
          groupConfiguration,
        }
      );

      // Handle the success message or any other actions you want to take
      console.log(response.data);

      // Hide the JoinGroupForm after submission
      handleHideJoinGroupForm();
    } catch (error) {
      // Handle error cases
      console.error(error);
    }
  };

  return (
    <div>
      <h2>Join Group Form</h2>
      <form onSubmit={handleSubmit}>
        <label>Employee Name:</label>
        <input
          type="text"
          value={employeeName}
          onChange={(e) => setEmployeeName(e.target.value)}
        />

        <label>Employee Email:</label>
        <input
          type="email"
          value={employeeEmail}
          onChange={(e) => setEmployeeEmail(e.target.value)}
        />

        <h3>Group Shifts:</h3>
        {selectedGroup.shifts.map((dayShifts, dayIndex) => (
          <div key={dayIndex}>
            <h4>{getDayOfWeek(dayIndex)}</h4>
            {dayShifts.map((shift, shiftIndex) => (
              <div key={shiftIndex}>
                <label>
                  <input
                    type="checkbox"
                    checked={employeeAvailability[dayIndex][shiftIndex]}
                    onChange={(e) => {
                      const updatedAvailability = [...employeeAvailability];
                      updatedAvailability[dayIndex][shiftIndex] = e.target.checked;
                      setEmployeeAvailability(updatedAvailability);
                    }}
                  />
                  {shift.start} - {shift.end}
                </label>
              </div>
            ))}
          </div>
        ))}

        <button type="submit" className={styles.button}>Submit</button>
      </form>
    </div>
  );
};

const getDayOfWeek = (dayIndex) => {
  const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  return days[dayIndex];
};

export default JoinGroupForm;
