var mongoose = require('mongoose');
var promise  = require('bluebird');
var user = mongoose.Schema({
    name:{
        type:String
    },
    cardno:{
        type:Number
    },
    actno:{
        type:Number
    },
    balance:{
        type:Number
    },
    lastup:{
        type:Date
    },

    transactions:{
        type:Array
    }

});



var User  = mongoose.model('User',user);
exports.User = User;