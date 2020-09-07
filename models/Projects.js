const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const ProjectSchema = new Schema({
  manager: {
    type: Schema.Types.ObjectId,
    ref: 'Users'
   },
  title: String,
});

module.exports = mongoose.model("Projects", ProjectSchema);
