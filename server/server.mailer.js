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
  function sendMail(sendto, subject, text) {
    return new Promise((resolve, reject) => {
      const smtpConfig = {
        host: process.env.MAILHOST,
        port: process.env.MAILPORT,
        secure: false, // upgrade later with STARTTLS
        auth: {
          user: process.env.MAILUSERNAME,
          pass: process.env.MAILPWD
        }
      }

      // create reusable transporter object using the default SMTP transport
      const transporter = nodemailer.createTransport(smtpConfig);

      // Mail Options
      const mailOptions = {
        from: process.env.MAILFROM,
        to: sendto,
        subject: subject,
        html: text
      };

      // send mail with defined transport object
      transporter.sendMail(mailOptions, (err, info) => {
        if (err) {
          return reject(err);
        }
        resolve(info);
      });
    })
  }
  return {
    sendMail: sendMail,
  };
});

/**
 * Returns a server SendMailer object.
 */
module.exports = serverMailer();
