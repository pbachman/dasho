'use strict';
/**
 * Includes the wrapper logic for fetch (using node-fetch).
 *
 * @author Philipp Bachmann, Jon Uhlmann
 */
let apifetch = (function() {
  const fetch = require('node-fetch');

/**
 * fetches data from a url (with or without Body).
 * @function
 * @param {string} baseUrl Base Url.
 * @param {string} relativeURL RelativeURL.
 * @param {body} body Http Body.
 * @return {object} Resultset
 */
  function fetchResponseByURL(baseUrl, relativeURL, body) {
    if (body) {
      return fetch(`${baseUrl}${relativeURL}`, body).then(function(res) {
        return res.json()
      });
    } else {
      return fetch(`${baseUrl}${relativeURL}`).then(function(res) {
        return res.json()
      });
    }
  }

/**
 * Main function to fetch data from a Url.
 * @function
 * @param {string} baseUrl Base Url.
 * @param {string} relativeURL RelativeURL.
 * @param {body} body Http Body.
 * @return {object} Resultset
 */
  function fetchDataByURL(baseUrl, relativeURL, body) {
    return fetchResponseByURL(baseUrl, relativeURL, body).then(json => json);
  }

  return {
    get: fetchDataByURL
  };
});

module.exports = apifetch();
