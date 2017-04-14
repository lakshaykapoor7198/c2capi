var express = require('express');
var router = express.Router();
var braintree = require("braintree");

var gateway = braintree.connect({
  environment: braintree.Environment.Sandbox,
  merchantId: "dd6v26npbg2khxtm",
  publicKey: "6w36kfp9ktvh38kk",
  privateKey: "2010f013e2bcccf1d95cd1aea5d163ec"
});


router.get('/', function(req, res, next) {

  gateway.clientToken.generate({}, function (err, response) {
    res.send(response.clientToken);
  });


});

module.exports = router;
