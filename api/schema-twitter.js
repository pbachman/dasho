'use strict';
/**
 * Includes the Graphlql Schema for Twitter.
 *
 * @author Philipp Bachmann, Jon Uhlmann
 */

let graphql = require('graphql');
let TwitterApiServiceDataType = new graphql.GraphQLObjectType({
  name: 'Twitter',
  fields: () => ({
    user: {
      type: graphql.GraphQLString,
      resolve: twitter => twitter[0].name,
    },
    followers: {
      type: graphql.GraphQLInt,
      resolve: twitter => twitter[0].followers_count,
    },
    following: {
      type: graphql.GraphQLInt,
      resolve: twitter => twitter[0].friends_count,
    },
    tweets: {
      type: graphql.GraphQLInt,
      resolve: twitter => twitter[0].statuses_count,
    },
    likes: {
      type: graphql.GraphQLInt,
      resolve: twitter => twitter[0].favourites_count,
    },
    backgroundimage: {
      type: graphql.GraphQLString,
      resolve: twitter => twitter[0].profile_banner_url.replace(/.*?:\/\//g, '//'),
    },
    profileimage: {
      type: graphql.GraphQLString,
      resolve: twitter => twitter[0].profile_image_url.replace(/.*?:\/\//g, '//'),
    }
  })
});

module.exports = TwitterApiServiceDataType;
