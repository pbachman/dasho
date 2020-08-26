'use strict';
/**
 * Includes the Graphlql Schema for the Clock.
 *
 * @author Philipp Bachmann, Jon Uhlmann
 */

const graphql = require('graphql');
const dayjs = require('dayjs');

let ClockDataType = new graphql.GraphQLObjectType({
  name: 'Clock',
  fields: () => ({
    datetime: {
      type: graphql.GraphQLString,
      resolve: clock => dayjs().format(), // returns the current Date in ISO 8601
    },
    totalSeconds: {
      type: graphql.GraphQLInt,
      resolve: clock => Math.round(new Date().getTime() / 1000), // returns the total Seconds
    }
  })
});

module.exports = ClockDataType;
