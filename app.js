const koa = require('koa')

const bodyParser = require('koa-bodyparser')

const controller = require('./controller')

const templating = require('./templating')

const config = require('./config')

const mysql = require('mysql')

const io = require('socket.io')

// const chatServer = require('./chat_server')

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

app.use(async (ctx, next) => {
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

let chat_server = io(server)

let socketsPool = {}//来自各个客服端的socket连接池

chat_server.on('connection', (socket) => {//chat_server是服务器端的socket，参数传递的socket是客户端发送过来的socket
    console.log('success in connectting')
    var fromUser = {}

    socket.on('getOnline', function (msg) {
        //监听用户连接后的用户信息
        if(!socketsPool.hasOwnProperty(msg.username)) {
            socketsPool[msg.username] = socket//将来自username的socket存入socketsPool
            fromUser = msg.username
            console.log('用户'+msg.username+'已存入')
        }

        socket.on('message', function (msg) {
            console.log(`server receive message:${msg}`)
            //侦听来自客服端的消息
            if (socketsPool[msg.toUser]) {
                socketsPool[msg.toUser].emit('to' + msg.toUser, msg)
            } else {
                socketsPool[msg.fromUser].emit('to' + msg.fromUser, {
                    fromUser: msg.toUser,
                    toUser: msg.fromUser,
                    content: msg.toUser + '未上线'
                })
            }
        })
    })

    socket.on('disconnect', function() {
        delete socketsPool[fromUser]
    })
})

console.log('app started at port 3000')