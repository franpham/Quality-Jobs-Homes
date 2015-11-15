"use strict";

var request = require('request');
var express = require('express');
var router = express.Router();

router.get('/us/homes', function(req, res) {
  var homes = require('../api_data/home_data.js');
  res.json([homes]);
});

router.get('/us/rentals', function(req, res) {
  var quandl= require('../api_data/Quandl_cityCodes.js');
  var rents = require('../api_data/rent_counts.js');
  var leases= require('../api_data/rent_prices.js');
  var ratio = require('../api_data/rent_ratio.js');
  var TESTCITY = 'Miami';
  var CITYCODE = quandl.codes[TESTCITY];
  res.json([rentals]);
});

router.get('/us/jobs', function(req, res) {
  var jobCats = require('../api_data/Indeed_jobCats.js');
  var jobs  = require('../api_data/job_listings.js');
  res.json([jobs]);
});

module.exports = router;