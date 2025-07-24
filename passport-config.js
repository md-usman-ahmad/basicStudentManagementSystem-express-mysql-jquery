const dbQuery = require("./database/dbhelper.js");
const passport = require("passport");
const GoogleStrategy = require('passport-google-oauth20').Strategy;

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


module.exports = passport;