//register model
const mysql = require('mysql')

const { query } = require('../mysqlPromise')

module.exports = {
    'POST /register': async (ctx, next) => {
        let username = ctx.request.body.username
        let password = ctx.request.body.pwd1

        try {
            //check whether the user has existed!
            let check_str = 'SELECT user from usernp where user = ?'
            let check_pra = [username]
            let check_result = await query(check_str, check_pra)
            if (Array.isArray(check_result) && check_result.length > 0) {
                // if find a user hase the same name in the database, then stop insert and give out msg!
                ctx.render('signin.html', {
                    msg: true,
                    content: 'there is a same name user!'
                })
                return
            } else {
                //insert user information
                let query_str = 'INSERT INTO usernp (user,password) VALUES(?,?)'
                let query_pra = [username, password]
                let insert_result = await query(query_str, query_pra)
                ctx.render('registerok.html', {
                    user: username,
                })
            }
        } catch (err) {
            console.log(`Failed to insert user info for ${err}`)
        }
    },
}