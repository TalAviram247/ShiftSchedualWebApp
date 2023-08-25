// shift-web-app/src/components/ShowAutoAssign.js

import React from 'react';
import styles from './ShowAutoAssign.module.css';

const ShowAutoAssign = ({ shifts }) => {
  return (
    <div className={styles.container}>
      {shifts.map((dayShifts, dayIndex) => (
        <div key={dayIndex}>
          <h3>{getDayOfWeek(dayIndex)}:</h3>
          {dayShifts.map((shift, shiftIndex) => (
            <div key={shiftIndex}>
              <p>Shift: {shift.start} - {shift.end}</p>
              {shift.assignedEmployees.length > 0 ? (
                <div>
                  <p>Assigned Employees:</p>
                  <ul>
                    {shift.assignedEmployees.map((employee, index) => (
                      <li key={index}>{employee.employeeName} ({employee.employeeEmail})</li>
                    ))}
                  </ul>
                </div>
              ) : (
                <p>No employees assigned.</p>
              )}
              {shift.workersNeeded > 0 && shift.workersNeeded > shift.assignedEmployees.length && (
                <React.Fragment>
                  <p>{shift.workersNeeded - shift.assignedEmployees.length} more employees needed.</p>
                  <p>Please assign manually.</p>
                </React.Fragment>
              )}
            </div>
          ))}
        </div>
      ))}
    </div>
  );
};

const getDayOfWeek = (dayIndex) => {
  const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  return days[dayIndex];
};


export default ShowAutoAssign;
