var express = require('express');
var User = require('../models/user');

var userRouter = express.Router();

userRouter
  .route('/v1/user/register')
  .post(function(request, response){
    response.status(400).json({
      message: 'API not available'
    });
  });

module.exports = userRouter
