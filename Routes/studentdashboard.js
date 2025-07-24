const express = require("express");
const Router = express.Router();
const {authmiddleware} = require("../middleware.js");
const dbQuery = require("../database/dbhelper.js");
const {SECRET} = require("../constants.js");    
const jwt = require("jsonwebtoken");

Router.get("/", authmiddleware ,async function(request,response){
    try {
        const {isLoggedIn,isAdmin,currentloggedInUsername,currentloggedInStudentLoginCount} = request;
        if(isLoggedIn && isAdmin === "no"){
            
            query = `select * from users where username = ?`
            params = [currentloggedInUsername];
            let outputFromDB = await dbQuery(query,params);
            console.log("outputFromDB GET method  =",outputFromDB[0]);

            
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

Router.patch("/edit",async function(request,response){
    try {
        console.log("/studentdashboard/edit");
        const {userId,name,age,gender,grade,contactno,email,username,password,updatedAt,logincount} = request.body;
        console.log("typeof userId =",typeof userId,"userId =",userId);

        // Method - 2 Long and unnecessary here 
        // let query = `select * from users where userId = ?`
        // let params = [parseInt(userId)];
        // let outputFromDB = await dbQuery(query,params);
        // console.log(`checking if studentDetails of given userId-${userId} exist or not `,outputFromDB);

        // if(outputFromDB.length !== 0){
        //     // deleting this record 
        //     query = `delete from users where userId = ?`
        //     params = [parseInt(userId)];
        //     await dbQuery(query,params)
        //     console.log(`deleted studentDetails of userId-${userId}`);
        // }
        // //  now inserting again with updated values(if any)
        // query = `insert into users(userId,name,fathername,age,gender,grade,contactno,email,username,password,createdAt,updatedAt,deletedAt) values(?,?,?,?,?,?,?,?,?,?,?,?,?)`
        // params = [parseInt(userId),name,outputFromDB[0].fathername,age,gender,grade,contactno,email,username,password,outputFromDB[0].createdAt,updatedAt,outputFromDB[0].deletedAt]
        // await dbQuery(query,params);
        // response.send("Record updated successfully");

        // Method - 1 clean & efficient here
        // let query = `update users
        //             set name = "${name}"", age = "${age}", gender = "${gender}", grade = "${grade}", contactno = "${contactno}", email = "${email}", username = "${username}", password = "${password}", updatedAt = "${updatedAt}"
        //             where userId = ?
        //             `
        // console.log("typeof userId =",typeof parseInt(userId),"userId =",parseInt(userId));
        // let params = [parseInt(userId)];
        // await dbQuery(query,params);

        // Method -3 🔒 Why parameterized queries are best:SQL injection se safe,Data type casting automatic,Format galti nahi hoti (MySQL khud handle karta hai)
        let query = `update users
                    set name = ?, age = ?, gender = ?, grade = ?, contactno = ?, email = ?, username = ?, password = ?, updatedAt = ?
                    where userId = ?
                    `
        console.log("typeof userId =",typeof parseInt(userId),"userId =",parseInt(userId));
        let params = [name,age,gender,grade,contactno,email,username,password,updatedAt,parseInt(userId)];
        await dbQuery(query,params);

        // IMPORTANT---
        /* cookies me username save krrhe the to student ne agr updation me username change kiya  to jwt.verify(middleware) me payload k andrr purana wala username save hai jb studentlogin kiya wo wala BUT update k baad to username change hochuka hai mysql table me bhi change hoga zaahir hai , jb page refresh hua to  GET method chlega studentdashboard ka tb 
        let query =  `select * from users where username = ?`
        let params = [currentUser];
        let currentLoggedInStudentData = await dbQuery(query,params);
        response.render("studentdashboard.ejs",{
            currentLoggedInStudentName: currentLoggedInStudentData[0].name,
            currentLoggedInStudentData,
            currentLoggedInStudentlogincount : currentLoggedInStudentData[0].logincount
        });
        isme currentUser me jwt.verify(middleware) se purana wala username aya BUT table me to naya wala username save hai isliye output to empty array ayga means currentLoggedInStudentData ek khaali array hoga hence  TypeError: Cannot read properties of undefined (reading 'name','logincount') ye error dega. */

        /* hence student ka  username update hote hi jwt ko firse assign krrhe updated username k saath.
            ab jb page refresh hoga to middleware chlega jwt.verify hoke updated username payload me save hoga then  studentDashboard ka GET method chlega to mysql table me updated username present hoga to query run krjaygii withour error
         */
        response.cookie("token",jwt.sign({
                    isAdmin : "no",
                    currentloggedInUsername : username, 
                },SECRET));
        response.send("Record Updated successfully");
    } catch (error) {
        response.status(500).send(error);
    }
})

module.exports = Router;