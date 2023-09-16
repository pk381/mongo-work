const getDb = require('../util/mongodb').getDb;

const mongoDb = require('mongodb');

class Expense {

    constructor(amount, description, category, userId){
        this.amount = amount;
        this.description = description;
        this.category = category;
        this.userId = userId;
    }

    save(){

        const db = getDb();
        return db.collection('expense').insertOne(this)
        .then(expense=>{
            return this;
        })
        .catch(err=>{
            console.log(err);
        })

    }


    static fetchAll(userId, offset, limit){
        const db = getDb();
        return db.collection('expense').find({userId: new mongoDb.ObjectId(userId)})
        .skip(offset).limit(limit).toArray()
        .then(res=>{
            return res;
        })
        .catch(err=>{
            console.log(err);
        });
    }


    static count(userId){
        const db = getDb();
        return db.collection('expense').find({userId: new mongoDb.ObjectId(userId)}).toArray()
        .then(res=>{
            return res.length;
        })
        .catch(err=>{
            console.log(err);
        });
    }


    static fetchById(expenseId){

        const db = getDb();

        return db.collection('expense').find({_id: new mongoDb.ObjectId(expenseId)})
        .next()
        .then(res=>{
            return res;
        })
        .catch(err=>{
            console.log(err);
        });

    }

    static update(expenseId){

        const db = getDb();

        return db.collection('expense').updateOne({_id: new mongoDb.ObjectId(expenseId)}, {$set: {}})
        .then(res=>{
            console.log(res);
            return res;
        })
        .catch(err=>{
            console.log(err);
        })
    }

    static deleteById(expenseId){

        const db = getDb();

        return db.collection('expense').deleteOne({_id: new mongoDb.ObjectId(expenseId)})
        .then(res=>{
            console.log(res);
            return res;
        })
        .catch(err=>{
            console.log(err);
        });
    }
}

module.exports = Expense;