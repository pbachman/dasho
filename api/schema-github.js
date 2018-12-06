'use strict';
/**
 * Includes the Graphlql Schema for Github.
 *
 * @author Philipp Bachmann, Jon Uhlmann
 */

const graphql = require('graphql');

let GithubApiServiceDataType = new graphql.GraphQLObjectType({
  name: 'Github',
  fields: () => ({
    watchers: {
      type: graphql.GraphQLInt,
      resolve: github => github.watchers_count,
    },
    forks: {
      type: graphql.GraphQLInt,
      resolve: github => github.forks,
    },
    stars: {
      type: graphql.GraphQLInt,
      resolve: github => github.stargazers_count,
    },
    user: {
      type: graphql.GraphQLString,
      resolve: github => github.owner.login,
    },
    repository: {
      type: graphql.GraphQLString,
      resolve: github => github.name,
    }
  })
});

module.exports = GithubApiServiceDataType;
