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