const mongoose = require("mongoose");
const uniqueValidator = require("mongoose-unique-validator");

const Schema = mongoose.Schema;

const userSchema = new Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true, minlength: 6 },
  prefferences: {
    location: [
      {
        city: { type: String },
        latitude: { type: Number },
        longitude: { type: Number },
      },
    ],
    notificationTime: { type: [String] },
    weatherAlerts: { type: Boolean },
  },
});

userSchema.plugin(uniqueValidator);

module.exports = mongoose.model("User", userSchema);
