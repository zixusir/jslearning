module.exports = {
    'GET /': async (ctx, next) => {
        ctx.render('index.html', {
            title: 'Zixu Space Station'
        });
        console.log('index has been rendered!');
    },
    // 'GET /:name': async (ctx, next) => {
    //     ctx.render('index.html', {
    //         title: 'Zixu Space Station',
    //         user: ctx.params.name
    //     });
    //     console.log('you name:'+ctx.params.name);
    // },
    'GET /message': async (ctx, next) => {
        ctx.render('message.html', { });
        console.log('message has been rendered!');
    }
};