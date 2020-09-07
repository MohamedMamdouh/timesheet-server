const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const TimelogSchema = new Schema({
  project: {
    type: Schema.Types.ObjectId,
    ref: 'Projects'
  },
  user: {
     type: Schema.Types.ObjectId,
     ref: 'Users'
    },
  date: Date,
  from: String,
  to: String,
});

module.exports = mongoose.model("TimeLogs", TimelogSchema);
