##服务端API 
##服务端
通过require('socket.io')引入

new Server(httpServer[, options])
>httpServer (http.Server) socket.io所绑定的服务器.
>options (Object)
>>path (String): 捕获路径,默认为(/socket.io)
>>serveClient (Boolean): 是否充当客户端,默认为 (true)
>>adapter (Adapter):要使用的适配器。默认为基于内存的socket.io附带的Adapter实例。请参阅[socket.io-adapte](https://github.com/socketio/socket.io-adapter)
>>origins (String): 允许的源（*）
>>parser (Parser): 所使用解析器。默认为socket.io附带Parser的一个实例。

直接引用，或者通过new创建一个实例：
```js
const io = require('socket.io')();
// or
const Server = require('socket.io');
const io = new Server();
```

传递给socket.io的选项总是相同地传递给创建的engine.io服务器。 你可以参考engin.io的相关设置[选项](https://github.com/socketio/engine.io#methods-1)

在这些选项中：
.pingTimeout（Number）：没有pong数据包考虑多少毫秒后关闭连接（60000）
.pingInterval（Number）：在发送新的ping数据包之前多少ms（25000）

在客户端知道服务器不再可用之前，这两个参数将影响延迟。例如，如果由于网络问题导致基础TCP连接未正确关闭，则客户端可能必须在获取断开连接事件之前等待pingTimeout + pingInterval毫秒。

注意：顺序很重要。默认情况下，首先建立一个长轮询连接，如果可能的话，然后升级到WebSocket。使用['websocket']意味着如果无法打开WebSocket连接，则不会有后备。

```js
const server = require('http').createServer();

const io = require('socket.io')(server, {
  path: '/test',
  serveClient: false,
  // below are engine.IO options
  pingInterval: 10000,
  pingTimeout: 5000,
  cookie: false
});

server.listen(3000);
```
new Server(port[,options])
port（数字）要监听的端口（将创建一个新的http.Server）
options（对象）

请参阅[上文的可用选项](https://socket.io/docs/server-api/#new-server-httpserver-options)

```js
const server = require('http').createServer();

const io = require('socket.io')(3000, {
  path: '/test',
  serveClient: false,
  // below are engine.IO options
  pingInterval: 10000,
  pingTimeout: 5000,
  cookie: false
});
```