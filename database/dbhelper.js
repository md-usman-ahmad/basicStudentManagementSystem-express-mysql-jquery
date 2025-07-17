
const connection = require("./db");

async function dbQuery(query,params){
    return new Promise(function(resolve,reject){
        connection.query(query,params, function(error,result){
            if(error){
                console.log("error = ",error);
                reject(error);
            }
            console.log("result =",result);
            resolve(result);
        })
    })
}

module.exports = dbQuery;