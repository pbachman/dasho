'use strict';
/**
 * Includes the oAuth Server Logic (using node-oauth2-server)
 *
 * @author Philipp Bachmann, Jon Uhlmann
 */
let serveroAuth = (function () {
  let oauthServer = require('node-oauth2-server');
  let settingsloader = require('../loaders/settingsloader');
  let authorizedClientIds = ['dasho'];

  /** oAuth Model */
  let model = {
    getClient: function (clientId, clientSecret, callback) {
      settingsloader.getClients({ clientId: clientId, clientSecret: clientSecret }, callback);
    },
    grantTypeAllowed: function (clientId, grantType, callback) {
      if (grantType === 'password') {
        return callback(false, authorizedClientIds.indexOf(clientId) >= 0);
      }
      callback(false, true);
    },
    getUser: function (username, password, callback) {
      settingsloader.verifyLogin(username, password, callback);
    },
    getRefreshToken: function (refreshToken, callback) {
      settingsloader.getAccessToken(refreshToken, callback);
    },
    getAccessToken: function (bearerToken, callback) {
      settingsloader.getAccessToken(bearerToken, callback);
    },
    saveAccessToken: function (token, clientId, expires, userId, callback) {
      settingsloader.saveAccessToken(token, clientId, expires, userId, callback);
    },
  };
  let oauth = new oauthServer({ model: model, grants: ['password'], accessTokenLifetime: null, refreshTokenLifetime: null });
  return oauth;
});

/**
 * Returns a server oAuth object.
 */
module.exports = serveroAuth();
