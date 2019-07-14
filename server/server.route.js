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
   * Verifying Login
   * @function
   * @param {req} req - Request object.
   * @param {res} res - Response object.
   */
  router.post('/login', (req, res) => {
    if (req.body.username !== undefined && req.body.password !== undefined) {
      return settingsloader.getUserByName(req.body.username)
        .then(function (user) {
          if (user) {
            const checkPassword = passwordHash.verify(req.body.password, user.password);
            if (checkPassword) {
              res.status(200);
            }
          }
          throw new Error('Login failed!');
        })
        .catch(err => {
          res.status(401).send('Login failed!');
        });
    }
    res.status(400).send('Required fields missing!');
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
          // Add new User and assign Clock Tile to User.
          return settingsloader.assignTile(user._id, 'clock');
        })
        .then(function () {
          sendMailer.sendMail(user.email, 'Welcome to Dasho ✔', `<b>Hello User!</b> Welcome to <a href="https://dasho.herokuapp.com">dasho</a>. Please login with your E-mail address.`, function (error, info) {
            if (error) {
              throw new Error(`Couldn't send Invitation Mail ${error}`);
            } else {
              res.send(info);
            }
          }).catch(err => {
            res.status(400).res.send(err.message);
          });
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
            const newuser = { email: req.body.friend, password: passwordHash.generate(password), caninvite: false };

            return settingsloader.addUser(newuser);
          }
          throw new Error('User already exists!');
        })
        .then(function (user) {
          // Adds new User and assign Clock Tile to User.
          return settingsloader.assignTile(user._id, 'clock');
        })
        .then(function () {
          sendMailer.sendMail(user.email, 'Welcome to Dasho ✔', `<b>Hello User!</b> Welcome to <a href="https://dasho.herokuapp.com">dasho</a>. Please login with your E-mail address. Your Password is ${password}`, function (error, info) {
            if (error) {
              throw new Error(`Couldn't send Invitation Mail ${error}`);
            } else {
              res.send(info);
            }
          });
        })
        .catch(err => {
          res.status(400).send(err.message);
        });
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
      return settingsloader.getUserByName(req.body.username)
        .then(function (user) {
          if (user) {
            if (req.body.newpassword === req.body.newpasswordconfirm) {
              const checkPassword = passwordHash.verify(req.body.password, user.password);
              if (checkPassword) {
                return settingsloader.setsPassword(user, req.body.newpassword);
              }
              throw new Error('Login failed!');
            }
            throw new Error('Password and Confirm Password not equal!');
          }
          throw new Error('Unknown User!');
        })
        .then(function (user) {
          res.send(user);
        })
        .catch(err => {
          res.status(400).send(err.message);
        });
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
              return settingsloader.setPassword(user.email, password);
            }
            throw new Error('Unknown User!');
          })
          .then(function (user) {
            sendMailer.sendMail(user.user, 'DashO', `<b>Hello ${user.user}!</b> Your new Password is ${user.newpassword}`, function (error, info) {
              if (error) {
                throw new Error(error.message);
              } else {
                res.send(info);
              }
            });
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
   * Save User Settings
   * @function
   * @param {req} req - Request object.
   * @param {res} res - Response object.
   */
  router.put('/settings/:username', oauthServer.authorise(), (req, res) => {
    if (req.params.username !== undefined) {
      let setting = req.body.setting;
      settingsloader.saveSetting(setting)
        .then(function () {
          res.status(200).send(true);
        }).catch(err => {
          res.status(400).send(err.message);
        });
    } else {
      res.status(400).send('Required fields missing!');
    }
  });

  /**
   * Adds User Setting
   * @function
   * @param {req} req - Request object.
   * @param {res} res - Response object.
   */
  router.post('/settings/:username/:tile', oauthServer.authorise(), (req, res) => {
    if (req.params.username !== undefined && req.params.tile) {
      return settingsloader.getUserByName(req.params.username)
        .then(function (user) {
          return settingsloader.assignTile(user._id, req.params.tile);
        })
        .then(function () {
          res.send(true);
        })
        .catch(err => {
          res.status(400).send(err.message);
        });
    }
    res.status(400).send('Required fields missing!');
  });

  /**
   * Deletes User Setting
   * @function
   * @param {req} req - Request object.
   * @param {res} res - Response object.
   */
  router.delete('/settings/:username/:id', oauthServer.authorise(), (req, res) => {
    if (req.params.username !== undefined && req.params.id) {
      return settingsloader.deleteSetting(req.params.id)
        .then(function () {
          res.send(true);
        }).catch(err => {
          res.status(400).send(err.message);
        });
    }
    res.status(400).send('Required fields missing!');
  });

  /**
   * Gets User Settings
   * @function
   * @param {req} req - Request object.
   * @param {res} res - Response object.
   */
  router.get('/settings/:username', oauthServer.authorise(), (req, res) => {
    if (req.params.username !== undefined) {
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
                temps.push(tile);
              }
            }
            res.send(tilesConfigs);
          })
        })
        .catch(err => {
          res.status(400).send(err.message);
        });
    }
    res.status(400).send('Required fields missing!');
  });

  /**
   * Gets Tiles
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
   * Saves a Tiles
   * @function
   * @param {req} req - Request object.
   * @param {res} res - Response object.
   */
  router.put('/tiles/:tile', oauthServer.authorise(), (req, res) => {
    if (req.params.tile !== undefined) {
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
