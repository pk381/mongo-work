const getDb = require('../util/mongodb').getDb;

const mongoDb = require('mongodb');

class User {

    constructor(name, email, password, isPremiumUser, totalExpense, userId){
        this.name = name;
        this.email = email;
        this.password = password;
        this.isPremiumUser = isPremiumUser;
        this.totalExpense = totalExpense;
        this._id = userId;
    }

    save(){

        const db = getDb();

        if(this._id){

            return db.collection('user').updateOne({_id: new mongoDb.ObjectId(this._id)}, {$set: this});
        }
        else{
            return db.collection('user').insertOne(this)
            .then(res =>{
                return this;
            })
            .catch(err=>{
                console.log(err);
            });
        }


    }


    static fetchAll(){
        const db = getDb();
        return db.collection('user').find().toArray()
        .then(res=>{
            console.log(res);
            return res;
        })
        .catch(err=>{
            console.log(err);
        });
    }


    static fetchByEmail(userEmail){

        const db = getDb();

        return db.collection('user').find({email: userEmail})
        .next()
        .then(user=>{
            return user;
        })
        .catch(err=>{
            console.log(err);
        });

    }

    static fetchById(userId){

        const db = getDb();

        return db.collection('user').find({_id: new mongoDb.ObjectId(userId)})
        .next()
        .then(user=>{

            return user;
        })
        .catch(err=>{
            console.log(err);
        });

    }

    static deleteById(userId){

        const db = getDb();

        return db.collection('user').deleteOne({_id: new mongoDb.ObjectId(userId)})
        .then(res=>{
            console.log(res);
            return res;
        })
        .catch(err=>{
            console.log(err);
        });
    }
}

module.exports = User;