const Sib = require('sib-api-v3-sdk');
require('dotenv').config();
const path = require("path");
const rootDir = require("../util/path");
const uuid = require('uuid');
const ForgotPassword = require('../models/forgot_password');
const User = require('../models/user');
const bcrypt = require('bcrypt');

exports.getForgotPassword = async (req, res, next)=>{

    res.sendFile(path.join(rootDir, "views", "forgot_password.html"));
}


exports.postForgotPassword = async (req, res, next)=>{

    const email = req.body.email;

    try{
        const user = await User.findOne({email: email});

        if(user){

            const forgotPass = new ForgotPassword({
                id: uuid.v4(),
                active: true,
                userId: user._id
            });


            await forgotPass.save();

            const client = Sib.ApiClient.instance;
            const apiKey = client.authentications['api-key'];

            apiKey.apiKey = 'xsmtpsib-67e2aa4649354c2b8fd2a976f88a9ad811891c90efbf83df3a9aeaad398824e2-RJIc3zYf9WNTyZQD';

            const tranEmailApi = new Sib.TransactionalEmailsApi();

            const sender = {email: 'kumarprabhat0023@gmail.com'};
            const receivers = [{email: email}];

            await tranEmailApi.sendTransacEmail({
                sender,
                to: receivers,
                subject: 'forgot password',
                textContent: `reset your password`,
                htmlContent:`http://localhost:4000/reset-password/${forgotPasswordCreate.id}`
             });
        }
    }
    catch(err){
        console.log(err);
    }
}

exports.getResetPassword = async (req, res, next)=>{

    const forgotPasswordId = req.params.id;

    try{

        const forgotPassword = await ForgotPassword.findById(forgotPasswordId);

        if(forgotPassword){

            forgotPassword.isActive = false;
            
            await forgotPassword.save();

            res.status(200).send(`<html>
                <script>
                    function formsubmitted(e){
                        e.preventDefault();
                        console.log('called')
                    }
                </script>
                <form action="/update-password/${forgotPasswordId}" method="get">
                    <label for="newpassword">Enter New password</label>
                    <input name="newpassword" type="password" required></input>
                    <button type="submit">reset password</button>
                </form>
            </html>`
            );
        }

    }
    catch(err){
        console.log(err);
    }
}

exports.getUpdatedPassword = async (req, res, next)=>{

    const id = req.params.id;

    const newPassword = req.query.newpassword;

    try{

        const details = await ForgotPassword.findById(id);
        const user = await User.findById(details.userId);
    
        bcrypt.hash(newPassword, 10, async (err, hash)=>{

            if(err){
                console.log(err);
            }
            else{
                user.password = hash;
                await user.save();
            }
        });
        
        res.status(201).json({message: "password updated successfully"});
    }
    catch(err){
        console.log(err);
    }
}