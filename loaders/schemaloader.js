'use strict';
/**
 * Represents the Schemaloader Logic, to load all graphlql schemas.
 *
 * @author Philipp Bachmann, Jon Uhlmann
 */
module.exports = (function () {
  const googleApiServiceDataType = require('../api/schema-googleapi');
  const githubApiServiceDataType = require('../api/schema-github');
  const clockDataType = require('../api/schema-clock');
  const openWeatherApiServiceDataType = require('../api/schema-openweather');
  const twitterApiServiceDataType = require('../api/schema-twitter');
  const fixerApiServiceDataType = require('../api/schema-fixer');
  const newsApiServiceDataType = require('../api/schema-news');
  const wiewarmApiServiceDataType = require('../api/schema-wiewarm');

  /**
   * Gets a Schema by Name.
   * @function
   * @param {string} schemaname Schema Name.
   * @return {GraphQLObjectType}
   */
  function getSchemaByName(schemaname) {
    switch (schemaname) {
      case 'googleapi':
        return googleApiServiceDataType;
      case 'github':
        return githubApiServiceDataType;
      case 'openweather':
        return openWeatherApiServiceDataType;
      case 'twitter':
        return twitterApiServiceDataType;
      case 'fixer':
        return fixerApiServiceDataType;
      case 'news':
        return newsApiServiceDataType;
      case 'clock':
        return clockDataType;
      case 'wiewarm':
        return wiewarmApiServiceDataType;
    }
    return null;
  }

  return {
    getSchemaByName: getSchemaByName
  };
})();
