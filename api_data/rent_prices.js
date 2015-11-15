"use strict";

var json = { "dataset": {
"id": 19622452,
"dataset_code": "C00033_RAH",
"database_code": "ZILL",
"name": "Zillow Home Value Index (Cities): Rentals All Homes - Miami, FL",
"description": "",
"refreshed_at": "2015-10-28T15:08:52.732Z",
"newest_available_date": "2015-09-30",
"oldest_available_date": "2010-11-30",
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
2141
],
[
"2015-08-31",
2127
],
[
"2015-07-31",
2108
],
[
"2015-06-30",
2076
],
[
"2015-05-31",
2045
],
[
"2015-04-30",
2021
],
[
"2015-03-31",
2010
],
[
"2015-02-28",
2000
],
[
"2015-01-31",
1997
],
[
"2014-12-31",
1995
],
[
"2014-11-30",
1995
],
[
"2014-10-31",
1990
],
[
"2014-09-30",
1982
],
[
"2014-08-31",
1977
],
[
"2014-07-31",
1970
],
[
"2014-06-30",
1958
],
[
"2014-05-31",
1954
],
[
"2014-04-30",
1947
],
[
"2014-03-31",
1943
],
[
"2014-02-28",
1926
],
[
"2014-01-31",
1909
],
[
"2013-12-31",
1891
],
[
"2013-11-30",
1874
],
[
"2013-10-31",
1858
],
[
"2013-09-30",
1844
]
],
"collapse": null,
"order": "desc",
"database_id": 13018
}};

var items = json.dataset.data;
var priceObj = {};
for (var i = 0; i < items.length; i++) {
  var num = items[i][0].substring(0, 7);
  var val = items[i][1];
  priceObj[num] = val;
}
module.exports = priceObj;

// initialize the database with 2 yrs of data (-2 months), then search again every 1st Sat of month (-2 months) when month # changes; Quandl's data lags by 2 months;
// http://www.quandl.com/api/v3/datasets/ZILL/C00033_RAH.json?start_date=2013-09-01&end_date=2015-09-30
// C00033 = city code for Miami, _RAH = estimated median rent; https IS PREFERRED OVER http;
