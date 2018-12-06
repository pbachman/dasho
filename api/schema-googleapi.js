'use strict';
/**
 * Includes the Graphlql Schema for the GoogleApi.
 *
 * @author Philipp Bachmann, Jon Uhlmann
 */

const graphql = require('graphql');
const fetch = require('./apifetch');

function fetchData(user) {
  let settingsloader = require('../loaders/settingsloader');

  return settingsloader.getTileConfig(user,'googleapi')
  .then(function(tileConfig){
    let querystring = tileConfig.querystring.replace('${strategy}', 'mobile');
    if (tileConfig) {
      return fetch.get(tileConfig.baseUrl,querystring);
    }
    return null;
  });
}

let GoogleDesktopApiSubType = new graphql.GraphQLObjectType({
  name: 'Desktop',
  fields: () => ({
    speed: {
      type: graphql.GraphQLInt,
      resolve: desktop => desktop.SPEED.score | 0,
    }
  })
});

let GoogleMobileApiSubType = new graphql.GraphQLObjectType({
  name: 'Mobile',
  fields: () => ({
    speed: {
      type: graphql.GraphQLInt,
      resolve: mobile => mobile.ruleGroups.SPEED.score | 0,
    }, usability: {
      type: graphql.GraphQLInt,
      resolve: mobile => mobile.ruleGroups.USABILITY.score | 0,
    }
  })
});

let GoogleApiServiceDataType = new graphql.GraphQLObjectType({
  name: 'GoogleApi',
  fields: () => ({
    url: {
      type: graphql.GraphQLString,
      resolve: googleapi => googleapi.id.replace(/.*?:\/\//g, "").replace(/\/$/, ""),
    },
    desktop: {
      type: GoogleDesktopApiSubType,
      resolve: googleapi => googleapi.ruleGroups,
    },
    mobile: {
      type: GoogleMobileApiSubType,
      resolve: (root, args, context) => {
        let user = context.body.user;
        return fetchData(user);
      }
    }
  })
});

module.exports = GoogleApiServiceDataType;
