let fn_signin = async (ctx,next) => {
    ctx.render("signin.html");
};

let fn_stateCheck = async (ctx, next) => {
    console.log(`start to check the state of user!`);
    let formData = ctx.request.body;
    ctx.render('signin.html', {
        state: formData,
    })
};

module.exports = {
    'GET /signin': fn_signin,
    'POST /signin': fn_stateCheck
};