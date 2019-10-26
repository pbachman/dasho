'use strict';
/**
 * Includes the Graphlql Schema for the NewsAPI.
 *
 * @author Philipp Bachmann, Jon Uhlmann
 */

const graphql = require('graphql');

let NewsArticleApiServiceDataType = new graphql.GraphQLObjectType({
  name: 'NewsArticleApi',
  fields: () => ({
    title: {
      type: graphql.GraphQLString,
      resolve: article => article.title,
    },
    url: {
      type: graphql.GraphQLString,
      resolve: article => article.url,
    },
    image: {
      type: graphql.GraphQLString,
      resolve: article => article.urlToImage.replace(/.*?:\/\//g, '//'),
    },
    publishedAt: {
      type: graphql.GraphQLString,
      resolve: article => article.publishedAt,
    }
  })
});

let NewsApiServiceDataType = new graphql.GraphQLObjectType({
  name: 'NewsApi',
  fields: () => ({
    articles: {
      type: new graphql.GraphQLList(NewsArticleApiServiceDataType),
      resolve: news => news.articles,
    }
  })
});

module.exports = NewsApiServiceDataType;
