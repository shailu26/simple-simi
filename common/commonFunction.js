module.exports = {
  'excuteQuery': async function (sql, myQuery) {
    return new Promise((resolve, reject) => {
      sql.query(myQuery, (err, res) => {
        if (err) {
          console.log(`err in exectuting query -> ${myQuery}\n Error -> `, err)
          reject(err);
        } else {
          // console.log("res in cmn",res)
          resolve(res);
        }
      })
    })
  },
}
