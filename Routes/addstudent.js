const express = require("express");
const Router = express.Router();
const dbQuery = require("../database/dbhelper.js");
const {authmiddleware} = require("../middleware.js");

Router.get("/", authmiddleware ,async function(request,response){
    try {
        const {isLoggedIn,isAdmin} = request;
        if(isLoggedIn && isAdmin){
            response.render("addstudent.ejs");
        } else{
            response.redirect("http://localhost:8000/home");
        }
    } catch (error) {
        response.status(500).send(error);
    }
})

Router.post("/",async function(request,response){
    try {
        const {name,fathername,age,gender,grade,contactno,email,username,password,createdAt} = request.body;
        // checking if username already taken or not by some other student 
        let query = `select * from users where username = ?`
        let params = [username];
        let outputFromDB = await dbQuery(query,params);

        if(outputFromDB.length !== 0){
            if(outputFromDB[0].username === username){
                throw "Username already taken!!! try something else.";
            } 
        }

        query = `insert into users(name,fathername,age,gender,grade,contactno,email,username,password,createdAt,logincount,isAdmin,provider) values(?,?,?,?,?,?,?,?,?,?,?,?,?) `
        params = [name,fathername,age,gender,grade,contactno,name+"@gmail.com",username, name+"_"+username ,createdAt,0,"no","local"];
        await dbQuery(query,params);
        
        response.send("Student added");
    } catch (error) {
        response.status(500).send(error);
    }
})

module.exports = Router;