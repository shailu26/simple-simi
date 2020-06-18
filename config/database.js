const dotenv = require('dotenv')
dotenv.config()

const config = {
    sql:{
        host: process.env.SQL_HOST,
        password: process.env.SQL_PASSWORD,
        db: process.env.SQL_DB,
        port: process.env.SQL_PORT,
        user:process.env.SQL_USER
    }
}

module.exports = config
