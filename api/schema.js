'use strict';
/**
 * Includes the Graphlql Types and Subtypes.
 *
 * @author Philipp Bachmann, Jon Uhlmann
 */

let graphql = require('graphql');
let fetch = require('./apifetch');
let btoa = require('btoa');
let deferred = require('deferred');

const settingsloader = require('../loaders/settingsloader');
const schemaloader = require('../loaders/schemaloader');

const settingsType = new graphql.GraphQLObjectType({
  name: 'Settings',
  description: 'Settings Type for DashO',
  fields: () => ({
    googleapi: {
      type: schemaloader.getSchemaByName(1), //googleApiServiceDataType,
      args: {
        user: {
          type: graphql.GraphQLString
        }
      },
      resolve: (source, args, context, info) => {
        let user = context.body.user;
        if (user) {
          return settingsloader.getTileConfig(user, 'googleapi')
            .then(function (tileConfig) {
              let querystring = tileConfig.querystring.replace('${strategy}', 'desktop');
              if (tileConfig) {
                console.log(tileConfig.baseUrl + querystring);
                return fetch.get(tileConfig.baseUrl, querystring);
              }
            }, function (error) {
              console.log('Error: ' + error);
              throw new Error(error);
            });
        }
        throw new Error(`Couldn't find User!`);
      }
    },
    github: {
      type: schemaloader.getSchemaByName(2), //githubApiServiceDataType,
      resolve: (source, args, context, info) => {
        let user = context.body.user;

        if (user) {
          return settingsloader.getTileConfig(user, 'github')
            .then(function (tileConfig) {
              let querystring = tileConfig.querystring.replace('${apikey}', tileConfig.apikey).replace('${apisecret}', tileConfig.apisecret);
              if (tileConfig) {
                console.log(tileConfig.baseUrl + querystring);
                return fetch.get(tileConfig.baseUrl, querystring);
              }
              return null;
            }, function (error) {
              console.log('Error: ' + error);
              throw new Error(error);
            });
        }
        throw new Error('User is empty!');
      }
    },
    openweather: {
      type: schemaloader.getSchemaByName(3), //openWeatherApiServiceDataType,
      resolve: (root, args, context) => {
        let user = context.body.user;

        return settingsloader.getTileConfig(user, 'openweather')
          .then(function (tileConfig) {
            let querystring = tileConfig.querystring.replace('${apiKey}', tileConfig.apikey);

            if (tileConfig) {
              console.log(tileConfig.baseUrl + querystring);
              return fetch.get(tileConfig.baseUrl, querystring);
            }
            throw new Error('Couldnt find TileConfig!');
          }, function (error) {
            console.log('Error: ' + error);
            throw new Error(error);
          });
      }
    },
    twitter: {
      type: schemaloader.getSchemaByName(4), //twitterApiServiceDataType,
      resolve: (root, args, context) => {
        let user = context.body.user;
        return settingsloader.getTileConfig(user, 'twitter')
          .then(function (tileConfig) {
            if (tileConfig) {
              // get a valid token
              let requestBodyToken = {
                method: 'POST',
                headers: {
                  'Authorization': 'Basic ' + btoa(tileConfig.apikey + ':' + tileConfig.apisecret),
                  'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8'
                },
                body: 'grant_type=client_credentials'
              };

              return fetch.get(tileConfig.baseUrl, '/oauth2/token', requestBodyToken)
                .then(function (response) {
                  let requestBody = {
                    method: 'GET',
                    headers: {
                      'Authorization': 'Bearer ' + response.access_token
                    }
                  };

                  if (response.errors) {
                    throw new Error(response.errors[0].message);
                  } else {
                    return fetch.get(tileConfig.baseUrl, tileConfig.querystring, requestBody);
                  }
                }, function (error) {
                  console.log('Error: ' + error);
                  throw new Error(error);
                });
            }
            return null;
          }, function (error) {
            console.log('Error: ' + error);
            throw new Error(error);
          });
      }
    },
    fixer: {
      type: schemaloader.getSchemaByName(5), //fixerApiServiceDataType,
      resolve: (root, args, context) => {
        let user = context.body.user;

        return settingsloader.getTileConfig(user, 'fixer')
          .then(function (tileConfig) {
            let querystring = tileConfig.querystring.replace('${apiKey}', tileConfig.apikey);
            if (tileConfig) {
              console.log(tileConfig.baseUrl + querystring);
              return fetch.get(tileConfig.baseUrl, querystring);
            }
            return null;
          }, function (error) {
            console.log('Error: ' + error);
            throw new Error(error);
          });
      }
    },
    news: {
      type: schemaloader.getSchemaByName(6), //newsApiServiceDataType,
      resolve: (root, args, context) => {
        let user = context.body.user;

        return settingsloader.getTileConfig(user, 'news')
          .then(function (tileConfig) {
            let querystring = tileConfig.querystring.replace('${apiKey}', tileConfig.apikey);
            if (tileConfig) {
              console.log(tileConfig.baseUrl + querystring);
              return fetch.get(tileConfig.baseUrl, querystring);
            }
            return null;
          }, function (error) {
            console.log('Error: ' + error);
            throw new Error(error);
          });
      }
    },
    clock: {
      type: schemaloader.getSchemaByName(7), //clockDataType,
      resolve: clock => clock
    }
  })
});

const queryType = new graphql.GraphQLObjectType({
  name: 'Query',
  fields: () => ({
    settings: {
      type: settingsType,
      args: {
        user: { type: graphql.GraphQLString }
      },
      resolve: (args, context, info) => {
        if (context.user === '' || context.user === undefined) {
          throw new Error("user parameter is missing!");
        }

        return settingsloader.getUserByName(context.user)
          .then(function (user) {
            if (user) {
              return settingsType;
            } else {
              throw new Error("Unknown User!");
            }
          }, function (error) {
            console.log('Query Error: ' + error);
            throw new Error(error);
          });
      }
    },
  }),
});

module.exports = new graphql.GraphQLSchema({
  query: queryType
});
