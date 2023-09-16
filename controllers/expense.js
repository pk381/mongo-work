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

    const mongoExpense = new Expense(amount, description, category, req.user._id);

    const expense = await mongoExpense.save();

    console.log(expense);

    const db = getDb();

    await db.collection('user').updateOne({_id: new mongoDb.ObjectId(req.user._id)}, {$set: {
        totalExpense: req.user.totalExpense + parseInt(expense.amount)}});
    
    res.status(201).json({ expense: expense });
  } catch(err) {
    console.log(err);
  }
};

exports.getExpenses = async (req, res, next) => {

  try {
    
    const pageSize = parseInt(req.query.pageSize);
    const page = parseInt(req.query.page);

    const expenses = await Expense.fetchAll(req.user._id, (page-1)*pageSize, pageSize);

    let count = await Expense.count(req.user._id);

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