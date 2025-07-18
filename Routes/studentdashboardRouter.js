const express = require("express");
const Router = express.Router();
const {authmiddleware} = require("../middleware.js");

Router.get("/", authmiddleware ,async function(request,response){
    try {
        const {isLoggedIn,isAdmin} = request;
        if(isLoggedIn && isAdmin === "no"){
            response.render("studentdashboard.ejs");
        } else{
            response.redirect("http://localhost:8000/home");
        }
    } catch (error) {
        response.status(500).send(error);
    }
})

module.exports = Router;