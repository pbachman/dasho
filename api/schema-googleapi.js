'use strict';
/**
 * Includes the Graphlql Schema for the GoogleApi.
 *
 * @author Philipp Bachmann, Jon Uhlmann
 */

const graphql = require('graphql');

let GoogleAuditsApiSubType = new graphql.GraphQLObjectType({
  name: 'Audits',
  fields: () => ({
    firstcontentfulpaint: {
      type: graphql.GraphQLString,
      resolve: audits => audits['first-contentful-paint'].displayValue,
    },
    speedindex: {
      type: graphql.GraphQLString,
      resolve: audits => audits['speed-index'].displayValue,
    },
    largestcontentfulpaint: {
      type: graphql.GraphQLString,
      resolve: audits => audits['largest-contentful-paint'].displayValue,
    },
    interactive: {
      type: graphql.GraphQLString,
      resolve: audits => audits.interactive.displayValue,
    },
    totalblockingtime: {
      type: graphql.GraphQLString,
      resolve: audits => audits['total-blocking-time'].displayValue,
    },
    cumulativelayoutshift: {
      type: graphql.GraphQLString,
      resolve: audits => audits['cumulative-layout-shift'].displayValue,
    },
  })
});

let GooglePerformanceApiSubType = new graphql.GraphQLObjectType({
  name: 'Performance',
  fields: () => ({
    performance: {
      type: graphql.GraphQLString,
      resolve: categories => categories.performance.score,
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
    audits: {
      type: GoogleAuditsApiSubType,
      resolve: googleapi => googleapi.lighthouseResult.audits,
    },
    categories: {
      type: GooglePerformanceApiSubType,
      resolve: googleapi => googleapi.lighthouseResult.categories,
    }
  })
});

module.exports = GoogleApiServiceDataType;
