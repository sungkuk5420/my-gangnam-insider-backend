var express = require('express');
var router = express.Router();
var request = require('request');
var admin = require("firebase-admin");
const { initializeApp } = require('firebase-admin/app');
const { getAuth } = require('firebase-admin/auth');
const nodemailer = require('nodemailer');

var serviceAccount = require("../mygangnaminsider-9efc4-firebase-adminsdk-gnuir-6fd58f198b.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://mygangnaminsider-9efc4-default-rtdb.firebaseio.com"
});
router.get("/", (req, res) => {
  res.send("hello")
});
router.get("/reset-password", (req, res) => {

  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: 'mygangnaminsider@gmail.com',
      pass: 'tnugoxrhimyrkcji'
    }
  });

  // return false
  const userEmail = 'sungkuk5420@gmail.com';
  getAuth()
    .getUserByEmail(userEmail)
    .then((userRecord) => {
      // See the UserRecord reference doc for the contents of userRecord.
      console.log(`Successfully fetched user data: ${userRecord.toJSON()}`);
      console.log(userRecord.toJSON().uid);
      const uid = userRecord.toJSON().uid;
      const newPassword = 'sdjkf23Fsdjx';
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
            to: 'sungkuk5420@gmail.com',
            subject: 'hello',
            text: 'your new password: ' + newPassword
          };


          transporter.sendMail(mailOptions, function (error, info) {
            if (error) {
              console.log(error);
            } else {
              console.log('your new password: ' + newPassword);
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
    });
});



module.exports = router;
