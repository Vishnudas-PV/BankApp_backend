//import Mongoose
const mongoose = require('mongoose')

//2 Define connection between mongoose and node
mongoose.connect('mongodb://localhost:27017/BankappApr')

//3 create a model and schema for storing data
const User=mongoose.model('User',{
    username:String,
    acno:Number,
    password:String,
    balance:Number,
    transactions:[]

})

module.exports={
    User
}