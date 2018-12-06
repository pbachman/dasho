'use strict';
/**
 * Includes the Graphlql Schema for OpenWeather.
 *
 * @author Philipp Bachmann, Jon Uhlmann
 */

const graphql = require('graphql');

let OpenWeatherDayApiServiceDataType = new graphql.GraphQLObjectType({
  name: 'Day',
  fields: () => ({
    temp: {
      type: graphql.GraphQLString,
      resolve: day => Math.round(day.main.temp),
    },
    icon: {
      type: graphql.GraphQLString,
      resolve: day => '//openweathermap.org/img/w/' + day.weather[0].icon + '.png',
    },
  })
});

let OpenWeatherApiServiceDataType = new graphql.GraphQLObjectType({
  name: 'OpenWeather',
  fields: () => ({
    location: {
      type: graphql.GraphQLString,
      resolve: openweather => openweather.name,
    },
    unit: {
      type: graphql.GraphQLString,
      resolve: openweather => 'C',
    },
    latitude: {
      type: graphql.GraphQLString,
      resolve: openweather => openweather.coord.lat,
    },
    longitude: {
      type: graphql.GraphQLString,
      resolve: openweather => openweather.coord.lon,
    },
    today: {
      type: OpenWeatherDayApiServiceDataType,
      resolve: openweather => openweather,
    }
  })
});

module.exports = OpenWeatherApiServiceDataType;
