var express = require('express');
var router = express.Router();
var user = require('../models/user');

var data;

router.post('/', (req, res) => {
    var date = new Date();
    var actno = req.body.actno;
    var balance = req.body.balance;


    user.User.find({actno:actno},function(err,foundData){

        if(!err){
            data = foundData;
        }
        

    });

    user.User.update({actno:actno} , {lastup: new Date()} , function (err) {
        
        console.log(data);

        if(!err) {

            console.log("Date has been updated");

            if (balance != data[0]["balance"]) {
                console.log("Date updated and balance changed");
                res.json({
                    "status": 1,
                    "balance":data[0]["balance"]
                });
            }
            else {
                console.log("Last date updated");
                res.json({
                    "status": 0
                })
            }
        }
    });

});

module.exports = router;