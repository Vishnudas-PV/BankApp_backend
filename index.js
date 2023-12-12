//create a server application using express

// 1. import express
const express = require('express'); //importing express is asigning require to a variable
// 5. import cors
const cors = require('cors');

const logic = require('./services/logic');

//import json web token
const jwt = require('jsonwebtoken');

// 2. create a sever application using express
const server = express() //creates express application
// 6. use cors
server.use(cors({
  origin:'http://localhost:4200'
}))

//7.
server.use(express.json()) //returns the middleware that only parses json


// 3. setup port for server application
server.listen(5000, () => {
  console.log(('server listening on port 5000'));
})  //server running ano enn ariyaan.

// 4. install cors - cross origin resource share
//npm i cors in terminal

// 5. import corse -  import statements are given at the top
// 6. use cors

// API call to resolve - localhost:5000
// server.get('/',(req,res) => {
//   res.send('Welcome to backend')
// })

// server.post('/',(req,res)=>{
//   console.log('server post');
// })

//Using middleware
// const appMiddleware = (req, res, next) => {
//   console.log('Application-level middleware');
//   next (); //if next is not given, the request will be processing to infinity
// }
// server.use(appMiddleware)

//router levle middleware
const jwtMiddleware = (req,res,next) => {
  console.log('Router level middleware');
  try{
    const token = req.headers['verify-token']
  console.log(token);
  const data = jwt.verify(token, 'superkey2023')
  console.log(data);
  req.currentAcno= data.loginAcno
  next ();
  }
  catch{
    res.status(401).json({message:'Please Login'})
  }
}



//API CALLS
//Register - localhost:5000/register
server.post('/register',(req,res) => {
  console.log('inside register API');
  console.log(req.body);

  //logic to resolve register request
  logic.register(req.body.username, req.body.acno, req.body.password).then((response) => {
    res.status(response.statusCode).json(response) //status and message changed to corresponding value in db.js and moved inside the logic 

  })
})
//Login - localhost:5000/login
server.post('/login',(req,res) => {
  console.log('inside login API');
  console.log(req.body);

  //logic to resolve login request
  logic.login(req.body.acno,req.body.password).then((response) => {
    res.status(response.statusCode).json(response)
  })
})

//balance - localhost:5000/fundTransfer
server.get('/getBalance/:acno',jwtMiddleware,(req,res) => {
  console.log('Inside balance API call');
  console.log(req.params); //
  logic.getBalance(req.params.acno).then((response) => {
    res.status(response.statusCode).json(response)
  })

})

//fundTransfer - localhost:5000/fundTransfer
server.post('/fundtransfer',jwtMiddleware,(req,res) => {
  console.log('Inside fund transfer API call');
  console.log(req.body);
  logic.fundTransfer(req.currentAcno,req.body.password,req.body.toAcno,req.body.amount).then((response) => {
    res.status(response.statusCode).json(response)
  }) //the login acno is taken from index.js > try function (above).
})


//transactions - localhost:5000/transactions
server.get('/transaction',jwtMiddleware,(req,res)=>{
  console.log('Inside transaction API call');
  logic.transactionHistory(req.currentAcno).then((response)=>{
    res.status(response.statusCode).json(response)
  })
})


//dlete account
server.delete('/deleteAccount',jwtMiddleware,(req,res)=>{
  console.log('Inside the delete API request');
  logic.deleteAccount(req.currentAcno).then((response)=>{
    res.status(response.statusCode).json(response)
  })
})