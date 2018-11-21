'use strict';
/**
 * Represents the Schemaloader Logic, to load all graphlql schemas.
 *
 * @author Philipp Bachmann, Jon Uhlmann
 */
module.exports = (function () {
  let passwordHash = require('password-hash');
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
      case 1: // 'googleapi':
        return googleApiServiceDataType;
      case 2: // 'github':
        return githubApiServiceDataType;
      case 3: // 'openweather':
        return openWeatherApiServiceDataType;
      case 4: // 'twitter':
        return twitterApiServiceDataType;
      case 5: // 'fixer':
        return fixerApiServiceDataType;
      case 6: // 'news':
        return newsApiServiceDataType;
      case 7: // 'clock':
        return clockDataType;
    }
    return null;
  }

  /**
   * Gets a Schema Query by TileId.
   * @function
   * @param {int} tileid Tile Id
   * @return {string} Query
   */
  function getSchemaQueryByTileId(tileid) {
    switch (tileid) {
      case 1: // 'googleapi':
        return `googleapi { url, desktop { speed }, mobile { speed usability } }`;
      case 2: // 'github':
        return `github { watchers forks stars user repository }`;
      case 3: // 'openweather':
        return `openweather { location unit latitude longitude, today { temp, icon } }`;
      case 4: // 'twitter':
        return `twitter { user followers following tweets likes backgroundimage profileimage }`;
      case 5: // 'fixer':
        return `fixer { currency CHF USD EUR GBP }`;
      case 6: // 'news':
        return `news { source, articles { title image publishedAt url }}`;
      case 7: // 'clock':
        return `clock { datetime totalSeconds }`;
    }
    return null;
  }

  return {
    getSchemaByName: getSchemaByName,
    getSchemaQueryByTileId: getSchemaQueryByTileId
  };
})();
