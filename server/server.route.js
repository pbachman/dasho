'use strict';
/**
 * Includes all Server Routes.
 *
 * @author Philipp Bachmann, Jon Uhlmann
 */
let serverRoutes = (function () {
  const express = require('express');
  const settingsloader = require('../loaders/settingsloader');
  const router = express.Router();
  const passwordHash = require('password-hash');
  const sendMailer = require('./server.mailer');
  const oauthServer = require('./server.oauth');

  /**
   * Generates a new Password
   * @function
   * @return {string} Password
   */
  function generateRandomPassword() {
    let text = "";
    const possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

    for (let passwordIndex = 0; passwordIndex < 8; passwordIndex++)
      text += possible.charAt(Math.floor(Math.random() * possible.length));
    return text;
  }

  /**
    * Gets the current Userprofile
    * @function
    * @param {req} req - Request object.
    * @param {res} res - Response object.
    */
  router.get('/account/current', oauthServer.authorise(), (req, res) => {
    if (req.user !== undefined) {
      // check if the user is allowed to make this request
      if (req.user === req.oauth.bearerToken.user) {
        return settingsloader.getUserByName(req.user)
          .then(function (user) {
            // gets the Userdata (without Pwd)
            if (user !== null) {
              res.status(200).send({
                "username": user.email,
                "caninvite": user.caninvite,
                "isAdmin": user.isAdmin
              });
            }
          })
          .catch((err) => {
            res.status(400).send(err.message);
          })
      }
      res.status(401).send('Access denied!');
    }
    res.status(400).send('User is missing!');
  });

  /**
   * Creates a new User
   * @function
   * @param {req} req - Request object.
   * @param {res} res - Response object.
   */
  router.post('/account', (req, res) => {
    if (req.body.email !== undefined && req.body.password !== undefined) {
      return settingsloader.getUserByName(req.body.email)
        .then(function (user) {
          // does the user already exists?
          if (user === null) {
            const newuser = { email: req.body.email, password: passwordHash.generate(req.body.password) };
            return settingsloader.addUser(newuser);
          }
          throw new Error('User already exists!');
        })
        .then(function (user) {
          // Assign Clock Tile to the new User.
          return Promise.all([settingsloader.assignTile(user.email, 'clock'), sendMailer.sendMail(user.email, 'Welcome to Dasho ✔', `<b>Hello User!</b> Welcome to <a href="https://dasho.herokuapp.com">dasho</a>. Please login with your E-mail address.`)]);
        })
        .then(function (info) {
          console.log(info);
          res.send(JSON.stringify('User successfully added.'));
        })
        .catch((err) => {
          res.status(400).send(err.message);
        })
    }
    res.status(400).send('Required fields missing!');
  });

  /**
   * Invites a new User
   * @function
   * @param {req} req - Request object.
   * @param {res} res - Response object.
   */
  router.post('/invite', oauthServer.authorise(), (req, res) => {
    if (req.body.username === undefined) {
      res.status(400).send('Required fields missing!');
    } else {
      // check if the user is allowed to make this request
      if (req.body.username === req.oauth.bearerToken.user) {
        // are you allowed to invite new users ?
        return settingsloader.getUserByName(req.body.username)
          .then(function (user) {
            if (user && user.caninvite) {
              return settingsloader.getUserByName(req.body.friend);
            }
            throw new Error('You are not allowed to invite new Users!');
          })
          .then(function (user) {
            // does the user already exists?
            if (user === null) {
              const password = generateRandomPassword();
              const newuser = { email: req.body.friend, password: passwordHash.generate(password), caninvite: false, isAdmin: false };

              return settingsloader.addUser(newuser);
            }
            throw new Error('User already exists!');
          })
          .then(function (user) {
            // Assign Clock Tile to the new User.
            return Promise.all([settingsloader.assignTile(user.email, 'clock'), sendMailer.sendMail(user.email, 'Welcome to Dasho ✔', `<b>Hello User!</b> Welcome to <a href="https://dasho.herokuapp.com">dasho</a>. Please login with your E-mail address.`)]);
          })
          .then(function (info) {
            console.log(info);
            res.send(JSON.stringify('User successfully added.'));
          })
          .catch(err => {
            res.status(400).send(err.message);
          });
      }
      res.status(401).send('Access denied!');
    }
  });

  /**
   * Changes the Password
   * @function
   * @param {req} req - Request object.
   * @param {res} res - Response object.
   */
  router.put('/changepassword', oauthServer.authorise(), (req, res) => {
    if (req.body.username !== undefined && req.body.password !== undefined
      && req.body.newpassword !== undefined && req.body.newpasswordconfirm !== undefined) {
      // check if the user is allowed to make this request
      if (req.body.username === req.oauth.bearerToken.user) {
        return settingsloader.getUserByName(req.body.username)
          .then(function (user) {
            if (user) {
              if (req.body.newpassword === req.body.newpasswordconfirm) {
                const checkPassword = passwordHash.verify(req.body.password, user.password);
                if (checkPassword) {
                  return settingsloader.setPassword(user, req.body.newpassword);
                }
                throw new Error('Password is wrong!');
              }
              throw new Error('Password and Confirm Password are not equal!');
            }
            throw new Error('Unknown User!');
          })
          .then(function (user) {
            res.send(user);
          })
          .catch(err => {
            res.status(400).send(err.message);
          });
      }
      res.status(401).send('Access denied!');
    } else {
      res.status(400).send('Required fields missing!');
    }
  });

  /**
   * Resets the Password
   * @function
   * @param {req} req - Request object.
   * @param {res} res - Response object.
   */
  router.post('/pwdreset', (req, res) => {
    if (req.body.username !== undefined) {
      if (req.body.username !== 'hi@dasho.co') {
        return settingsloader.getUserByName(req.body.username)
          .then(function (user) {
            if (user) {
              const password = generateRandomPassword();
              return settingsloader.setPassword(user, password);
            }
            throw new Error('Unknown User!');
          })
          .then(function (userinfo) {
            return sendMailer.sendMail(userinfo.user.email, 'DashO', `<b>Hello ${userinfo.user.email}!</b> Your new Password is ${userinfo.newpassword}`);
          })
          .then(function (info) {
            console.log(info);
            res.send(JSON.stringify('Password successfully reset.'));
          })
          .catch(err => {
            res.status(400).send(err.message);
          });
      }
      res.status(400).send('Is not allowed to reset this E-mail address!');
    }
    res.status(400).send('Required fields missing!');
  });

  /**
   * Updates an Userconfig Item
   * @function
   * @param {req} req - Request object.
   * @param {res} res - Response object.
   */
  router.put('/settings/:username', oauthServer.authorise(), (req, res) => {
    if (req.params.username !== undefined && req.body.setting) {
      // check if the user is allowed to make this request
      if (req.params.username === req.oauth.bearerToken.user) {
        let setting = req.body.setting;
        return settingsloader.saveSetting(setting)
          .then(function () {
            res.status(200).send(true);
          }).catch(err => {
            res.status(400).send(err.message);
          });
      }
      res.status(401).send('Access denied!');
    } else {
      res.status(400).send('Required fields missing!');
    }
  });

  /**
   * Adds a new Userconfig Item
   * @function
   * @param {req} req - Request object.
   * @param {res} res - Response object.
   */
  router.post('/settings/:username', oauthServer.authorise(), (req, res) => {
    if (req.params.username !== undefined && req.body.tile !== undefined) {
      // check if the user is allowed to make this request
      if (req.params.username === req.oauth.bearerToken.user) {
        return settingsloader.getUserByName(req.params.username)
          .then(function (user) {
            return settingsloader.assignTile(user.email, req.body.tile);
          })
          .then(function (config) {
            res.send(config);
          })
          .catch(err => {
            res.status(400).send(err);
          });
      }
      res.status(401).send('Access denied!');
    }
    res.status(400).send('Required fields missing!');
  });

  /**
   * Deletes an Userconfig Item
   * @function
   * @param {req} req - Request object.
   * @param {res} res - Response object.
   */
  router.delete('/settings/:username/:id', oauthServer.authorise(), (req, res) => {
    if (req.params.username !== undefined && req.params.id) {
      // check if the user is allowed to make this request
      if (req.params.username === req.oauth.bearerToken.user) {
        return settingsloader.deleteSetting(req.params.id)
          .then(function () {
            res.send(true);
          }).catch(err => {
            res.status(400).send(err.message);
          });
      }
      res.status(401).send('Access denied!');
    }
    res.status(400).send('Required fields missing!');
  });

  /**
   * Gets all Userconfigs for a specific User
   * @function
   * @param {req} req - Request object.
   * @param {res} res - Response object.
   */
  router.get('/settings/:username', oauthServer.authorise(), (req, res) => {
    if (req.params.username !== undefined) {
      // check if the user is allowed to make this request
      if (req.params.username === req.oauth.bearerToken.user) {
        // check if the user exists
        return settingsloader.getUserByName(req.params.username)
          .then(function (user) {
            if (user) {
              // returns the list of config
              return settingsloader.getSettings(user);
            }
            throw new Error('Unknown User!');
          })
          .then(function (settings) {
            res.send(settings);
          })
          .catch(err => {
            res.status(400).send(err.message);
          });
      }
      res.status(401).send('Access denied!');
    }
    res.status(400).send('Required fields missing!');
  });

  /**
    * Gets not assigned User Settings
    * @function
    * @param {req} req - Request object.
    * @param {res} res - Response object.
    */
  router.get('/settings/unassigned/:username', oauthServer.authorise(), (req, res) => {
    if (req.params.username !== undefined) {
      // check if the user is allowed to make this request
      if (req.params.username === req.oauth.bearerToken.user) {
        // check if the user exists
        return settingsloader.getUserByName(req.params.username)
          .then(function (user) {
            if (user) {
              // returns the list of config
              return settingsloader.getSettings(user);
            }
            throw new Error('Unknown User!');
          })
          .then(function (settings) {
            return settingsloader.getTiles(settings).then(function (tiles) {
              var tilesConfigs = [];

              for (let tileIndex = 0; tileIndex < tiles.length; tileIndex++) {
                const tile = tiles[tileIndex];
                // gets all Tiles / compare it with selected Tiles
                if (settings.find(x => x.tile === tile.name)) {
                  // do nothing
                } else {
                  tilesConfigs.push(tile);
                }
              }
              res.send(tilesConfigs);
            })
          })
          .catch(err => {
            res.status(400).send(err.message);
          });
      }
      res.status(401).send('Access denied!');
    }
    res.status(400).send('Required fields missing!');
  });

  /**
   * Gets all Tiles
   * @function
   * @param {req} req - Request object.
   * @param {res} res - Response object.
   */
  router.get('/tiles', oauthServer.authorise(), (req, res) => {
    // returns the list of tiles
    settingsloader.getTiles()
      .then(function (tiles) {
        res.send(tiles);
      }).catch(err => {
        res.status(400).send(err.message);
      });
  });

  /**
   * Updates a Tile
   * @function
   * @param {req} req - Request object.
   * @param {res} res - Response object.
   */
  router.put('/tiles/:tile', oauthServer.authorise(), (req, res) => {
    if (req.params.tile !== undefined && 
      req.body.tile.baseUrl !== undefined && req.body.tile.schema !== undefined) {
      let tile = req.body.tile;
      settingsloader.saveTile(tile)
        .then(function () {
          res.status(200).send(true);
        }).catch(err => {
          res.status(400).send(err.message);
        });
    } else {
      res.status(400).send('Required fields missing!');
    }
  });

  return router;
});

/**
 * Returns a server oAuth object.
 */
module.exports = serverRoutes();
