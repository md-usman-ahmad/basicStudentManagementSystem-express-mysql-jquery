const express = require("express");
const Router = express.Router();
const {authmiddleware} = require("../middleware.js");

Router.get("/", authmiddleware ,async function(request,response){
    try {
        console.log("hgfhjfhgfghhgfhgf");
        
        const {isLoggedIn,isAdmin} = request;
        if(isLoggedIn && isAdmin === "yes" ){
            response.redirect("http://localhost:8000/admindashboard")
        } else if(isLoggedIn && isAdmin === "no"){
            response.redirect("http://localhost:8000/studentashboard");
        } else{
            response.render("home.ejs");
        }
    } catch (error) {
        console.log("home m error arha hai",error);
        response.status(500).send(error);
    }
})

module.exports = Router;
