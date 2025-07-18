const express = require("express");
const Router = express.Router();
const dbQuery = require("../database/dbhelper.js");
const {authmiddleware} = require("../middleware.js");

Router.get("/", authmiddleware ,async function(request,response){
    try {
        const {isLoggedIn,isAdmin} = request;
        if(isLoggedIn && isAdmin === "yes"){

            let query = `select * from users`;
            let params = [];
            let allStudents = await dbQuery(query,params);
            response.render("showstudents.ejs",{
                arr : allStudents
            });
        } else{
            response.redirect("http://localhost:8000/home");
        }
    } catch (error) {
        response.status(500).send(error);
    }
})

Router.post("/",async function(request,response){
    try {
        const {deletedAt,deletingUserId} = request.body;
        let query = `update users
                    set deletedAt = ?
                    where userId = ?
                    `
        let params = [deletedAt,deletingUserId];
        await dbQuery(query,params);

        response.send(`Student having UserId = ${deletingUserId} softDeleted`);
    } catch (error) {
        response.status(500).send(error);
    }
})

Router.patch("/",async function(request,response){
    try {
        const {userId,name,age,gender,grade,contactno,email,username,password,updatedAt} = request.body;
        
        // Method - 1 🔒 Why parameterized queries are best:SQL injection se safe,Data type casting automatic,Format galti nahi hoti (MySQL khud handle karta hai)
        let query = `update users
                    set name = ?, age = ?, gender = ?, grade = ?, contactno = ?, email = ?, username = ?, password = ?, updatedAt = ?
                    where userId = ?
                    `
        let params = [name,age,gender,grade,contactno,email,username,password,updatedAt,userId];
        await dbQuery(query,params);

                        //  Method - 2 clean & efficient here but not the best
        // let query = `update users 
        //             set name = "${name}", age = ${age}, gender = "${gender}", grade = "${grade}", contactno = "${contactno}", email = "${email}", username = "${username}", password = "${password}"
        //             where userId = ?
        //             `
        // let params = [userId];
        // await dbQuery(query,params);

        // Method - 3 Long and unnecessary here 
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
        

        response.send("Record Updated successfully");
    } catch (error) {
        response.status(500).send(error);
    }
})

module.exports = Router;