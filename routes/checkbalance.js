var express = require('express');
var router = express.Router();
var braintree = require("braintree");
var db = require('../models/user.js');

var gateway = braintree.connect({
  environment: braintree.Environment.Sandbox,
  merchantId: "dd6v26npbg2khxtm",
  publicKey: "6w36kfp9ktvh38kk",
  privateKey: "2010f013e2bcccf1d95cd1aea5d163ec"
});


router.post('/', function(req, res, next) {

	var userAccountNumber = req.body.userAccountNumber;
	console.log(userAccountNumber);

	db.User.find({actno:userAccountNumber} , function(err,foundData) {

		if(!err) {
			
			res.end(foundData[0]["balance"]+'');
		}


	});

});

module.exports = router;
