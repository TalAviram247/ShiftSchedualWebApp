import React, { useState } from 'react';
import axios from 'axios';
import ExistingGroups from './ExistingGroups';
import JoinGroupForm from './JoinGroupForm';
import ShowAutoAssign from './ShowAutoAssign'; // Add the ShowAutoAssign import

import styles from './Home.module.css';

const Home = ({ handleCreateGroup }) => {
  const [showGroups, setShowGroups] = useState(false);
  const [groupsData, setGroupsData] = useState([]);
  const [selectedGroup, setSelectedGroup] = useState(null);
  const [showJoinGroupForm, setShowJoinGroupForm] = useState(false);
  const [showAutoAssign, setShowAutoAssign] = useState(false); // Add the showAutoAssign state
  
  
  

  const handleAssignAutomatically = async () => {
    try {
      const response = await axios.post(
        `http://localhost:3001/api/groups/${selectedGroup._id}/assign-automatically`
      );

      console.log(response.data.message); // Log the response message (optional)

      // // Fetch the updated group data (optional, you can skip this step if you don't want to fetch it)
      // const updatedGroupResponse = await axios.get(`http://localhost:3001/api/groups/${selectedGroup._id}`);
      // setSelectedGroup(updatedGroupResponse.data);

      
      // // Update the autoAssigned field in the selectedGroup
      // setSelectedGroup({ ...selectedGroup, autoAssigned: true });

      setShowAutoAssign(false);
      setSelectedGroup(null);
      setShowGroups(false);

      
            
    } catch (error) {
      console.error(error);
      // Handle error if needed
    }
  };



  const handleClickCreateGroup = () => {
    handleCreateGroup();
  };

  const handleClickShowAll = async () => {
    try {
      const response = await axios.get('http://localhost:3001/api/groups');
      setGroupsData(response.data);
      setShowGroups(true);
    } catch (error) {
      console.error(error);
    }
  };

  const handleClickGroup = (group) => {
    setSelectedGroup(group);
  };

  const handleGoBack = () => {
    setSelectedGroup(null);
    setShowGroups(false); // Set the showGroups state to false to go back to the starting page
    setShowAutoAssign(false);
    setShowJoinGroupForm(false);
  };

  // Function to handle showing the JoinGroupForm
  const handleShowJoinGroupForm = () => {
    setShowJoinGroupForm(true);
  };

  // Function to handle hiding the JoinGroupForm
  const handleHideJoinGroupForm = () => {
    setShowJoinGroupForm(false);
  };

  // Function to get the number of employees who submitted the form for the selected group
  const getSubmittedEmployeesCount = () => {
    if (selectedGroup && selectedGroup.groupEmployees) {
      return selectedGroup.groupEmployees.length;
    }
    return 0;
  };

  const handleShowAutoAssign = () => {
    setShowAutoAssign(true);
  };

  const handleDeleteGroup = async () => {
    try {
      await axios.delete(`http://localhost:3001/api/groups/${selectedGroup._id}`);

      // Reset selectedGroup and showGroups states to initial values
      setSelectedGroup(null);
      setShowGroups(false);
    } catch (error) {
      console.error(error);
      // Handle error if needed
    }
  };

  

  return (
  
  <div className={styles.container}>
      <div className={styles.center}>
        {selectedGroup ? (
          <div>
            <h2>Group: {selectedGroup.groupName}</h2>
            <p>Number of Employees who joined and yet to be assigned: {getSubmittedEmployeesCount()}</p>
            {selectedGroup.autoAssigned ? (
              <p>This group was already assigned shifts. See section below.</p>
            ):null}
            <button onClick={handleGoBack} className={styles.button}>
              Go Back
            </button>
            {showJoinGroupForm ? (
              <JoinGroupForm
                selectedGroup={selectedGroup}
                handleHideJoinGroupForm={handleHideJoinGroupForm}
              />
            ) : showAutoAssign ? (
              <ShowAutoAssign shifts={selectedGroup.shifts} />
            ) : (
              <>
                {/* Display the data for the selected group */}
                <button onClick={handleDeleteGroup} className={`${styles.button} ${styles.red}`}>
                  Delete Group
                </button>
                <ul>
                  {selectedGroup.shifts.map((dayShifts, dayIndex) => (
                    <li key={dayIndex}>
                      <h3>{getDayOfWeek(dayIndex)}</h3>
                      <ul>
                        {dayShifts.map((shift, shiftIndex) => (
                          <li key={shiftIndex}>
                            <p>Start: {shift.start}</p>
                            <p>End: {shift.end}</p>
                            <p>Workers Needed: {shift.workersNeeded}</p>
                          </li>
                        ))}
                      </ul>
                    </li>
                  ))}
                </ul>
                {/* Conditionally render buttons */}
                {selectedGroup.autoAssigned ? (
                  <button onClick={handleShowAutoAssign} className={styles.button}>
                    Show Existing Assignment
                  </button>
                ) : (
                  <button onClick={handleAssignAutomatically} className={styles.button}>
                    Assign Shifts Automatically
                  </button>
                )}
                <button onClick={handleShowJoinGroupForm} className={styles.button}>
                  Join Group
                </button>
              </>
            )}
          </div>
        ) : (
          <div>
            {showGroups && (
              <ExistingGroups
                groupsData={groupsData}
                handleClickGroup={handleClickGroup}
                handleGoBack={handleGoBack}
              />
            )}
            <button onClick={handleClickCreateGroup} className={styles.button}>
              Create Group
            </button>
            {!showGroups && (
              <button onClick={handleClickShowAll} className={styles.button}>
                Show all Groups
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
};


const getDayOfWeek = (dayIndex) => {
  const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  return days[dayIndex];
};

export default Home;