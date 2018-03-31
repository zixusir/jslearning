const chatServer = require('../chat_server')

module.exports = {
    'GET /message': async (ctx, next) => {
        if (ctx.session && ctx.session.isLogin && ctx.session.username) {
            ctx.render('message.html', {
                isLogin: true,
                user: ctx.session.username
            })
        } else {
            ctx.render('message.html', {
                isLogin: false
            })
        }

    }
}