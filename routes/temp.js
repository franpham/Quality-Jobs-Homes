"use strict";

var request = require('request');
var express = require('express');
var router = express.Router();

router.get('/', function(req, res) {
  //      // -------------------- GET DATA FROM MONGO ---------------

  res.render('index', { jobs: jobs, homes: homes, rentals: rentals });
});

module.exports = router;