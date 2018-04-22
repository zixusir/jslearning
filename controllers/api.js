//api model
const mysql = require('mysql')

const { query, queryWithVal } = require('../mysqlPromise')

module.exports = {
    'GET /api/userlist': async (ctx, next) => {
        let queryStr = 'select user from usernp'
        let queryRes = await query(queryStr)
        // console.log(queryRes)
        ctx.response.body = {
            content: queryRes
        }
        ctx.response.type = 'application/json'
    }
}