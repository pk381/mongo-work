const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const orderSchema = new Schema({

  paymentId: {
    type: String
  },
  orderId: {
    type: String
  },
  status: {
    type: String
  },
  userId: {
    type: Schema.Types.ObjectId,
    ref: "user"
  }
});

module.exports = mongoose.model("order", orderSchema);