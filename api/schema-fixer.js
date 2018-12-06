'use strict';
/**
 * Includes the Graphlql Schema for Fixer.
 *
 * @author Philipp Bachmann, Jon Uhlmann
 */

const graphql = require('graphql');

let FixerApiServiceDataType = new graphql.GraphQLObjectType({
  name: 'Fixer',
  fields: () => ({
    currency: {
      type: graphql.GraphQLString,
      resolve: fixer => fixer.base,
    },
    CHF: {
      type: graphql.GraphQLFloat,
      resolve: fixer => fixer.rates.CHF || 1,
    },
    USD: {
      type: graphql.GraphQLFloat,
      resolve: fixer => fixer.rates.USD || 1,
    },
    EUR: {
      type: graphql.GraphQLFloat,
      resolve: fixer => fixer.rates.EUR || 1,
    },
    GBP: {
      type: graphql.GraphQLFloat,
      resolve: fixer => fixer.rates.GBP || 1,
    },
  })
});

module.exports = FixerApiServiceDataType;
