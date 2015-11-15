"use strict";

require('./week_utils');
var json = require('./Indeed_jobsList.js');
var items = json.results;
var nextJobQuery = json.end;          // do not increment since start = 1;
var jobCounts = json.totalResults;    // = available jobs; DO NOT use BLS' jobs_1000 since that's = taken jobs;
var week = (new Date()).getWeek();
var year = (new Date()).getWeekYear();
var CATEGORY = 'Computer / Internet';
var CITYCODE = '00033';  // for Miami;
var TESTSTATE= 'FL';

var jobs = [];
for(var i = 0; i < items.length; i++) {
  var data = { time: year + '-' + week, cityCode: CITYCODE, state: TESTSTATE, category: CATEGORY, jobtitle: items[i].jobtitle, company: items[i].company,
               url: items[i].url, date: items[i].date, snippet: items[i].snippet, lat: items[i].latitude, lng: items[i].longitude };
  jobs[i] = data;
}
module.exports = jobs;

// jobs_list schema (11 fields): time, cityCode, state, category, jobtitle, company, url, date, snippet, lat, lng;
// job_stats schema  (7 fields): time, cityCode, state, category, jobCounts (from Indeed), medianSalary (from BLS), loc_quotient (density from BLS);

// initialize DB with 91 days of data, then search again every Monday when week # changes;
// http://api.indeed.com/ads/apisearch?publisher=1588917421720308&format=json&start=0&fromage=91&jt=fulltime&l=miami%2Cfl&latlong=1&limit=50&q=web+developer&radius=50&st=employer&useragent=&userip=0.0.0.0&v=2
// set st=employer so map markers don't overlap and duplicates are not shown; "limit" of 25 is returned, so see "totalResults" field for total listings;
