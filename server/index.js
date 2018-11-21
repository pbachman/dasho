'use strict';
/**
 * Represents the Server Logic (made with NodeJS/Express)
 *
 * @author Philipp Bachmann, Jon Uhlmann
 */
let server = (function () {
  /**
   * Initialize the packages we need
   */
  let express = require('express');
  let app = express();
  let graphqlHTTP = require('express-graphql');
  let schema = require('../api/schema');
  let bodyParser = require('body-parser');
  let cors = require('cors');
  let router = require('./server.route');
  let oauthServer = require('./server.oauth');
  let config = require('../config.json');

  /** Use Body Parser */
  app.use(bodyParser.urlencoded({ extended: false }))
  app.use(bodyParser.json());

  /** Cross origin configuration */
  app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', config.corsalloworigin);
    res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
    res.header('Access-Control-Allow-Headers', 'Authorization, Origin, X-Requested-With, Content-Type, Accept');
    next();
  });

  let port = process.env.PORT || 61016;

  /** Using oAuth */
  app.use(oauthServer.errorHandler());
  app.all('/oauth/token', oauthServer.grant());

  /** Register routes */
  app.use('/api', router);

  /** Graphql */
  app.use('/graphql', cors(), graphqlHTTP({
    schema: schema,
    graphiql: true
  }));

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
