var express = require('express');
var mysql = require('mysql');
var router = express.Router();
var app = express();
var token = require('./token')



router.post('/system/captcha/get',function (req,res) {
  console.log(12)
  res.send(
    {
      "repCode":"200",
    "repMsg":null,
    "repData":null,
    "success":true}
  )
})
router.get('/system/tenant/get-id-by-name',function(req,res){
  
  res.send({"code":0,"data":1,"msg":""})
})
router.post('/system/auth/login',function(req,res){
  console.log(req.body)
  var tokenValue = token.createToken(req.body,240000000)
  res.send({code:200,data:{
    refreshToken:tokenValue,
    accessToken:tokenValue,
    expiresTime:240000000,
    id:123,
    userId:34,
    userType:0,
    clientId:'df'
  }})
})

module.exports = router;