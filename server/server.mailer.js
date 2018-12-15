'use strict';
/**
 * Includes the Sendmailer Logic (using nodemailer)
 *
 * @author Philipp Bachmann, Jon Uhlmann
 */
let serverMailer = (function () {
  const nodemailer = require('nodemailer');

  /**
 * Sends a Mail
 * @function
 * @param {string} sendto Sender To
 * @param {string} subject Subject
 * @param {string} text Text
 * @param {object} callback callback
   */
  function sendMail(sendto, subject, text, callback) {
    const config = require('../config.json');

    const smtpConfig = {
      host: config.host,
      port: config.port,
      secure: false, // upgrade later with STARTTLS
      auth: {
        user: config.username,
        pass: config.pwd
      }
    }

    // create reusable transporter object using the default SMTP transport
    const transporter = nodemailer.createTransport(smtpConfig);

    // Mail Options
    const mailOptions = {
      from: config.from,
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
