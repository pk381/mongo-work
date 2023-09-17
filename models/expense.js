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
    userId:{
        type: Schema.Types.ObjectId,
        ref: 'user'
    } 
});

module.exports = mongoose.model('expense', expenseSchema);