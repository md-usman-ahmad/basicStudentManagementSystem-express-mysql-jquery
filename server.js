const express = require("express");
const app = express();

const constants = require("./constants.js");
const bodyParser = require("body-parser");
const cors = require("cors");
const cookieParser = require("cookie-parser");
let jwt = require("jsonwebtoken");
const dbQuery = require("./database/dbhelper.js");
require("dotenv").config();
// console.log("process.env = ",process.env);

const passport = require("passport");

const GithubStrategy = require('passport-github').Strategy;
// Configure Passport to use Github OAuth
passport.use(new GithubStrategy({
  clientID: process.env.GITHUB_CLIENTID,
  clientSecret: process.env.GITHUB_CLIENTSECRET,
  callbackURL: "http://localhost:8000/github/callback"
}, async function(accessToken, refreshToken, profile, cb){
  console.log("profile =",profile);
  try {
    const outputFromDB = await dbQuery(`SELECT * FROM users WHERE username = ?`, [
      profile.username,
    ]);
    console.log("outputFromDB =",outputFromDB);

    if (outputFromDB.length > 0) {  
      cb(null, outputFromDB[0]);
    } else {
      await dbQuery(`INSERT INTO users (name,username,password,createdAt,logincount,isAdmin,provider) VALUES (?, ?, ?, ?, ?, ?,?)`, [
        profile.displayName, profile.username, "", new Date().toISOString().slice(0,10), 0, "no", profile.provider
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

// Intiliazing passport as middleware in our application
app.use(passport.initialize());

// after clicking on 'continue with Google' button 
app.get("/github", passport.authenticate('github', {
  scope: ['profile', 'email'],
  prompt: 'select_account'  // force github to show account picker every time
}));

app.get("/github/callback",passport.authenticate("github",{
  session : false
}), async function(request,response,next){
    console.log("request.user =",request.user);
    const user = request.user;
    const token = jwt.sign({ isAdmin : user.isAdmin , currentloggedInUsername : user.username}, constants.SECRET, {
      expiresIn: '1h'
    })

  response.cookie('token', token)

// user login krgya isiliye logincount increment krrhe 
    let query = `update users 
                set logincount = ?
                where userId = ?`
    let params = [user.logincount+1 , user.userId ];
    await dbQuery(query,params);
//   response.send('callback is working')
  response.redirect("http://localhost:8000/home");
})















// const GoogleStrategy = require('passport-google-oauth20').Strategy;

// // Configure Passport to use Google OAuth
// passport.use(new GoogleStrategy({
//   clientID: process.env.GOOGLE_CLIENTID,
//   clientSecret: process.env.GOOGLE_CLIENTSECRET,
//   callbackURL: "http://localhost:8000/google/callback"
// }, async function(accessToken, refreshToken, profile, cb){
//   console.log("profile =",profile);
//   try {
//     const outputFromDB = await dbQuery(`SELECT * FROM users WHERE email = ?`, [
//       profile.emails[0].value,
//     ]);
//     console.log("outputFromDB =",outputFromDB);

//     if (outputFromDB.length > 0) {  
//       cb(null, outputFromDB[0]);
//     } else {
//       await dbQuery(`INSERT INTO users (name, email,username,password,createdAt,logincount,isAdmin,provider) VALUES (?, ?, ?, ?, ?, ?, ?,?)`, [
//         profile.displayName, profile.emails[0].value, profile.displayName+"_"+profile.id, "", new Date().toISOString().slice(0,10), 0, "no", profile.provider
//       ]);
//       const outputFromDB = await dbQuery(`SELECT * FROM users WHERE email = ?`, [
//         profile.emails[0].value,
//       ]);
//       cb(null, outputFromDB[0]);
//     }

//   } catch (error) {
//     cb(error,false);
//   }
// }))

// // Intiliazing passport as middleware in our application
// app.use(passport.initialize());

// // after clicking on 'continue with Google' button 
// app.get("/google", passport.authenticate('google', {
//   scope: ['profile', 'email'],
//   prompt: 'select_account'  // force Google to show account picker every time
// }));

// app.get("/google/callback",passport.authenticate("google",{
//   session : false
// }), async function(request,response,next){
//     console.log("request.user =",request.user);
//     const user = request.user;
//     const token = jwt.sign({ isAdmin : user.isAdmin , currentloggedInUsername : user.username}, constants.SECRET, {
//       expiresIn: '1h'
//     })

//   response.cookie('token', token)

// // user login krgya isiliye logincount increment krrhe 
//     let query = `update users 
//                 set logincount = ?
//                 where userId = ?`
//     let params = [user.logincount+1 , user.userId ];
//     await dbQuery(query,params);
// //   response.send('callback is working')
//   response.redirect("http://localhost:8000/home");
// })




        // Middlewares 
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended :true}));
// app.use(express.static(path.join(__dirname,'public')));
app.use(express.static(__dirname + '/public'));
app.set('view engine', 'ejs');
app.use(
    cors({
        origin : "*"
    })
);
app.use(cookieParser());

const homeRouter = require("./Routes/home.js");
const loginRouter = require("./Routes/login.js");
const admindashboardRouter = require("./Routes/admindashboard.js");
const showstudentsRouter = require("./Routes/showstudents.js");
const addstudentRouter = require("./Routes/addstudent.js");
const logoutRouter = require("./Routes/logout.js");
const studentdashboardRouter = require("./Routes/studentdashboard.js");

app.use("/home", homeRouter);
app.use("/login",loginRouter);
app.use("/admindashboard",admindashboardRouter);
app.use("/showstudents",showstudentsRouter);
app.use("/addstudent",addstudentRouter);
app.use("/logout",logoutRouter);
app.use("/studentdashboard",studentdashboardRouter);



app.listen(constants.PORT,function(){
    console.log(`server is working on PORT : ${constants.PORT}`);
})
