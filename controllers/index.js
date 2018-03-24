module.exports = {
    'GET /': async (ctx, next) => {
        //check the user status
        if(ctx.session && ctx.session.isLogin && ctx.session.username){
            ctx.render('index.html', {
                title: 'Zixu Space Station',
                isLogin: true,
                user: ctx.session.username
            });
            console.log('you have login in')
        } else {
            ctx.render('index.html', {
                title: 'Zixu Space Station',
                isLogin: false
            })
        }
        
    },
    'GET /message': async (ctx, next) => {
        ctx.render('message.html', { });
        console.log('message has been rendered!');
    }
};