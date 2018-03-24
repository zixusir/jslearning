const koa = require('koa')

const bodyParser = require('koa-bodyparser')

const controller = require('./controller')

const templating = require('./templating')

const config = require('./config')

const mysql = require('mysql')

const WebSocket = require('ws')

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

app.use(async (ctx, next) => {
    ctx.state.user = parseUser(ctx.cookies.get('name') || '')
    await next()
})

let server = app.listen(3000)
console.log('app started at port 3000')

//parserUser funtion
function parseUser(obj) {
    if (!obj) {
        return
    }
    console.log(`try parse ${obj}`)
    let s = ''
    if (typeof obj === 'string') {
        s = obj
    } else if (obj.headers) {
        let cookies = new cookies(obj, nul)
        s = cookies.get('name')
    }
    if (s) {
        try {
            let user = JSON.parse(Buffer.from(s, 'base64').toString())
            console.log(`User: ${user.name}, ID: ${user.id}`)
            return user
        } catch (e) {
            //ignore
        }
    }
}

//create WebSocket
const WebSocketServer = WebSocket.Server
const wss = new WebSocketServer({
    server: server
})

wss.on('connection', (ws) => {
    console.log(`[SERVER] connection() `)
    ws.on('message', (message) => {
        console.log(`[SERVER] Received: ${message}`)
        setTimeout(() => {
            ws.send(`the message you send to server is ${message}`, (err) => {
                if (err) {
                    console.log(`[SERVER] error: % { err }`)
                }
            })
        }, 1000)
    })
})

console.log('ws server started at port 3000...')