const express = require('express');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const router = express.Router();
var {check, validationResult } = require('express-validator');

var User = require('../models/user');

//verification middleware
auth = function(req,res,next){
  var token = req.body.token || req.query.token || req.headers['x-access-token']
  if(token.startsWith('Bearer')){
      token = token.slice(7, token.length);
  }
  if(token){
      jwt.verify(token,process.env.PRIVATE_KEY,(err, decoded)=>{
          if(err){
              return res.json({
                  success: false,
                  message:'token is not valid'
              })
          }
          else{
              req.decoded = decoded;
              next();
          }
      })
  }
  else{
      return res.json({
          success:false,
          message: 'autho token is not provided'
      })
  }
}
module.exports = router;
