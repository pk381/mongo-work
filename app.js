const express = require('express');
const path = require('path');
const bodyParser = require('body-parser'); 

// database
const mongoose = require('mongoose');
const app = express();

// routes
const userRoute = require('./routes/user');
const expensRoute = require('./routes/expense');
const purchaseRoute = require('./routes/purchase');
const premiumRoute = require('./routes/premium');
const forgotPasswordRoute = require('./routes/forgot_password');


// static files
app.use(express.static(path.join(__dirname, 'public')));

app.use(bodyParser.json());

app.use('/user',userRoute);
app.use('/expense',expensRoute);
app.use('/purchase',purchaseRoute);
app.use('/premium',premiumRoute);

app.use(forgotPasswordRoute);

// serving index page
app.use('/',(req, res, next)=>{
    res.redirect("/user/sign_up");
});


mongoose.connect('mongodb+srv://prabhat:prabhat@cluster0.yktjrxl.mongodb.net/expensetracker?retryWrites=true&w=majority')
.then(()=>{
    console.log('connected');
    app.listen(4000);

})
.catch(err =>{
    console.log(err);
})

