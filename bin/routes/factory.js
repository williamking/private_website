// Generated by LiveScript 1.3.1
(function(){
  var express, bcrypt, requireLogin, hasLogin, router2;
  express = require('express');
  bcrypt = require('bcrypt');
  requireLogin = require('./authorization/authorize.js').requireLogin;
  hasLogin = require('./authorization/authorize').hasLogin;
  router2 = express.Router();
  router2.get('/', function(req, res){
    res.write('Constructing....');
    res.end();
  });
  router2.get('/drawing', function(req, res){
    res.render('drawing');
  });
  router2.get('/threejs', function(req, res){
    res.render('3dworld');
  });
  router2.get('/imageprocess', function(req, res){
    res.render('imageProcess');
  });
  module.exports = router2;
}).call(this);
