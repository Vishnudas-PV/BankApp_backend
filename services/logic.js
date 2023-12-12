
// all functions corresponding to all the requests are given here


//to use db, we need to import it here
//import db
const { response } = require('express')
const db = require('./db')

//import json web token
const jwt = require('jsonwebtoken');

//logic for regsiter
const register = (username,acno,password) => {
  return db.User.findOne({acno}).then((response) => {
    console.log(response);
    if (response) {
      return {
        statusCode : 401,
        message : 'Account number already registered'
      }
    }
    else {
      const newUser = new db.User({
        username,
        acno,
        password,
        balance:5000,
        transactions:[]
      })
      //to store the new user in the database
      newUser.save()
      //response send back to the client
      return {
        statusCode : 200,
        message : 'Registration successful'
      }
    }
  })
}

//logic for login
const login =(acno, password) => {
  return db.User.findOne({acno,password}).then((response)=> {
    console.log(response); //full details
    if (response){
      const token = jwt.sign(
        {
          loginAcno : acno
        },
          'superkey2023'
        )

      return {
        statusCode:200,
        message:"Login Successful",
        currentUser : response.username, //current user details send to frontend
        currentBalance : response.balance,
        token,
        currentAcno : acno
      }
    }

    else {
      //if acno and password are not present in database

      return{
        statusCode: 401,
        message : "Invalid credentials"
      }
    }
  })
}

//logic for getting balance
const getBalance = (acno) => {
  return db.User.findOne({acno}).then((result) => {
    if (result) {
      return {
        statusCode : 200,
        balance : result.balance
      }
      
    }
    else { 
      return {
        statusCode: 401,
        message : 'Invalid Account Number'
      }
    }
  })
}

//fundTransfer
const fundTransfer = (fromAcno,fromPswd,toAcno,amt) => {
  //amt convert to a number
  let amount = parseInt(amt)

  return db.User.findOne({acno:fromAcno,password:fromPswd}).then((debit) => {
    if (debit){
      //check toAcno in mongoDB
      return db.User.findOne({acno:toAcno}).then ((credit) => {
        //fund transfer
        if(credit){
          if(debit.balance>=amount){
            debit.balance -= amount //debit.balance - amount = debit.balance
            debit.transactions.push ({
              type:'Debit',
              amount,
              fromAcno,
              toAcno
            })
          debit.save()


            credit.balance += amount
            credit.transactions.push ({
              type : 'Credit',
              amount,
              toAcno,
              fromAcno
            })
            //save changes into database
          credit.save()

          //send response back to client
          return {
            statusCode : 200,
            message : 'Fund transfer successful..'
          }

          }
          else {
            return {
              statusCode : 400,
              message : 'Insufficient Amount'
            }
          }
          
        }
        else {
          return {
            statusCode : 400,
            message : 'Invalid Credit Details'
          }
        }
      })
    }
    else {
      return {
        statusCode : 400,
        message : 'Invalid Debit Details'
      }
    }
  })
}

const transactionHistory=(acno)=>{
//check acno present in mongodb
return db.User.findOne({acno}).then((result)=>{
  if(result){
    return{
      statusCode:200,
      transactions:result.transactions
    }
  }
  else{
    return {
      statusCode:401,
      message:'Invalid Data'
    }
  }
})



}
//deleting account
const deleteAccount=(acno)=>{
//account delete from database
return db.User.deleteOne({acno}).then((result)=>{
  return{
    statusCode:200,
    message:"Account deleted successfully"
  }
})


}

//function register will be inactive first, so we need to export it to use.
module.exports = {
  register,
  login,
  getBalance,
  fundTransfer,
  transactionHistory,
  deleteAccount
}