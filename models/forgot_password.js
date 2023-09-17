const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const forgotPasswordSchema = new Schema({
  url: {
    type: String
  },
  isActive:{
    type: Boolean
  }
});

module.exports = mongoose.model("forgotPassword", forgotPasswordSchema);
