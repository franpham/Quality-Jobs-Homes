"use strict";

var json = { "dataset": {
"id": 20126132,
"dataset_code": "C00033_PRR",
"database_code": "ZILL",
"name": "Zillow Home Value Index (Cities): Price-to-Rent Ratio - Miami, FL",
"description": "",
"refreshed_at": "2015-10-28T16:21:26.013Z",
"newest_available_date": "2015-09-30",
"oldest_available_date": "2010-10-31",
"column_names": [
  "Date",
  "Value"
],
"frequency": "monthly",
"type": "Time Series",
"premium": false,
"limit": null,
"transform": null,
"column_index": null,
"start_date": "2013-09-01",
"end_date": "2015-09-30",
"data": [
[
"2015-09-30",
11.32
],
[
"2015-08-31",
11.41
],
[
"2015-07-31",
11.25
],
[
"2015-06-30",
11.34
],
[
"2015-05-31",
11.4
],
[
"2015-04-30",
11.46
],
[
"2015-03-31",
11.43
],
[
"2015-02-28",
11.5
],
[
"2015-01-31",
11.56
],
[
"2014-12-31",
11.48
],
[
"2014-11-30",
11.46
],
[
"2014-10-31",
11.41
],
[
"2014-09-30",
11.44
],
[
"2014-08-31",
11.36
],
[
"2014-07-31",
11.36
],
[
"2014-06-30",
11.39
],
[
"2014-05-31",
11.47
],
[
"2014-04-30",
11.61
],
[
"2014-03-31",
11.65
],
[
"2014-02-28",
11.4
],
[
"2014-01-31",
11.46
],
[
"2013-12-31",
11.44
],
[
"2013-11-30",
11.2
],
[
"2013-10-31",
11.06
],
[
"2013-09-30",
10.87
]
],
"collapse": null,
"order": "desc",
"database_id": 13018
}};

var items = json.dataset.data;
var ratioObj = {};
for (var i = 0; i < items.length; i++) {
  var num = items[i][0].substring(0, 7);
  var val = items[i][1];
  ratioObj[num] = val;
}
module.exports = ratioObj;

// initialize the database with 2 yrs of data (-2 months), then search again every 1st Sat of month (-2 months) when month # changes; Quandl's data lags by 2 months;
// http://www.quandl.com/api/v3/datasets/ZILL/C00033_PRR.json?start_date=2013-09-01&end_date=2015-09-30
// C00033 = city code for Miami, _PRR = price-to-rent ratio; https IS PREFERRED OVER http;
