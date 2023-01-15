const mongoose = require("mongoose");
const uniqueValidator = require("mongoose-unique-validator");

const Schema = mongoose.Schema;

const userSchema = new Schema({
  name: { type: String },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true, minlength: 6 },
  city: { type: String },
  weatherAlerts: { type: Boolean },
});

userSchema.plugin(uniqueValidator);

module.exports = mongoose.model("User", userSchema);
