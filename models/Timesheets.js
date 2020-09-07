const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const TimesheetSchema = new Schema({
  project: {
    type: Schema.Types.ObjectId,
    ref: 'Projects'
  },
  user: {
    type: Schema.Types.ObjectId,
    ref: 'Users'
   },
  date: Date,
  timeSpent: Number,
  approvedBy: {
    type: Schema.Types.ObjectId,
    ref: 'Users'
   },
  ApprovedDate: Date,
  month: String,
  status: String,
});

module.exports = mongoose.model("Timesheets", TimesheetSchema);
