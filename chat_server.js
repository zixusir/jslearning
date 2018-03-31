//create WebSocket
const WebSocket = require('ws')
const WebSocketServer = WebSocket.Server

function createMsg(type, user, data) {
    return JSON.stringify({
        type: type,
        user, user,
        data, data
    })

}

let createWebSocket = (server) => {
    let wss = new WebSocketServer({
        server: server
    })

    let user = 'hello John'
    let onMessage = (message) => {
        console.log(`server receive message ${message}`)
        if (message && message.trim()) {
            let msg = createMsg("msg", user, message.trim())
            wss.clients.forEach((client) => {
                client.send(msg)
            })
        }
    }
    let onClose = () => { 
        let msg = createMsg('close', user, `${user} 离开了`)
        wss.clients.forEach((client) => {
            client.send(msg)
        })
    }
    let onError = () => {

    }

    wss.on('connection', (ws) => {
        console.log(`[SERVER] connection()!`)
        ws.on('message', onMessage)
        ws.on('close', onClose)
        ws.on('error', onError)
    })

    console.log('ws server started at port 3000...')
}

module.exports = {
    'createWebSocket': createWebSocket
}