"use strict";

var quandl = require('./Quandl_cityCodes.js');
var trulia = require('./Trulia_homeStats.js');
var parseXML = require('xml2js').parseString;
var TESTCITY = 'Miami';
var TESTSTATE= 'FL';
var CITYCODE = quandl.codes[TESTCITY];
var data = {};

var parseNumbers = function(str) { return isNaN(str) ? str : parseFloat(str); };
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
  if (!months[num])       // NOTE: listingStats is given per week, but trafficStats is given per day;
    months[num] = { time: num, cityCode: CITYCODE, state: TESTSTATE, homeCounts: 0, medianPrice: 0, averagePrice: 0, count: 0,
      usTraffic: { value: 0, count: 0 } };
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
  months[num].usTraffic.value += trafficItem.percentNationalTraffic[0];
  months[num].usTraffic.count++;
}
var prices = Object.keys(months).map(function(key) { return months[key]; });

for (var i = 0; i < prices.length; i++) {
  prices[i].homeCounts /= prices[i].count;
  prices[i].medianPrice /= prices[i].count;
  prices[i].averagePrice /= prices[i].count;
  prices[i].usTraffic.value /= prices[i].usTraffic.count;
  prices[i].usTraffic = prices[i].usTraffic.value;    // reassign usTraffic to just the value;

  prices[i].homeCounts = Math.round(prices[i].homeCounts);
  prices[i].medianPrice = Math.round(prices[i].medianPrice);
  prices[i].averagePrice = Math.round(prices[i].averagePrice);
  prices[i].usTraffic = parseFloat((prices[i].usTraffic).toFixed(2));
  delete prices[i].count;

  // var digitFormat = new Intl.NumberFormat('en-US', { minimumSignicantDigits: 2 });
  // var moneyFormat = new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' });
  // var dateFormat = new Intl.DateTimeFormat('en-US', { month: 'short', year: 'numeric' });
}

prices.reverse();     // put latest months first;
module.exports = prices;
// home_stats schema (7 fields): time, cityCode, state, homeCounts, medianPrice, averagePrice, usTraffic (popularity);

// initialize the database with 2 yrs of data (-1 month), then search again every 1st Sat of month (-1 month) when month # changes; Trulia's data lags only by 1 week, but -1 month to get full month data;
// since Trulia's home data is provided before BLS' rental data, when storing new month data for homes, also store data for rentals, but don't set the state field to flag that rental data needs to be loaded & stored;
// IMPORTANT: endDate MUST BE ON SAT TO AVOID EXTRA WEEKS; to get the latest percentNationalTraffic, endDate must be specified and startDate must be 2013-09-01 or later;
// http://api.trulia.com/webservices.php?library=TruliaStats&function=getCityStats&city=Miami&state=FL&apikey=vb8fwj79vknntzqeva4fm93u&startDate=2013-09-01&endDate=2015-10-31
