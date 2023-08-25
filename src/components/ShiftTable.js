import React, { useState, useEffect } from "react";
import axios from "axios";

const Table = ({ shiftsData }) => {
  console.log("shiftsData 1111", shiftsData);
  function createHTMLText(shiftData) {
    if (shiftData === null) {
      return "";
    }
    return (
      <>
        <p>Start: {shiftData?.start}</p>
        <p>End: {shiftData?.end}</p>
        <p>Workers Needed: {shiftData?.workersNeeded}</p>
      </>
    );
  }
  return (
    <table>
      <tr>
        <th style={{ textAlign: "center",marginRight: "40px"}}>Group Name</th>
        <th style={{ textAlign: "center",marginRight: "10px"}}>Sunday</th>
        <th style={{ textAlign: "center",marginRight: "10px"}}>Monday</th>
        <th style={{ textAlign: "center",marginRight: "10px"}}>Tuesday</th>
        <th style={{ textAlign: "center",marginRight: "10px"}}>Wednesday</th>
        <th>Thursday</th>
        <th>Friday</th>
        <th>Saturday</th>
      </tr>
      {shiftsData.map((shift, index) => (
        <tr key={index}>
          <td style={{ textAlign: "center",marginRight: "40px"}}>{shift.groupName}</td>
          <td style={{ textAlign: "center",marginRight: "10px"}}>{createHTMLText(shift?.sunday)}</td>
          <td style={{ textAlign: "center",marginRight: "10px"}}>{createHTMLText(shift?.monday)}</td>
          <td style={{ textAlign: "center",marginRight: "10px"}}>{createHTMLText(shift?.tuesday)}</td>
          <td style={{ textAlign: "center",marginRight: "10px"}}>{createHTMLText(shift?.wednesday)}</td>
          <td style={{ textAlign: "center",marginRight: "10px"}}>{createHTMLText(shift?.thursday)}</td>
          <td style={{ textAlign: "center",marginRight: "10px"}}>{createHTMLText(shift?.friday)}</td>
          <td style={{ textAlign: "center",marginRight: "10px"}}>{createHTMLText(shift?.saturday)}</td>
        </tr>
      ))}
    </table>
  );
};
const ShiftTable = () => {
  const [shiftsData, setShiftsData] = useState([]);
  console.log("shiftsData", shiftsData);

  useEffect(() => {
    function transformObject(obj) {
      const daysOfWeek = [
        "sunday",
        "monday",
        "tuesday",
        "wednesday",
        "thursday",
        "friday",
        "saturday",
      ];

      return obj.map(({ groupName, shifts }) => {
        const result = {
          groupName,
        };

        shifts.forEach((shiftsPerDay, index) => {
          result[daysOfWeek[index]] =
            shiftsPerDay.length > 0 ? shiftsPerDay[0] : null;
        });

        return result;
      });
    }
    const fetchShifts = async () => {
      try {
        const response = await axios.get("http://localhost:3001/api/groups", {
          contentType: "application/json",
        });
        // console.log("response", response.data);
        const data = transformObject(response.data);
        console.log("data", data);
        setShiftsData(data);
      } catch (error) {
        // setMessage("Error occurred while submitting group configuration");
        console.error(error);
      }
    };
    fetchShifts();
  }, []);

  return <Table shiftsData={shiftsData} />;
};

export default ShiftTable;
