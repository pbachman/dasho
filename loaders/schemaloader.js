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
    }
    return null;
  }

  /**
   * Gets a Schema Query by Tile.
   * @function
   * @param {string} tile Tile
   * @return {string} Query
   */
  function getSchemaQueryByTile(tile) {
    switch (tile) {
      case 'googleapi':
        return `googleapi { url, desktop { speed }, mobile { speed usability } }`;
      case 'github':
        return `github { watchers forks stars user repository }`;
      case 'openweather':
        return `openweather { location unit latitude longitude, today { temp, icon } }`;
      case 'twitter':
        return `twitter { user followers following tweets likes backgroundimage profileimage }`;
      case 'fixer':
        return `fixer { currency CHF USD EUR GBP }`;
      case 'news':
        return `news { source, articles { title image publishedAt url }}`;
      case 'clock':
        return `clock { datetime totalSeconds }`;
    }
    return null;
  }

  return {
    getSchemaByName: getSchemaByName,
    getSchemaQueryByTile: getSchemaQueryByTile
  };
})();
