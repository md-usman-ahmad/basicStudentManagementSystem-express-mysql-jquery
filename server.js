const express = require("express");
const app = express();

const constants = require("./constants.js");
const bodyParser = require("body-parser");
const cors = require("cors");
const cookieParser = require("cookie-parser");

require("dotenv").config();
// console.log("process.env = ",process.env);


// Passport.js Routes 
const passport = require("./passport-config.js");
// Initializing passport as middleware in our application
app.use(passport.initialize());



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
