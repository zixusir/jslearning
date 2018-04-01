#socket.io官方文档翻译3
![socket.io](https://socket.io/assets/img/logo.svg)
原文地址(https://socket.io/docs/rooms-and-namespaces/)

##命名空间
Socket.IO允许你用“命名空间”限定你的socket连接，这实际上意味着分配不同的端点或路径。

这是一个非常有用的功能，通过引入通信通道之间的分离，可以最大限度地减少资源数量（TCP连接），并同时区分应用程序中的关系。

###默认命名空间
我们默认的命名空间为/，默认情况下Socket.IO客户端连接到这个命名空间，服务器也侦听的这个命名空间。

这个命名空间由io.sockets或io标识：
```js
// the following two will emit to all the sockets connected to `/`

io.sockets.emit('hi', 'everyone');
io.emit('hi', 'everyone'); // short form
```

###自定义命名空间
在服务器端可以通过调用of函数来设置一个自定义命名空间
```js
var nsp = io.of('/my-namespace');
nsp.on('connection', function(socket){
  console.log('someone connected');
});
nsp.emit('hi', 'everyone!');
```

在客服端，设置socket.io客服端连接到这个命名空间
```js
var socket = io('/my-namespace');
```

>>注意：命名空间是Socket.IO协议的实现细节，与底层传输的实际URL无关，默url为/socket.io/...。

###房间
在每个命名空间中，你也可以定义任意的通道，使得每个sockets都可以join和leave。

###加入和离开
你可以通过调用join来使得socket连接到指定的通道：
```js
io.on('connection', function(socket){
  socket.join('some room');
});
```
接下来在广播和发送信息时，只需要简单地使用to或者in(这两者是一样的)
```js
io.to('some room').emit('some event');
```
###默认房间
Socket.IO中的每个Socket都由一个随机的，不可猜测的唯一标识符Socket#id来标识。为了方便，每个socket都会自动加入由此ID标识的房间。
这样更加容易把信息广播给其他的socket连接
```js
io.on('connection', function(socket){
  socket.on('say to someone', function(id, msg){
    socket.broadcast.to(id).emit('my message', msg);
  });
});
```
###断开连接
断开连接后，socket将自动退出所有通道，并且不需要特别销毁。

##从外部世界发送消息
在某些情况下，您可能希望将事件从Socket.IO进程之外发送到Socket.IO命名空间/房间的socket.io中。

有几种方法可以解决这个问题，比如实现自己的通道道以将消息发送到进程中。

为了方便这种情况下的使用，我们开发了两个模块：
-[socket.io-redis](https://github.com/socketio/socket.io-redis)
-[socket.io-emitter](https://github.com/socketio/socket.io-emitter)

Redis Adapter的用法：
```js
var io = require('socket.io')(3000);
var redis = require('socket.io-redis');
io.adapter(redis({ host: 'localhost', port: 6379 }))
```
之后，你就可以从其他进程想任意通道emit消息
```js
var io = require('socket.io-emitter')({ host: '127.0.0.1', port: 6379 });
setInterval(function(){
  io.emit('time', new Date);
}, 5000);
```