const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const userFilesSchema = new Schema({
  fileName : {
    type: String
  },
  fileUrl:{
    type: String
  },
  userId:{
    type: Schema.Types.ObjectId,
    ref: "user"
  }
});

module.exports = mongoose.model("userFiles", userFilesSchema);
