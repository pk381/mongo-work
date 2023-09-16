const express = require('express');

const router = express.Router();

const userController = require('../controllers/user');

router.get('/sign_up', userController.getSignUp);

router.post('/sign_up', userController.postSignUp);

router.get('/login', userController.getLogin);

router.post('/login', userController.postLogin);

module.exports = router;