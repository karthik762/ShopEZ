const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true
  },

  email: {
    type: String,
    required: true,
    unique: true
  },

  password: {
    type: String,
    required: true
  },

  usertype: {
    type: String,
    default: "Customer"
  },

  address: {
    type: String,
    default: ""
  },

  phone: {
    type: String,
    default: ""
  }
});

module.exports = mongoose.model("User", userSchema);