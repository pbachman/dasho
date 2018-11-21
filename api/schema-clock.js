'use strict';
/**
 * Includes the Graphlql Schema for the Clock.
 *
 * @author Philipp Bachmann, Jon Uhlmann
 */

let graphql = require('graphql');
let moment = require('moment');

let ClockDataType = new graphql.GraphQLObjectType({
  name: 'Clock',
  fields: () => ({
    datetime: {
      type: graphql.GraphQLString,
      resolve: clock => moment().format(), // returns the current Date in ISO 8601
    },
    totalSeconds: {
      type: graphql.GraphQLInt,
      resolve: clock => Math.round(new Date().getTime() / 1000), // returns the total Seconds
    }
  })
});

module.exports = ClockDataType;