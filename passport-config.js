const dbQuery = require("./database/dbhelper.js");
const passport = require("passport");
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const GithubStrategy = require('passport-github').Strategy;

// Configure Passport to use Google OAuth
passport.use(new GoogleStrategy({
  clientID: process.env.GOOGLE_CLIENTID,
  clientSecret: process.env.GOOGLE_CLIENTSECRET,
  callbackURL: "http://localhost:8000/login/google/callback"
}, async function(accessToken, refreshToken, profile, cb){
  console.log("profile =",profile);
  try {
    const outputFromDB = await dbQuery(`SELECT * FROM users WHERE email = ?`, [
      profile.emails[0].value,
    ]);
    console.log("outputFromDB =",outputFromDB);

    if (outputFromDB.length > 0) {  
      cb(null, outputFromDB[0]);
    } else {
      await dbQuery(`INSERT INTO users (name, email,username,password,createdAt,logincount,isAdmin,provider) VALUES (?, ?, ?, ?, ?, ?, ?,?)`, [
        profile.displayName, profile.emails[0].value, profile.displayName+"_"+profile.id, "", new Date().toISOString().slice(0,10), 0, "no", profile.provider
      ]);
      const outputFromDB = await dbQuery(`SELECT * FROM users WHERE email = ?`, [
        profile.emails[0].value,
      ]);
      cb(null, outputFromDB[0]);
    }

  } catch (error) {
    cb(error,false);
  }
}))

// Configure Passport to use Github OAuth
passport.use(new GithubStrategy({
  clientID: process.env.GITHUB_CLIENTID,
  clientSecret: process.env.GITHUB_CLIENTSECRET,
  callbackURL: "http://localhost:8000/login/github/callback"
}, async function(accessToken, refreshToken, profile, cb){
  console.log("profile =",profile);
  try {
    const outputFromDB = await dbQuery(`SELECT * FROM users WHERE username = ?`, [
      profile.username
    ]);
    console.log("outputFromDB =",outputFromDB);

    if (outputFromDB.length > 0) {  
      cb(null, outputFromDB[0]);
    } else {
      await dbQuery(`INSERT INTO users (name,username,password,createdAt,provider) VALUES (?, ?, ?, ?, ?)`, [
        profile.displayName, profile.username, "" ,new Date().toISOString().slice(0,10), profile.provider
      ]);
      const outputFromDB = await dbQuery(`SELECT * FROM users WHERE username = ?`, [
        profile.username,
      ]);
      cb(null, outputFromDB[0]);
    }

  } catch (error) {
    cb(error,false);
  }
}))

module.exports = passport;