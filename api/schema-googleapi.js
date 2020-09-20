'use strict';
/**
 * Includes the Graphlql Schema for the GoogleApi.
 *
 * @author Philipp Bachmann, Jon Uhlmann
 */

const graphql = require('graphql');

let GooglePerformanceApiSubType = new graphql.GraphQLObjectType({
  name: 'Performance',
  fields: () => ({
    performance: {
      type: graphql.GraphQLFloat,
      resolve: categories => categories.performance.score * 100,
    }
  })
});

let GoogleApiServiceDataType = new graphql.GraphQLObjectType({
  name: 'GoogleApi',
  fields: () => ({
    finalUrl: {
      type: graphql.GraphQLString,
      resolve: googleapi => googleapi.lighthouseResult.finalUrl,
    },
    categories: {
      type: GooglePerformanceApiSubType,
      resolve: googleapi => googleapi.lighthouseResult.categories,
    }
  })
});

module.exports = GoogleApiServiceDataType;
