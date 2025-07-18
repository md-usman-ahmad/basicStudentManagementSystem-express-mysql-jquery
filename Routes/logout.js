const express = require("express");
const Router = express.Router();

Router.post("/",function(request,response){
    response.clearCookie("token");  // key ka naam strings me
    // How clearCookie works
    // response.setHeader('Set-Cookie','token=5000;Expires=Thu, 01 Jan 1970 00:00:00 GMT')
    response.send("Logout Successfull");
})
module.exports = Router;