import React, { useState } from 'react';
import Home from './components/Home';
import GroupConfig from './components/GroupConfig';
import axios from 'axios';
import logo from './shiftgrid logo.png';
import styles from './components/Home.module.css';

const App = () => {
  const [showConfigMenu, setShowConfigMenu] = useState(false);
  const [groupName, setGroupName] = useState('');
  const [message, setMessage] = useState('');
  const [submittedGroups, setSubmittedGroups] = useState([]);
  const [shifts, setShifts] = useState([
    [], // Sunday
    [], // Monday
    [], // Tuesday
    [], // Wednesday
    [], // Thursday
    [], // Friday
    [], // Saturday
  ]);

  const handleCreateGroup = () => {
    setShowConfigMenu(true);
  };

  const handleCancelGroupCreation = () => {
    setShowConfigMenu(false);
    setGroupName('');
    setShifts([
      [], // Sunday
      [], // Monday
      [], // Tuesday
      [], // Wednesday
      [], // Thursday
      [], // Friday
      [], // Saturday
    ]);
  };

  const handleLogoClick = () => {
    setShowConfigMenu(false);
    setGroupName('');
    setShifts([
      [], // Sunday
      [], // Monday
      [], // Tuesday
      [], // Wednesday
      [], // Thursday
      [], // Friday
      [], // Saturday
    ]);
  };

  const handleGroupSubmit = async () => {
    try {
      console.log(groupName, shifts);
      const response = await axios.post('http://localhost:3001/api/groups', {
        groupName,
        shifts,
      });

      setMessage(response.data.message);
      const newGroup = {
        groupName,
        shifts,
      };
      setSubmittedGroups((prevSubmittedGroups) => [...prevSubmittedGroups, newGroup]);
      setGroupName('');
      setShifts([
        [], // Sunday
        [], // Monday
        [], // Tuesday
        [], // Wednesday
        [], // Thursday
        [], // Friday
        [], // Saturday
      ]);
    } catch (error) {
      setMessage('Error occurred while submitting group configuration');
      console.error(error);
    }
  };

  return (
    <div>
      <img src={logo} alt="Logo" onClick={handleLogoClick} className={styles.logo} />

      {showConfigMenu ? (
        <GroupConfig
          groupName={groupName}
          setGroupName={setGroupName}
          shifts={shifts}
          setShifts={setShifts}
          handleCancelGroupCreation={handleCancelGroupCreation}
          handleGroupSubmit={handleGroupSubmit}
          message={message}
        />
      ) : (
        <Home handleCreateGroup={handleCreateGroup} submittedGroups={submittedGroups} handleLogoClick={handleLogoClick} />
      )}
    </div>
  );
};

export default App;
