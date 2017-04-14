var express = require('express');
var router = express.Router();
var user = require('../models/user');
var braintree = require("braintree");

var gateway = braintree.connect({
    environment: braintree.Environment.Sandbox,
    merchantId: "dd6v26npbg2khxtm",
    publicKey: "6w36kfp9ktvh38kk",
    privateKey: "2010f013e2bcccf1d95cd1aea5d163ec"
});

var data;
var userData;

router.post('/', (req, res) => {
    var actno = req.body.actno;
    var nonceFromTheClient = req.body.payment_method_nonce;
    var balanceToAdd = req.body.balanceToAdd;
    var userAccountNumber = req.body.userAccountNumber;




    user.User.findOne({ actno: actno }, (err, data) => {
        var lastup = data.lastup;
        console.log(data);
        var date = new Date();
        
        console.log(date,lastup);
        console.log(date-lastup);
        if ((date - lastup)/1000 < 200) {


            user.User.find({ "actno": actno }, function (err, foundData) {

                data = foundData;

                console.log(data[0]["balance"]);

            });

            user.User.find({"actno":userAccountNumber} , function(err,foundData) {

                    userData = foundData;

                    console.log(userData[0]["balance"]);
            });

            gateway.transaction.sale({
                amount: balanceToAdd,
                paymentMethodNonce: nonceFromTheClient,
                options: {
                    submitForSettlement: true
                }
            }, function (err, result) {

                if (!err) {

                    user.User.update({ actno: actno }, { balance: data[0]["balance"] = data[0]["balance"] + balanceToAdd }, function (err) {
                        if (!err) {
                            console.log("Transaction was successful, balance is updated");
                        }
                    });

                    user.User.update({ actno: userAccountNumber }, { balance: userData[0]["balance"] = userData[0]["balance"] - balanceToAdd }, function (err) {
                        if (!err) {
                            console.log("Transaction was successful, user balance is updated");
                        }
                    });

                   var userAccountTransaction = {"Name":data[0]["name"],"Receiver_Account_Number":actno,"Amount":balanceToAdd,"Date_and_time":new Date()};
                   var receiverAccountTransaction = {"Name":userData[0]["name"],"Sender_Account_Number":userAccountNumber,"Amount":balanceToAdd,"Date_and_time":new Date()};

                   console.log(userAccountTransaction,receiverAccountTransaction);

                   user.User.findOneAndUpdate({actno: userAccountNumber}, {$push: {transactions: userAccountTransaction}},function(err) {
                    if(!err) {
                        console.log("chod");
                    }
                   });
                    
                   user.User.findOneAndUpdate({actno: actno}, {$push: {transactions: receiverAccountTransaction}},function(err) {
                    console.log("chod");
                   });


                }
            });
        }
        else {
            console.log('Reciever is offline');
        }
    });
});

module.exports = router;