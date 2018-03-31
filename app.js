const koa = require('koa')

const bodyParser = require('koa-bodyparser')

const controller = require('./controller')

const templating = require('./templating')

const config = require('./config')

const mysql = require('mysql')

const WebSocket = require('ws')

const chatServer = require('./chat_server')

const session = require('koa-session-minimal')

const sessionMysqlStore = require('koa-mysql-session');

const isProduction = process.env.NODE_ENV === 'production'

//creating a new koa app
const app = new koa()

//session store config
//session is used to recored the user signin status in server
const sessionMysqlConfig = config

//config seesion minimal
app.use(session({
    key: "user_id",
    store: new sessionMysqlStore(sessionMysqlConfig)
}))

//log request url
app.use(async (ctx, next) => {
    console.log(`Process ${ctx.request.method} ${ctx.request.url}...`)
    let
        start = new Date().getTime(),
        execTime
    await next()
    execTime = new Date().getTime() - start
    ctx.response.set('X-Response-Time', `${execTime}`)
})

app.use( async(ctx, next) => {
    ctx.server = server
    await next()
})

//static file support
if (!isProduction) {
    let staticFiles = require('./static-files')
    app.use(staticFiles('/static', __dirname + '/static'))
}

//parse request body
app.use(bodyParser())

//add nunjucks as view
app.use(templating('views', {
    noCache: !isProduction,
    watch: !isProduction
}))

//add controller
app.use(controller())

let server = app.listen(3000)

app.wss = chatServer.createWebSocket(server)

console.log('app started at port 3000')