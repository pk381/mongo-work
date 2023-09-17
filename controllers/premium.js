const User = require("../models/user");
const UserExpenseFiles = require("../models/user_expense_files");
const Expense = require('../models/expense');

const S3services = require('../services/S3secvices');

exports.getLeaderBoard = async (req, res, next) => {
  try {
    const users = await User.find();

    let leaderBoard = [];

    users.forEach((user) => {
      leaderBoard.push({
        name: user.name,
        totalExpense: user.totalExpense || 0,
      });
    });

    leaderBoard.sort((a, b) => b.totalExpense - a.totalExpense);

    res.status(201).json(leaderBoard);
  } catch (err) {

    console.log(err);
  }
};

exports.getFileUrls = async (req, res, next) => {
  
  try {

    const fileUrls = await UserExpenseFiles.find({userId: req.user._id});
    console.log("file urls are here", fileUrls)

    res.status(201).json({fileUrls: fileUrls})
    
  } catch (err) {

    console.log(err);
    res.status(500).json({err});
  }
};


exports.getDownload = async (req, res, next) => {

  try {

    const expeses = await Expense.find({userId: req.user._id});

    const stringifiedExpense = JSON.stringify(expeses);

    const date = new Date();

    const filename = `Expense_${
      req.user._id
    }_${date.getDate()}/${date.getMonth()}/${date.getFullYear()}/${date.getTime()}.txt`;
    const url = await S3services.uploadToS3(stringifiedExpense, filename);

    const file = new UserExpenseFiles({
      fileName: `${date.getDate()}/${date.getMonth()}/${date.getFullYear()}/${date.getTime()}.txt`,
      fileUrl: url,
      userId: req.user._id
    });

    await file.save();

    res.status(201).json({ url: url });
  } catch (err) {
    console.log(err);
    res.status(500).json({ url: null, err: err });
  }
};
