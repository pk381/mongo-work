const path = require("path");
const rootDir = require("../util/path");
const User = require('../mongoModels/user');
const Expense = require('../mongoModels/expense');

const mongoDb = require('mongodb');

const getDb = require('../util/mongodb').getDb;


exports.getMain = (req, res, next) => {
  res.sendFile(path.join(rootDir, "views", "main.html"));
};


exports.postAddExpense = async (req, res, next) => {

  const amount = req.body.amount;
  const description = req.body.description;
  const category = req.body.category;

  try {

    console.log(req.user._id);

    const mongoExpense = new Expense({
      amount: amount,
      description: description,
      category: category,
      userId: req.user._id
    });

    const expense = await mongoExpense.save();

    let user = await User.findById(req.user._id);

    user.totalExpense += parseInt(amount);

    await user.save();
    
    res.status(201).json({ expense: expense });
  } catch(err) {
    console.log(err);
  }
};

exports.getExpenses = async (req, res, next) => {

  try {
    
    const pageSize = parseInt(req.query.pageSize);
    const page = parseInt(req.query.page);

    const count = await Expense.count({userId: req.user._id});

    console.log(count);

    const expenses = await Expense.find({userId: req.user._id});

    res.status(201).json({ expenses: expenses,
       currentPage: page,
       nextPage: page + 1,
       hasNextPage: (page*pageSize) < count,
       hasPreviousPage: page > 1,
       previousPage: page-1,
       lastPage: Math.ceil(count/pageSize)
    });

  } catch(err) {
    console.log("err2", err);
  }
};

exports.deleteExpense = async (req, res, next) => {

  const transaction = await sequelize.transaction();

  try {
    const id = req.params.expenseId;

    // console.log(id);

    const expense = await Expense.findByPk(id);

    const user = await User.findOne({where: {id: expense.userId}});

    await Expense.destroy({ where: {id: id}, transaction: transaction });

    await User.update({totalAmount: user.totalAmount - expense.amount}, { where: {id: user.id}, transaction: transaction});

    await transaction.commit();

    res.sendStatus(200);

  } catch (err){

    await transaction.rollback();
    console.log(err);
    res.status(500).json(err);
  }
};