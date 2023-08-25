
import React from 'react';
import styles from './Home.module.css';
import groupConfigStyles from './GroupConfig.module.css'; // Import the new CSS file


const GroupConfig = ({
  groupName,
  setGroupName,
  shifts,
  setShifts,
  handleCancelGroupCreation,
  handleGroupSubmit,
  message,
}) => {
  const handleAddShift = (dayIndex) => {
    setShifts((prevShifts) => {
      const updatedShifts = [...prevShifts];
      updatedShifts[dayIndex] = [
        ...updatedShifts[dayIndex],
        { start: '', end: '', workersNeeded: 0 },
      ];
      return updatedShifts;
    });
  };

  const handleRemoveShift = (dayIndex, shiftIndex) => {
    setShifts((prevShifts) => {
      const updatedShifts = [...prevShifts];
      updatedShifts[dayIndex].splice(shiftIndex, 1);
      return updatedShifts;
    });
  };

  const handleInputChange = (dayIndex, shiftIndex, field, value) => {
    setShifts((prevShifts) => {
      const updatedShifts = [...prevShifts];
      updatedShifts[dayIndex][shiftIndex][field] = value;
      return updatedShifts;
    });
  };

  return (
    
    <div className={`${styles.center} ${groupConfigStyles.centered}`}>
      <h2 className={groupConfigStyles.groupConfigH2}>Group Configuration:</h2>
      {/* <h2>Group Configuration:</h2> */}
      <div className={styles.groupConfig}>
        <input
          type="text"
          placeholder="Group Name"
          value={groupName}
          onChange={(e) => setGroupName(e.target.value)}
        />
        {shifts.map((dayShifts, dayIndex) => (
          <div key={dayIndex}>
            <h3>{getDayOfWeek(dayIndex)}</h3>
            {dayShifts.map((shift, shiftIndex) => (
              <div key={shiftIndex}>
                <label>Shift Start:</label>
                <input
                  type="time"
                  value={shift.start}
                  onChange={(e) =>
                    handleInputChange(dayIndex, shiftIndex, 'start', e.target.value)
                  }
                />
                <label>Shift End:</label>
                <input
                  type="time"
                  value={shift.end}
                  onChange={(e) =>
                    handleInputChange(dayIndex, shiftIndex, 'end', e.target.value)
                  }
                />
                <label>Workers Needed:</label>
                <input
                  type="number"
                  value={shift.workersNeeded}
                  onChange={(e) =>
                    handleInputChange(
                      dayIndex,
                      shiftIndex,
                      'workersNeeded',
                      parseInt(e.target.value)
                    )
                  }
                />
                <button
                  onClick={() => handleRemoveShift(dayIndex, shiftIndex)}
                  className={`${styles.button} ${styles.red} `}
                >
                  Remove Shift
                </button>
              </div>
            ))}
            <button
              onClick={() => handleAddShift(dayIndex)}
              className={`${styles.button} `}
            >
              Add Shift
            </button>
          </div>
        ))}
      </div>
      <div className={styles.buttonContainer}>
        <button onClick={handleGroupSubmit} className={styles.button}>
          Submit All
        </button>
        <button
          onClick={handleCancelGroupCreation}
          className={`${styles.button} ${styles.red}`}
        >
          Cancel
        </button>
      </div>
      {message && <p>{message}</p>}
    </div>
  );
};

const getDayOfWeek = (dayIndex) => {
  const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  return days[dayIndex];
};

export default GroupConfig;
