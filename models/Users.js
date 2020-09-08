const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const UserSchema = new Schema({
  firstName: String,
  lastName: String,
  project: {
    type: Schema.Types.ObjectId,
    ref: "Projects",
  },
});

module.exports = mongoose.model("Users", UserSchema);
