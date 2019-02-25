/*
* Copyright 2009-2018 C3 IoT, Inc. All Rights Reserved.
* This material, including without limitation any software, is the confidential trade secret
* and proprietary information of C3 IoT and its licensors. Reproduction, use and/or distribution
* of this material in any form is strictly prohibited except as set forth in a written
* license agreement with C3 IoT and/or its authorized distributors.
* This product may be covered by one or more U.S. patents or pending patent applications.
~*/

/*
 * Returns the expected lumens of a light bulb based on wattage and bulbType
 */
function expectedLumens(wattage, bulbType) {
  if(bulbType == 'LED')
    return wattage * 84;
  if(bulbType == 'INCAN')
    return wattage * 14;
  if(bulbType == 'CFL')
    return wattage * 62;
}

/*
 * Returns the lifespan of a smart bulb in years.
 */
function lifeSpanInYears(bulbId){
  var bulb, startTime, defectFilter, defectDatum, defectTime, lifespan, conversionFactor, lifeSpanInYears;
  bulb = SmartBulb.get({id:bulbId});
  startTime = bulb.startDate;
  defectFilter = "status == 1 && lumens == 0 && parent.id == '" + 'SBMS_serialNo_' + bulb.id + "'";
  defectDatum = SmartBulbMeasurement.fetch({filter:defectFilter});
  defectTime = defectDatum.objs[0].end;
  lifespan = defectTime - startTime;
  conversionFactor = 1000*60*60*24*365;
  lifeSpanInYears = lifespan / conversionFactor;
  return lifeSpanInYears;
}

/*
 * Return a string with the id of the SmartBulb shortest life span.
 */
function shortestLifeSpanBulb(){
    // declare variables to use later
    var lightbulbs, shortestId, shortestVal, span, bulbId, lifespans = [];
    //perform a fetch of SmartBulbs, include just the "id" field, set the limit to unlimited (-1), and select the objs object in the response
    lightbulbs = SmartBulb.fetch({include:"id",limit:-1}).objs;
    //Set an arbitrary shortest starting point
    shortestVal = 1000;
    //loop through our array, calling lifeSpanInYears() on each id, and performing a bubble sort
    for (var i = 0; i < lightbulbs.length; i++) {
      bulbId = lightbulbs[i].id;
      span = SmartBulb.lifeSpanInYears(bulbId);
      lifespans.push(span);
      //bubblesort
      if (span < shortestVal){
        shortestVal = span;
        shortestId = bulbId;
      }
    }
    //return the shortestId
    return shortestId;
  }
  
  /*
   * Return a string with the id of the SmartBulb longest life span.
   */
  function longestLifeSpanBulb(){
    // declare variables to use later
    var lightbulbs, longestId, longestVal, span, bulbId, lifespans = [];
    //perform a fetch of SmartBulbs, include just the "id" field, set the limit to unlimited (-1), and select the objs object in the response
    lightbulbs = SmartBulb.fetch({include:"id",limit:-1}).objs;
    //Set 0 as the longest so far
    longestVal = 0;
    //loop through our array, calling lifeSpanInYears() on each id, and performing a bubble sort
    for (var i = 0; i < lightbulbs.length; i++) {
      bulbId = lightbulbs[i].id;
      span = SmartBulb.lifeSpanInYears(bulbId);
      lifespans.push(span);
      //bubblesort
      if (span > longestVal){
        longestVal = span;
        longestId = bulbId;
      }
    }
    //return the longestId
    return longestId;
  }
  
  /*
   * Returns the average life span of all smart bulbs.
   */
  function averageLifeSpan(){
    // declare variables to use later
    var lightbulbs, sum, avg, span, bulbId, lifespans = [];
    //perform a fetch of SmartBulbs, include just the "id" field, set the limit to unlimited (-1), and select the objs object in the response
    lightbulbs = SmartBulb.fetch({include:"id",limit:-1}).objs;
    //Set 0 as the avg so far
    sum = 0;
    //loop through our array, calling lifeSpanInYears() on each id, and performing a bubble sort
    for (var i = 0; i < lightbulbs.length; i++) {
      bulbId = lightbulbs[i].id;
      span = SmartBulb.lifeSpanInYears(bulbId);
      lifespans.push(span);
      //add all lifepans
      sum += span;
    }
    // calc the average
    avg = sum / lightbulbs.length;
  
    // return the average
    return avg;
  }