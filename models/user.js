/* eslint-disable key-spacing */
const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
  firstName: { type: String, required: true, maxlength: 100 },
  lastName:  { type: String, required: true, maxlength: 100 },
  email:     { type: String, required: true, unique: true },
  password:  { type: String, required: true },
});

// Virtual for User's full name
UserSchema.virtual("name").get(function () {
  return `${this.lastName}, ${this.firstName}`;
});

UserSchema.virtual("url").get(function () {
  if (this) { console.log({ UserSchema }); }
  return `/catalog/User/${this._id}`;
});

// Export model
module.exports = mongoose.model("User", UserSchema);
