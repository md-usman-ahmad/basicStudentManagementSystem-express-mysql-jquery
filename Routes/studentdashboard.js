const express = require("express");
const Router = express.Router();
const {authmiddleware} = require("../middleware.js");
const dbQuery = require("../database/dbhelper.js");
const { param } = require("./login.js");

Router.get("/", authmiddleware ,async function(request,response){
    try {
        const {isLoggedIn,isAdmin,currentloggedInUsername,currentloggedInStudentLoginCount} = request;
        if(isLoggedIn && isAdmin === "no"){
            let query = `update users
                    set logincount = ?
                    where username = ?
                    `
            let params = [currentloggedInStudentLoginCount + 1, currentloggedInUsername];
            await dbQuery(query,params);

            query = `select * from users where username = ?`
            params = [currentloggedInUsername];
            let outputFromDB = await dbQuery(query,params);
            console.log("outputFromDB GET method 2 =",outputFromDB[0]);

            
            response.render("studentdashboard.ejs",{
                currentLoggedInStudentlogincount : outputFromDB[0].logincount,
                currentLoggedInStudentName : outputFromDB[0].name,
                currentLoggedInStudentData : outputFromDB[0]
            });
        } else{
            response.redirect("http://localhost:8000/home");
        }
    } catch (error) {
        console.log("error =",error);
        response.status(500).send(error);
    }
})

Router.patch("/",async function(request,response){
    try {
        const {username,newPassword} = request.body
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

        //logincount 1 hai isliye token remove krna pda(majboori) vrna ejs m currentLoggedInStudentlogincount p condition lgi hui hai jo ki 1 hi rhta hence dashboard ni khulta hmesha update password k liye div khulta.
        response.clearCookie("token");

        response.send("password updated successfully of 1st time logged in Student")
    } catch (error) {
        response.status(500).send(error);
    }
})

module.exports = Router;