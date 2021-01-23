/* eslint-disable key-spacing */
const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
  name:     { type: String, required: true, maxlength: 100 },
  email:    { type: String, required: true, unique: true },
  password: { type: String, required: true },
});

UserSchema.virtual("url").get(function () {
  return `/catalog/User/${this._id}`;
});

// Export model
module.exports = mongoose.model("User", UserSchema);
