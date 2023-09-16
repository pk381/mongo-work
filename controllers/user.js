const path = require("path");
const rootDir = require("../util/path");
const bcrypt = require("bcrypt");
const jwt = require('jsonwebtoken');

const MongoUser = require('../mongoModels/user');

function generateToken(id){

  return jwt.sign({id: id}, 'secretKey');
}


exports.getSignUp = (req, res, next) => {

  res.sendFile(path.join(rootDir, "views", "sign_up.html"));
};

exports.getLogin = (req, res, next) => {

  console.log("login Page");
  res.sendFile(path.join(rootDir, "views", "login.html"));
};

exports.postLogin = async (req, res, next) => {
  try {

    const user = await MongoUser.fetchByEmail(req.body.email);

    if (user === null) {
      res.status(401).json({ message: "user not exist" });
    } else{

        bcrypt.compare(req.body.password, user.password, async (err, result)=>{

            console.log("err", err);
            
            if(result === true){
                res.status(201).json({message: "login successfully",userName: user.name, isPremium: user.isPremuimUser, token: generateToken(user._id)});
            }
            else{
                res.status(401).json({message: "password did not match"});
            }
        })

    }
  } catch (err) {
    console.log(err);
  }
};

exports.postSignUp = async (req, res, next) => {
  try {

    // const isUser = await MongoUser.fetchByEmail(req.body.email);


    if (true) {

        bcrypt.hash(req.body.password, 10, async (err, hash)=>{

            console.log(err);

            let mongoUser = new MongoUser({
              name: req.body.name, 
              email: req.body.email,
              password: hash,
              isPremium: false,
              totalExpense: 0
            });

            let user = await mongoUser.save();

            res.status(201).json({ user: user });

        })
    } else {
      res.status(403).json({ user: "userExist" });
    }
  } catch (err) {

    console.log(err);
    res.status(500).json(err);
  }
};
