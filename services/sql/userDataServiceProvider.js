const commonFunction = require('../../common/commonFunction');

module.exports = {

    'getUserDetail' : function (sql, userId) {
    let q = `select * from user where id=${+userId}`
    return commonFunction.excuteQuery(sql, q);
    },
    'createUser': function(sql, user) {
        let {name, email, password} = user;
        let q = `insert into user (full_name, email, password) values('${name}', '${email}', '${password}')`;
        return commonFunction.excuteQuery(sql, q);
    },
    'getUserByEmail': function(sql, email) {
        let q = `select * from user where email='${email}'`;
        return commonFunction.excuteQuery(sql, q);
    },
    'isEmailExist': function(sql, email) {
        let q = `select * from user where email='${email}'`
        return new Promise((resolve, reject) =>{
            commonFunction.excuteQuery(sql, q)
            .then(details => {
                resolve(details.length);
            })
            .catch(err => {
                reject(err);
            });
        })
    },
}
