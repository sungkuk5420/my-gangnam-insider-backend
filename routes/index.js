var express = require('express');
var router = express.Router();
var request = require('request');
var admin = require("firebase-admin");
const { initializeApp } = require('firebase-admin/app');
const { getAuth } = require('firebase-admin/auth');
const nodemailer = require('nodemailer');
var generator = require('generate-password');
var serviceAccount = require("../mygangnaminsider-9efc4-firebase-adminsdk-gnuir-6fd58f198b.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://mygangnaminsider-9efc4-default-rtdb.firebaseio.com"
});
router.get("/", (req, res) => {
  res.send("hello")
});
router.get("/reset-password", (req, res) => {
  const email = req.query.email

  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: 'mygangnaminsider@gmail.com',
      pass: 'tnugoxrhimyrkcji'
    }
  });

  // return false
  const userEmail = email;
  getAuth()
    .getUserByEmail(userEmail)
    .then((userRecord) => {
      // See the UserRecord reference doc for the contents of userRecord.
      console.log(`Successfully fetched user data: ${userRecord.toJSON()}`);
      console.log(userRecord.toJSON().uid);
      const uid = userRecord.toJSON().uid;
      var newPassword = generator.generate({
        length: 6,
        numbers: true
      });
      getAuth()
        .updateUser(uid, {
          email: userRecord.toJSON().email,
          password: newPassword,
        })
        .then((userRecord) => {
          // See the UserRecord reference doc for the contents of userRecord.
          console.log('Successfully updated user', userRecord.toJSON());

          const mailOptions = {
            from: 'mygangnaminsider@gmail.com',
            to: userEmail,
            subject: 'hello',
            text: 'your new password: ' + newPassword
          };


          transporter.sendMail(mailOptions, function (error, info) {
            if (error) {
              console.log(error);
            } else {
              console.log('your new password: ' + newPassword);
              res.json({
                success: "sent new password"
              })
              // do something useful
            }
          });
        })
        .catch((error) => {
          console.log('Error updating user:', error);
        });

    })
    .catch((error) => {
      console.log('Error fetching user data:', error);
      res.json({
        ...error
      })
    });
});
router.post("/contact-us", (req, res) => {
  console.log(req.body)
  // return false;
  const email = req.body.contactEmail;
  const subject = req.body.contactSubject;
  const content = req.body.contactContent;

  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: 'mygangnaminsider@gmail.com',
      pass: 'tnugoxrhimyrkcji'
    }
  });

  // return false
  const userEmail = email;

  const mailOptions = {
    from: 'mygangnaminsider@gmail.com',
    to: 'mygangnaminsider@gmail.com',
    subject: subject,
    text: `contact us \n \n userEmail : \n ${userEmail} \n content: \n ${content}`
  };


  transporter.sendMail(mailOptions, function (error, info) {
    if (error) {
      console.log(error);
    } else {
      console.log('sent contact us   ' + userEmail + " / content : " + content);
      res.json({
        success: "sent contact us "
      })
      // do something useful
    }
  });

});



module.exports = router;
