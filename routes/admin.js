"use strict";

var express = require('express');
var router = express.Router();

var jobCats = require('../api_data/Indeed_jobCats.js');
var jobs  = require('../api_data/job_listings.js');
var homes = require('../api_data/home_data.js');
var quandl= require('../api_data/Quandl_cityCodes.js');
var rents = require('../api_data/rent_counts.js');
var leases= require('../api_data/rent_prices.js');
var ratio = require('../api_data/rent_ratio.js');
var TESTCITY = 'Miami';
var CITYCODE = quandl.codes[TESTCITY];

var rentals = new Array(homes.length - 1);    // homes.length - 1 since rental data lags home data by 1 month;
for (var i = 1; i < homes.length; i++) {      // start at 1 since data in sorted in descending order;
  var time = homes[i].time;
  rentals[i - 1] = { time: time, cityCode: CITYCODE, state: homes[i].state, rentCounts: rents[time], medianPrice: leases[time], rentRatio: ratio[time], usTraffic: homes[i].usTraffic };
}

router.get('/dbInit', function(req, res) {
  console.log('Initializing hire database...');

  var homeStats = req.db.get('home_stats');
  homeStats.insert(homes, { ordered: false }, function(err, doc) {
    console.log('Inserted homes into home_stats collection');
  });
  homeStats.index({ 'time' : 1 }, { 'name' : 'homeStats_monthAsc' });
  homeStats.index({ 'cityCode' : 1 }, { 'name' : 'homeStats_cityAsc' });
  // must create index using monk's function (index), NOT mongodb (createIndex);

  var rentStats = req.db.get('rent_stats');
  rentStats.insert(rentals, { ordered: false }, function(err, doc) {
    console.log('Inserted rentals into rent_stats collection');
  });
  rentStats.index({ 'time' : 1 }, { 'name' : 'rentStats_monthAsc' });
  rentStats.index({ 'cityCode' : 1 }, { 'name' : 'rentStats_cityAsc' });

  var jobsList = req.db.get('jobs_list');
  jobsList.insert(jobs, { ordered: false }, function(err, doc) {
    console.log('Inserted jobs into jobs_list collection');
  });
  jobsList.index({ 'cityCode' : 1 }, { 'name' : 'jobsList_cityAsc' });
  jobsList.index({ 'category' : 1 }, { 'name' : 'jobsList_categoryAsc' });

  res.send('Finished creating collections and indexes for rentals, homes, and jobs.');
});
// jobs_list schema (11 fields): time, cityCode, state, category, jobtitle, company, url, date, snippet, lat, lng;
// job_stats  schema (7 fields): time, cityCode, state, category, jobCounts, medianSalary, loc_quotient (density);
// rent_stats schema (7 fields): time, cityCode, state, rentCounts, medianPrice, rentRatio, usTraffic (popularity);
// home_stats schema (7 fields): time, cityCode, state, homeCounts, medianPrice, averagePrice, usTraffic (popularity);
// for rentals PRR: larger values = cheaper renting; for rentals && homes usTraffic: larger values = more popular areas;

router.get('/', function(req, res) {
  res.render('index', { jobs: jobs, homes: homes, rentals: rentals });
});

module.exports = router;