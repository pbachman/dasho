'use strict';
/**
 * Includes the Sendmailer Logic (using nodemailer)
 *
 * @author Philipp Bachmann, Jon Uhlmann
 */
let serverMailer = (function () {
  let nodemailer = require('nodemailer');

  /**
 * Sends a Mail
 * @function
 * @param {string} sendto Sender To
 * @param {string} subject Subject
 * @param {string} text Text
 * @param {object} callback callback
   */
  function sendMail(sendto, subject, text, callback) {
    let smptConfig = require('../config.json');

    // create reusable transporter object using the default SMTP transport
    let transporter = nodemailer.createTransport(`smtp://${smptConfig.username}:${smptConfig.pwd}@${smptConfig.host}`);

    // Mail Options
    let mailOptions = {
      from: smptConfig.from,
      to: sendto,
      subject: subject,
      html: text
    };

    // send mail with defined transport object
    transporter.sendMail(mailOptions, callback);
  }

  return {
    sendMail: sendMail,
  };
});

/**
 * Returns a server SendMailer object.
 */
module.exports = serverMailer();
