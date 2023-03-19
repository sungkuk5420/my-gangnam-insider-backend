var express = require('express');
var router = express.Router();
var request = require('request');
var admin = require("firebase-admin");
const { initializeApp } = require('firebase-admin/app');
const { getAuth } = require('firebase-admin/auth');


var serviceAccount = require("../mygangnaminsider-9efc4-firebase-adminsdk-gnuir-6fd58f198b.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://mygangnaminsider-9efc4-default-rtdb.firebaseio.com"
});
router.get("/", (req, res) => {
  res.send("hello")
});
router.get("/auth", (req, res) => {

  // console.log(req.query)
  const code = req.query.code;
  // console.log(code)
  // let redirect_uri = "http://localhost:4000/auth"
  let redirect_uri = "http://localhost:8080/line-login"
  // let redirect_uri = "https://rolling-papers.netlify.app/line-login"


  var options = {
    url: 'https://api.line.me/v2/oauth/accessToken',
    method: 'POST',

    form: {
      "grant_type": "authorization_code",
      "code": code,
      "redirect_uri": redirect_uri,
      "client_id": "1657857854",
      "client_secret": "cfb982fbe7dc24d40ec779ec59cf02e5",
    }
  }

  console.log('https://api.line.me/v2/oauth/accessToken');


  request(options, function (error, response, body) {

    console.log(error);
    console.log(response.body);

    let accessToken = JSON.parse(body).access_token
    var headers = {
      'Authorization': `Bearer ${accessToken}`
    }

    var options = {
      url: 'https://api.line.me/v2/profile',
      method: 'GET',
      headers: headers,
    }



    request(options, function (error, response, body) {

      console.log(error);

      console.log(body);

      let userId = JSON.parse(body).userId
      console.log("userId", userId)
      const uid = userId || "error";

      if (uid == "error") {
        res.json({ ...JSON.parse(body) })
      } else {
        getAuth()
          .createCustomToken(uid)
          .then((customToken) => {
            // Send token back to client
            res.json({ ...JSON.parse(body), customToken })
          })
          .catch((error) => {
            console.log('Error creating custom token:', error);
          });
      }

    })

  })

});
router.get("/reset-password", (req, res) => {
  const userEmail = 'sungkuk5420@gmail.com';
  var actionCodeSettings = {
    url: 'https://mygangnaminsider.com/?email=' + userEmail,
    iOS: {
      bundleId: 'com.example.ios'
    },
    android: {
      packageName: 'com.example.android',
      installApp: true,
      minimumVersion: '12'
    },
    handleCodeInApp: true,
    // When multiple custom dynamic link domains are defined, specify which
    // one to use.
    dynamicLinkDomain: "example.page.link"
  };
  getAuth()
    .generatePasswordResetLink(userEmail, actionCodeSettings)
    .then((link) => {
      // Construct password reset email template, embed the link and send
      // using custom SMTP server.
      return sendCustomPasswordResetEmail(userEmail, displayName, link);
    })
    .catch((error) => {
      // Some error occurred.
      console.log(error)
    });

});



module.exports = router;
