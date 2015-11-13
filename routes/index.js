"use strict";

var request = require('request');
var express = require('express');
var router = express.Router();

var cities  = require('../api_data/Quandl_cityCodes.js');
var jobCats = require('../api_data/Indeed_jobCategories.js');
var jobs  = require('../api_data/job_listings.js');
var homes = require('../api_data/home_data.js');
var rents = require('../api_data/rent_counts.js');
var leases= require('../api_data/rent_prices.js');
var ratio = require('../api_data/rent_ratio.js');
var CITYCODE = cities.Miami;

// rental datasets are matched to home_data's length;
var rentals = new Array(homes.length);
for (var i = 0; i < homes.length; i++) {
  var month = homes[i].month;
  rentals[i] = { month: month, city: CITYCODE, rentCounts: rents[month], medianPrice: leases[month], rentRatio: ratio[month], usTraffic: homes[i].usTraffic };
}

router.get('/hireOwnerOnly', function(req, res) {
  console.log('Initializing hire database...');

  var homeStats = req.db.get('home_stats');
  homeStats.insert(homes, { ordered: false }, function(err, doc) {
    console.log('Inserted homes into home_stats collection');
  });
  homeStats.index({ 'month' : 1 }, { 'name' : 'homeStats_monthAsc' });
  homeStats.index({ 'city' : 1 }, { 'name' : 'homeStats_cityAsc' });
  // must create index using monk's function (index), NOT mongodb (createIndex);

  var rentStats = req.db.get('rent_stats');
  rentStats.insert(rentals, { ordered: false }, function(err, doc) {
    console.log('Inserted rentals into rent_stats collection');
  });
  rentStats.index({ 'month' : 1 }, { 'name' : 'rentStats_monthAsc' });
  rentStats.index({ 'city' : 1 }, { 'name' : 'rentStats_cityAsc' });

  var jobsList = req.db.get('jobs_list');
  jobsList.insert(jobs, { ordered: false }, function(err, doc) {
    console.log('Inserted jobs into jobs_list collection');
  });
  jobsList.index({ 'city' : 1 }, { 'name' : 'jobsList_cityAsc' });
  jobsList.index({ 'category' : 1 }, { 'name' : 'jobsList_categoryAsc' });

  res.send('Finished creating collections and indexes for rentals, homes, and jobs.');
  // jobs_list schema (10 fields): week, city, category, jobtitle, company, url, date, snippet, latitude, longitude;
  // job_stats  schema (6 fields): month, city, category, jobCounts, medianSalary, loc_quotient (density);
  // rent_stats schema (6 fields): month, city, rentCounts, medianPrice, rentRatio, usTraffic;
  // home_stats schema (6 fields): month, city, homeCounts, medianPrice, averagePrice, usTraffic;
});

router.get('/', function(req, res) {
  res.send('Database hire start-up...');
  // res.render('index', { jobs: jobs, homes: homes, rentals: rentals });
});

module.exports = router;