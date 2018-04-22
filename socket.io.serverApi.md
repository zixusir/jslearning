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
