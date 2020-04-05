'use strict';
/**
 * Represents the Server Logic (made with NodeJS/Express)
 *
 * @author Philipp Bachmann, Jon Uhlmann
 */
const server = (function () {
  /**
   * Initialize the packages we need
   */
  const express = require('express');
  const app = express();
  const graphqlHTTP = require('express-graphql');
  const schema = require('../api/schema');
  const bodyParser = require('body-parser');
  const cors = require('cors');
  const router = require('./server.route');
  const oauthServer = require('./server.oauth');
  const helmet = require('helmet');
  const compression = require('compression')
  const dotenv = require('dotenv');

  dotenv.config();
  const result = dotenv.config();
  if (result.error) {
    console.warn('no .env file found!');
  }

  /** Use Body Parser */
  app.use(bodyParser.urlencoded({ extended: false }))
  app.use(bodyParser.json());

  /** Cross origin configuration */
  app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', process.env.CORSALLOWORIGIN);
    res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
    res.header('Access-Control-Allow-Headers', 'Authorization, Origin, X-Requested-With, Content-Type, Accept');
    next();
  });

  const port = process.env.PORT || 61016;

  /** Using oAuth */
  app.use(oauthServer.errorHandler());
  app.all('/oauth/token', oauthServer.grant());

  /** Register routes */
  app.use('/api', router);

  /** compress all responses */
  app.use(compression())

  /** static files */
  app.use(express.static('www'));

  /** Graphql */
  app.use('/graphql', cors(), graphqlHTTP({
    schema: schema,
    graphiql: !process.env.PRODUCTION  // set it to false in the production
  }));

  /** Use Helmet to secure REST API */
  app.use(helmet());

  return {
    start: () => {
      console.log(`Listen to http://localhost: ${port}`);
      return app.listen(port);
    }
  };
});

/**
 * Returns a server object (with autostart).
 */

module.exports = server().start();
