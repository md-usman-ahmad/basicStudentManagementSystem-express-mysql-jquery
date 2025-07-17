const express = require("express");
const Router = express.Router();
const dbQuery = require("../database/dbhelper.js");
const {authmiddleware} = require("../middleware.js");


Router.get("/", authmiddleware ,async function(request,response){
    try {
        const {isLoggedIn,isAdmin} = request;
        if(isLoggedIn && isAdmin === "yes"){
            response.render("admindashboard.ejs");
        } else{
            response.redirect("http://localhost:8000/home");
        }
    } catch (error) {
        console.log("admindashboard m error arha hai",error);
        response.status(500).send(error);
    }
})
module.exports = Router;