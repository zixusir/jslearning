//create WebSocket
const WebSocket = require('ws')

const Cookies = require('cookies')

const WebSocketServer = WebSocket.Server

function createMsg(type, user, data) {
    return JSON.stringify({
        type: type,
        user, user,
        data, data
    })
}

function parserUser(obj) {
    if (!obj) {
        console.log('Dont find a user')
        return
    }
    let s = ''
    if (typeof (s) === 'string') {
        s = obj
        console.log(`s is string ${s}`)
    } else if (obj.headers) {
        let cookies = new Cookies(obj, null)
        s = cookies.get('username')
        console.log(`s is ${s}`)
    } else {
        console.log(`s is not defined`)
    }
    if (s) {
        try {
            // let user = JSON.parse(Buffer.from(s, 'base64').toString())
            let user = s
            console.log('get user!')
            return user
        } catch (e) {
            console.log(`error: ${e}`)
        }
    } else {
        console.log(`can't get s`)
    }
}

let createWebSocket = (server) => {
    let wss = new WebSocketServer({
        server: server
    })

    let onMessage = (message) => {
        console.log(`server receive message ${message}`)
        if (message && message.trim()) {
            let msg = createMsg("msg", this.user, message.trim())
            wss.clients.forEach((client) => {
                client.send(msg)
            })
        }
    }
    let onClose = () => {
        let msg = createMsg('close', this.user, `${this.user} left`)
        wss.clients.forEach((client) => {
            client.send(msg)
        })
    }
    let onError = () => {
    }

    wss.on('connection', (ws) => {
        console.log(`[SERVER] connection()!`)
        let user = parserUser(ws.upgradeReq)
        ws.on('message', onMessage)
        ws.on('close', onClose)
        ws.on('error', onError)
        ws.user = user
    })

    console.log('ws server started at port 3000...')
}

module.exports = {
    'createWebSocket': createWebSocket
}