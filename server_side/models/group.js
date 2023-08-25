const mongoose = require('mongoose');

const groupSchema = new mongoose.Schema({
  groupName: { type: String, required: true },
  shifts: [[
    {
      start: { type: String, required: true },
      end: { type: String, required: true },
      workersNeeded: { type: Number, required: true },
      assignedEmployees: {type: [{employeeName: String, employeeEmail: String}], required: false},
    },
  ]],
  groupEmployees: [
    {
      employeeName: { type: String, required: true },
      employeeEmail: { type: String, required: true },
      employeeAvailability: { type: [[Boolean]], required: false},
      totalShifts: { type: Number, required: false },
    },
  ],
  autoAssigned: { type: Boolean, default: false },
  
});

const Group = mongoose.model('Group', groupSchema);

module.exports = Group;
