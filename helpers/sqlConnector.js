const config = require("../config/database")
const mysql = require("mysql")
module.exports = function(){
    const sqlClient = mysql.createConnection({
        host: config.sql.host,
        user: config.sql.user,
        password: config.sql.password,
        database:config.sql.db
      });
    return sqlClient
}

