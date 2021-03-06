const mysql = require('mysql')

const config = require('./config')

let mysqlConnect = mysql.createPool({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'userdata',
    port: '3306'
})

let queryWithVal = function (sql, values) {
    return new Promise((resolve, reject) => {
        mysqlConnect.getConnection(function (err, connection) {
            if (err) {
                reject(err)
            } else {
                connection.query(sql, values, (err, rows) => {
                    if (err) {
                        reject(err)
                    } else {
                        resolve(rows)
                    }
                    connection.release()
                })
            }
        })
    })
}

let query = function (sql) {
    return new Promise((resolve, reject) => {
        mysqlConnect.getConnection(function (err, connection) {
            if (err) {
                reject(err)
            } else {
                connection.query(sql, (err, rows) => {
                    if (err) {
                        reject(err)
                    } else {
                        resolve(rows)
                    }
                    connection.release()
                })
            }
        })
    })
}

module.exports = { query, queryWithVal };