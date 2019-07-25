'use strict';
/**
 * Includes the Graphlql Schema for Wiewarm.ch.
 */

const graphql = require('graphql');

let WiewarmApiServiceDataType = new graphql.GraphQLObjectType({
  name: 'Wiewarm',
  fields: () => ({
    lake: {
      type: graphql.GraphQLString,
      resolve: wiewarm => wiewarm[0].becken.Zugersee.beckenname,
    },
    name: {
      type: graphql.GraphQLString,
      resolve: wiewarm => wiewarm[0].becken.Zugersee.smsname,
    },
    temp: {
      type: graphql.GraphQLFloat,
      resolve: wiewarm => wiewarm[0].becken.Zugersee.temp,
    },
    status: {
      type: graphql.GraphQLString,
      resolve: wiewarm =>  wiewarm[0].becken.Zugersee.status,
    }
  })
});

module.exports = WiewarmApiServiceDataType;
