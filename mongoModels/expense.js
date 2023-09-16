const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const expenseSchema = new Schema({

    amount:{
        type: Number,
        require: true
    },
    description:{
        type: String,

    },
    category:{
        type: String
    },
    userId: String 
});

module.exports = mongoose.model('expense', expenseSchema);