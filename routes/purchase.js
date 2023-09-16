const express = require('express');
const router = express.Router();
const purchaseControllers = require('../controllers/purchase');
const authentication = require('../middleware/auth');

router.get('/premiummembership',authentication.authantication,purchaseControllers.purchasePremium);

router.post('/updatestatus',authentication.authantication,purchaseControllers.updateOrder);

router.post('/updatefailure',authentication.authantication,purchaseControllers.updateFailure);


module.exports = router;