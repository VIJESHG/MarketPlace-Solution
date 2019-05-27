const mongoose = require('mongoose');

var Schema = mongoose.Schema;
var ObjectId = Schema.ObjectId;

var User = mongoose.model( 'User' , new Schema({
    id  : ObjectId,
    username : String,
    //email : { type : String , unique : true } ,
    password : String
}), 'User')
module.exports = User;
