"use strict";

var quandl = require('./Quandl_cityCodes.js');
var reader = require('read-file');
var xml2js = require('xml2js');
var parseXML = xml2js.parseString;
// var parseNumbers = xml2js.processors.parseNumbers;
var TESTCITY = 'Miami';
var TESTSTATE= 'FL';
var CITYCODE = quandl.codes[TESTCITY];
var data = {};

// read-file uses node's fs package, which uses paths starting at the root project folder;
var parseNumbers = function(str) { return isNaN(str) ? str : parseFloat(str); };
var trulia = reader.sync('./api_data/trulia.xml', { encoding: 'utf-8', normalize: true });
parseXML(trulia, { valueProcessors: [parseNumbers] }, function(err, result) {
  data = result.TruliaWebServices.response[0].TruliaStats[0];
});
var trafficStats = data.trafficStats[0].trafficStat;
var listingStats = data.listingStats[0].listingStat;

var months = {};
for (var i = 0; i < listingStats.length; i++) {
  var listingItem = listingStats[i];
  var num = listingItem.weekEndingDate[0];
  num = num.substring(0, 7);
  if (!months[num])
    months[num] = { time: num, cityCode: CITYCODE, state: TESTSTATE, homeCounts: 0, medianPrice: 0, averagePrice: 0, usTraffic: 0, count: 0 };
  var listingPrice = listingItem.listingPrice[0].subcategory[0];
  months[num].count++;
  months[num].homeCounts += listingPrice.numberOfProperties[0];
  months[num].medianPrice += listingPrice.medianListingPrice[0];
  months[num].averagePrice += listingPrice.averageListingPrice[0];
}

for (var i = 0; i < trafficStats.length; i++) {
  var trafficItem = trafficStats[i];
  var num = trafficItem.date[0];
  num = num.substring(0, 7);                // all months objects should now exist;
  months[num].usTraffic += trafficItem.percentNationalTraffic[0];
}
var prices = Object.keys(months).map(function(key) { return months[key]; });

for (var i = 0; i < prices.length; i++) {
  prices[i].homeCounts /= prices[i].count;
  prices[i].medianPrice /= prices[i].count;
  prices[i].averagePrice /= prices[i].count;
  prices[i].usTraffic /= prices[i].count;

  prices[i].homeCounts = Math.round(prices[i].homeCounts);
  prices[i].medianPrice = Math.round(prices[i].medianPrice);
  prices[i].averagePrice = Math.round(prices[i].averagePrice);
  prices[i].usTraffic = parseFloat((prices[i].usTraffic).toFixed(2));
  delete prices[i].count;

  // var counters = [];     // FOR TESTING:
  // var digitFormat = new Intl.NumberFormat('en-US', { minimumSignicantDigits: 2 });
  // var moneyFormat = new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' });
  // var dateFormat = new Intl.DateTimeFormat('en-US', { month: 'short', year: 'numeric' });
  // prices[i].month = dateFormat.format(new Date(prices[i].month));
  // counters[i] = { month: dateFormat.format(new Date(prices[i].month)),
  //   homeCounts: digitFormat.format(prices[i].homeCounts), usTraffic: digitFormat.format(prices[i].usTraffic) };
}

prices.reverse();     // put latest months first;
module.exports = prices;

// home_stats schema (6 fields): city, month, homeCounts, medianPrice, averagePrice, usTraffic;
// query (- 3 months) to ensure data availability; endDate MUST BE ON SAT TO AVOID EXTRA WEEKS; ONLY 2 YEARS OF percentNationalTraffic is given;
// http://api.trulia.com/webservices.php?library=TruliaStats&function=getCityStats&city=Miami&state=FL&apikey=vb8fwj79vknntzqeva4fm93u&startDate=2013-08-01&endDate=2015-08-29
