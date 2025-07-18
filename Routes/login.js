const express = require("express");
const Router = express.Router();
const dbQuery = require("../database/dbhelper.js");
const jwt = require("jsonwebtoken");
const {SECRET} = require("../constants.js");
const {authmiddleware} = require("../middleware.js");


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
                response.cookie("token",jwt.sign({isAdmin : outputFromDB[0].isAdmin},SECRET));
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

module.exports = Router;