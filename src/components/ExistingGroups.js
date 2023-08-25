import React from 'react';
import styles from './Home.module.css';
// import { Link } from 'react-router-dom'; // If using React Router for navigation
import JoinGroupForm from './JoinGroupForm';

const ExistingGroups = ({ groupsData, handleClickGroup, handleGoBack }) => {
  return (
    <div>
      <button onClick={handleGoBack} className={styles.button}>Go Back</button>
      <ul className={styles.groupList}>
        {groupsData.map((group, index) => (
          <li key={index} onClick={() => handleClickGroup(group)} className={styles.groupItem}>
            <h3 className={styles.groupName}>{group.groupName}</h3>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ExistingGroups;