'use strict';
/**
 * Includes the Graphlql Schema for Facebook.
 *
 * @author Philipp Bachmann
 */

let graphql = require('graphql');
let FacebookApiServiceDataType = new graphql.GraphQLObjectType({
  name: 'Facebook',
  fields: () => ({
    name: {
      type: graphql.GraphQLString,
      resolve: facebook => facebook.name,
    },
    hometown: {
      type: graphql.GraphQLString,
      resolve: facebook => facebook.hometown.name,
    }
  })
});

module.exports = FacebookApiServiceDataType;
