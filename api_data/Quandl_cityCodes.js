"use strict";

var cities = [
  {
    'New York' : '00001'
  },
  {
    'Los Angeles' : '00002'
  },
  {
    'Chicago' : '00003'
  },
  {
    'Houston' : '10444'
  },
  {
    'Philadelphia' : '00004'
  },
  {
    'Phoenix' : '00005'
  },
  {
    'San Antonio' : '10445'
  },
  {
    'San Diego' : '00007'
  },
  {
    'Dallas' : '10446'
  },
  {
    'San Jose' : '00008'
  },
  {
    'Austin' : '10448'
  },
  {
    'Jacksonville' : '00009'
  },
  {
    'San Francisco' : '00010'
  },
  {
    'Indianapolis' : '10447'
  },
  {
    'Columbus' : '00011'
  },
  {
    'Fort Worth' : '10449'
  },
  {
    'Charlotte' : '00013'
  },
  {
    'Detroit' : '00012'
  },
  {
    'El Paso' : '10490'
  },
  {
    'Seattle' : '00017'
  },
  {
    'Denver' : '00019'
  },
  {
    'Washington' : '00018'
  },
  {
    'Memphis' : '00014'
  },
  {
    'Boston' : '00016'
  },
  {
    'Nashville' : '00020'
  },
  {
    'Baltimore' : '00015'
  },
  {
    'Oklahoma City' : '00023'
  },
  {
    'Portland' : '00022'
  },
  {
    'Las Vegas' : '00006'
  },
  {
    'Lousiville' : '00067'
  },
  {
    'Milwaukee' : '00021'
  },
  {
    'Albuquerque' : '10451'
  },
  {
    'Tuson' : '00034'
  },
  {
    'Fresno' : '00026'
  },
  {
    'Sacramento' : '00029'
  },
  {
    'Long Beach' : '00028'
  },
  {
    'Kansas City' : '09901'
  },
  {
    'Mesa' : '00027'
  },
  {
    'Atlanta' : '00032'
  },
  {
    'Virginia Beach' : '00030'
  },
  {
    'Omaha' : '00025'
  },
  {
    'Colorado Springs' : '00021'
  },
  {
    'Raleigh' : '00039'
  },
  {
    'Miami' : '00033'
  },
  {
    'Oakland' : '00037'
  },
  {
    'Minneapolis' : '00038'
  },
  {
    'Tusla' : '00034'
  },
  {
    'Cleveland' : '00035'
  },
  {
    'Wichita' : '10453'
  },
  {
    'New Orleans' : '09993'
  }
 ];

var codes = {};   // dict of city : code;
for (var i = 0; i < cities.length; i++) {
  var city = Object.keys(cities[i])[0];
  codes[city] = cities[i][city];
}

module.exports = { cities: cities, codes: codes };
