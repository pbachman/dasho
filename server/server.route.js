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
      settingsloader.getUserByName(req.body.username).then(function (user) {
        if (user !== undefined && user !== null) {
          const checkPassword = passwordHash.verify(req.body.password, user.password);
          if (checkPassword) {
            res.status(200);
            return res.send();
          } else {
            res.status(401);
            return res.send('Login failed!');
          }
        } else {
          res.status(401);
          return res.send('Login failed!');
        }
      }, (err) => {
        res.status(400);
        return res.send(err);
      });
    } else {
      res.status(400);
      return res.send('Required fields missing!');
    }
  });

  /**
   * Invites a new User
   * @function
   * @param {req} req - Request object.
   * @param {res} res - Response object.
   */
  router.post('/invite', oauthServer.authorise(), (req, res) => {
    if (req.body.username === undefined) {
      res.status(400);
      return res.send('Required fields missing!');
    } else {
      // are you allowed to invite new users ?
      settingsloader.getUserByName(req.body.username).then(function (user) {
        if (user !== undefined && user !== null && user.caninvite) {
          settingsloader.getUserByName(req.body.friend).then(function (user) {
            // does the user already exists?
            if (user !== null) {
              res.status(400);
              return res.send('User already exists!');
            } else {
              const password = generateRandomPassword();
              const newuser = { email: req.body.friend, password: passwordHash.generate(password), caninvite: false };

              settingsloader.addUser(newuser).then(function (user) {
                // Add new User and assign Clock Tile to User.
                settingsloader.assignTile(user._id, 'clock').then(function (config) {
                  sendMailer.sendMail(user.email, 'Welcome to Dasho ✔', `<b>Hello User!</b> Welcome to <a href="https://dasho.netlify.com">dasho</a>. Please login with your E-mail address. Your Password is ${password}`, function (error, info) {
                    if (error) {
                      res.status(400);
                      return res.send(`Couldn't send Invitation Mail ${error}`);
                    } else {
                      res.status(200);
                      return res.send(info);
                    }
                  }).catch(err => {
                    res.status(400);
                    return res.send(err);
                  });
                }, (err) => {
                  res.status(400);
                  return res.send(err);
                });
              }, (err) => {
                res.status(400);
                return res.send(err);
              });
            }
          }).catch(err => {
            res.status(400);
            return res.send(err);
          });
        } else {
          res.status(400);
          return res.send('You are not allowed to invite new Users!');
        }
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
      settingsloader.getUserByName(req.body.username).then(function (user) {
        if (user !== undefined && user !== null) {
          if (req.body.newpassword === req.body.newpasswordconfirm) {
            const checkPassword = passwordHash.verify(req.body.password, user.password);
            if (checkPassword) {
              settingsloader.setsPassword(user, req.body.newpassword).then(function (user) {
                res.status(200);
                return res.send();
              }).catch(err => {
                res.status(400);
                return res.send(err);
              });
            } else {
              res.status(401);
              return res.send('Login failed!');
            }
          } else {
            res.status(400);
            return res.send('Password and Confirm Password not equal!');
          }
        } else {
          res.status(400);
          return res.send('Unknown User!');
        }
      }).catch(err => {
        res.status(400);
        return res.send(err);
      });
    } else {
      res.status(400);
      return res.send('Required fields missing!');
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
        settingsloader.getUserByName(req.body.username).then(function (user) {
          if (user !== undefined && user !== null) {
            const password = generateRandomPassword();
            settingsloader.setsPassword(user.email, password).then(function (check) {
              if (check) {
                sendMailer.sendMail(user.email, 'DashO', `<b>Hello ${user.email}!</b> Your new Password is ${password}`, function (error, info) {
                  if (error) {
                    res.status(400);
                    return res.send(error.message);
                  } else {
                    res.status(200);
                    return res.send();
                  }
                });
              }
            }).catch(err => {
              res.status(400);
              return res.send(err);
            });
          } else {
            res.status(200);
            return res.send();
          }
        }).catch(err => {
          res.status(400);
          return res.send(err);
        });
      } else {
        res.status(200);
        return res.send('Is not allowed to reset this E-mail address!');
      }
    } else {
      res.status(400);
      return res.send('Required fields missing!');
    }
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
      settingsloader.saveSetting(setting).then(function (user) {
        res.status(200);
        return res.send(user);
      }).catch(err => {
        res.status(400);
        return res.send(err);
      });
    } else {
      res.status(400);
      return res.send('Required fields missing!');
    }
  });

  /**
   * Deletes User Setting
   * @function
   * @param {req} req - Request object.
   * @param {res} res - Response object.
   */
  router.delete('/settings/:username/:id', oauthServer.authorise(), (req, res) => {
    if (req.params.username !== undefined && req.params.id) {
      settingsloader.deleteSetting(req.params.id).then(function (success) {
        res.status(200);
        return res.send(success);
      }).catch(err => {
        res.status(400);
        return res.send(err);
      });
    } else {
      res.status(400);
      return res.send('Required fields missing!');
    }
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
      settingsloader.getUserByName(req.params.username).then(function (user) {
        if (user) {
          // returns the list of config
          settingsloader.getSettings(user).then(function (settings) {
            return res.send(settings);
          }).catch(err => {
            res.status(400);
            return res.send(err);
          });
        } else {
          res.status(400);
          return res.send('Unknown User!');
        }
      }).catch(err => {
        res.status(400);
        return res.send(err);
      });
    } else {
      res.status(400);
      return res.send('Required fields missing!');
    }
  });

  /**
   * Gets Tiles
   * @function
   * @param {req} req - Request object.
   * @param {res} res - Response object.
   */
  router.get('/tiles', oauthServer.authorise(), (req, res) => {
    // returns the list of tiles
    settingsloader.getTiles().then(function (tiles) {
      return res.send(tiles);
    }).catch(err => {
      res.status(400);
      return res.send(err);
    });
  });

  return router;
});

/**
 * Returns a server oAuth object.
 */
module.exports = serverRoutes();
