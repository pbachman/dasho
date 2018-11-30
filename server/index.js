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
  const express = require('express');
  const app = express();
  const graphqlHTTP = require('express-graphql');
  const schema = require('../api/schema');
  const bodyParser = require('body-parser');
  const cors = require('cors');
  const router = require('./server.route');
  const oauthServer = require('./server.oauth');
  const config = require('../config.json');
  const helmet = require('helmet');
	const engine = require('consolidate');
	const path = require('path');
  const compression = require('compression')

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

  const port = process.env.PORT || 61016;

  /** Using oAuth */
  app.use(oauthServer.errorHandler());
  app.all('/oauth/token', oauthServer.grant());

  /** Register routes */
  app.use('/api', router);

  /** compress all responses */
	app.use(compression())

	/** static files */
  const pathApp = path.join(__dirname, '/../dist');
  app.use(express.static(pathApp));

	app.set('views', pathApp);
	app.engine('html', engine.mustache);
	app.set('view engine', 'html');

  /** Graphql */
  app.use('/graphql', cors(), graphqlHTTP({
    schema: schema,
    graphiql: true
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
