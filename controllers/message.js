module.exports = {
    'GET /message': async (ctx, next) => {
        if (ctx.session && ctx.session.isLogin && ctx.session.username) {
            ctx.render('message.html', {
                isLogin: true,
                user: ctx.session.username
            })
        } else {
            ctx.render('signin.html', {
                msg: true,
                content: '要使用聊天功能，首先需要登陆^-^'
            })
        }

    }
}