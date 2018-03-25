const mysql = require('mysql')

const { query } = require('../mysqlPromise')

let fn_signin = async (ctx,next) => {
    ctx.render("signin.html")
}

let fn_stateCheck = async (ctx, next) => {
    console.log(`start to check the state of user!`)
    let formData = ctx.request.body
    let check_qry = `select * from usernp where user = ? and password = ? limit 1`
    let check_pra = [formData.username, formData.password]
    let check_result = await query(check_qry, check_pra)
    if ( Array.isArray(check_result) && check_result.length > 0) {
        ctx.session.isLogin = true,
        ctx.session.username = formData.username
        ctx.render('index.html', {
            title: 'Zixu Space Station',
            isLogin: true,
            user: formData.username
        })
        console.log('login in success')
    } else {
        ctx.render('signin.html', {
            msg: true,
            content: 'login in failed, try again!'
        })
        console.log('login in failed')
    }
    
}

let fn_signout = async (ctx, next) => {
    if (ctx.session.isLogin === false) {
        ctx.render('index.html', {
            msg: true,
            content: '你还没有登陆！'
        })
    } else {
        ctx.render('index.html', {
            isLogin: false,
        })
        ctx.session.isLogin = false
        ctx.session.username = null
    }
}

module.exports = {
    'GET /signin': fn_signin,
    'POST /signin': fn_stateCheck,
    'GET /signout': fn_signout
}