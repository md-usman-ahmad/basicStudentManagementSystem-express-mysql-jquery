const jwt = require("jsonwebtoken");
const {SECRET} = require("./constants");


async function authmiddleware(request,response,next){
    try {
        const payload = jwt.verify(request.cookies.token , SECRET);
        console.log("payload authmiddleware =", payload);
        request.isLoggedIn = true;
        request.isAdmin = payload.isAdmin
        next();
    } catch (error) {
        request.isLoggedIn = false;
        next();
    }
}

module.exports = {
    authmiddleware
};