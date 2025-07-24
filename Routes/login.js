const express = require("express");
const Router = express.Router();
const dbQuery = require("../database/dbhelper.js");
const jwt = require("jsonwebtoken");
const {SECRET} = require("../constants.js");
const {authmiddleware} = require("../middleware.js");

const passport = require("../passport-config.js");



Router.get("/", authmiddleware ,async function(request,response){
    try {
        const {isLoggedIn , isAdmin} = request;
        if(isLoggedIn && isAdmin){
            response.redirect("http://localhost:8000/home");
        } else{
            response.render("login.ejs");
        }
    } catch (error) {
        response.status(500).send(error);
    }
})

Router.post("/",async function(request,response){
    try {
        const {username,password} = request.body;
        
        let query = `select * from users where username = ?`
        let params = [username];
        let outputFromDB = await dbQuery(query,params);
        if(outputFromDB.length !== 0){
            if(password === outputFromDB[0].password){

                let query = `update users
                    set logincount = ?
                    where username = ?
                    `
                let params = [outputFromDB[0].logincount + 1, username];
                await dbQuery(query,params);
                response.cookie("token",jwt.sign({
                    isAdmin : outputFromDB[0].isAdmin,
                    currentloggedInUsername : outputFromDB[0].username
                },SECRET));
                response.send("Login Successfull");
            } else{
                throw "Wrong password!"
            }
        } else{
            throw "Authentication Failed!!! This user doesn't exist in our database"
        }
    } catch (error) { 
        response.status(500).send(error);
    }
})

Router.patch("/",async function(request,response){
    try {
        const {newPassword,username} = request.body;
        let query = `select * from users where username = ?`
        let params = [username];
        let aUser = await dbQuery(query,params);
        if(aUser[0].length === 0){
            throw "Authentication Failed!!! This user doesn't exist in our database"
        }
        query = `update users
                set password = ?
                where username = ?
                `
        params = [newPassword,username];
        await dbQuery(query,params);
        response.send(`Password Updated of a user having  username[${username}]`);
    } catch (error) {
        response.status(500).send(error);
    }
})

// ------------------- OAuth login via Google using passport.js ------------------------------------------------

// after clicking on 'continue with Google' button 
Router.get("/google", passport.authenticate('google', {
  scope: ['profile', 'email'], //google ka scope ye hota hai email get krne k lie
  prompt: 'select_account'  // force Google to show account picker every time
}));

Router.get("/google/callback",passport.authenticate("google",{
  session : false
}), async function(request,response,next){
    console.log("request.user =",request.user);
    const user = request.user;
    const token = jwt.sign({ isAdmin : user.isAdmin , currentloggedInUsername : user.username}, SECRET, {
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

// ------------------- OAuth login via Github using passport.js ------------------------------------------------

// after clicking on 'continue with Github' button 
Router.get("/github", passport.authenticate('github', {
  scope: ['profile', 'user:email'], //google ka scope ye hota hai email get krne k lie
  prompt: 'select_account'  // its useless as github doesnt allow choosing diffrent github accounts, it will login then redirect to your given callback url.
}));

Router.get("/github/callback",passport.authenticate("github",{
  session : false
}), function(request,response,next){
    console.log("request.user =",request.user);
    const user = request.user;
    const token = jwt.sign({ isAdmin : user.isAdmin , currentloggedInUsername : user.username},SECRET, {
      expiresIn: '1h'
    })

  response.cookie('token', token)
  // response.send('callback is working')
  response.redirect("http://localhost:8000/home");
})


module.exports = Router;