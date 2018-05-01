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

new Server(options)
*options(对象)

点这里查看更多可用[选项](https://socket.io/docs/server-api/#new-server-httpserver-options)

```js
const io = require('socket.io')({
  path: '/test',
  serveClient: false,
});

// either
const server = require('http').createServer();

io.attach(server, {
  pingInterval: 10000,
  pingTimeout: 5000,
  cookie: false
});

server.listen(3000);

// or
io.attach(3000, {
  pingInterval: 10000,
  pingTimeout: 5000,
  cookie: false
});
```

server.sockets
* (命名空间)
默认命名空间为(/)

server.serveClient([value])
* value (Boolean)
* Returns Server|Boolean

如果value为true，则连接的服务器（请参阅Server#attach）将为客户端文件提供服务。默认为true。调用attach后，此方法无效。如果未提供参数，则此方法返回当前值。

```js
// pass a server and the `serveClient` option
const io = require('socket.io')(http, { serveClient: false });

// or pass no server and then you can call the method
const io = require('socket.io')();
io.serveClient(false);
io.attach(http);
```

server.path([value])
* value (String)
* Returns Server|String

设置engine.io和静态文件将被提供的路径值。默认为/socket.io。如果未提供参数，则此方法返回当前值。

```js
const io = require('socket.io')();
io.path('/myownpath');

// client-side
const socket = io({
  path: '/myownpath'
});
```

server.adapter([value])
* value (Adapter)
* Returns Server|Adapter

设置适配器值。默认为基于内存的socket.io附带的Adapter实例。请参阅[socket.io-adapter](https://github.com/socketio/socket.io-adapter)。如果未提供参数，则此方法返回当前值。
```js
const io = require('socket.io')(3000);
const redis = require('socket.io-redis');
io.adapter(redis({ host: 'localhost', port: 6379 }));
```

server.origins([value])
* value (String)
* Returns Server|String
设置允许的来源值。默认允许任何来源。如果未提供参数，则此方法返回当前值。
```js
io.origins(['foo.example.com:443']);
```

server.origins(fn)
* fn (Function)
* Returns Server
提供一个带有两个参数的函数origin：String和callback（error，success），其中success是一个布尔值，指示源是否被允许。

潜在的缺点：
* 在某些情况下，当无法确定原点时，它可能具有\* 的值。
* 由于该函数将针对每个请求执行，因此建议使该函数的运行速度尽可能快些。
* 如果将socket.io与Express，CORS头文件只会受到socket.io请求的影响。对于Express可以使用cors。

```js
io.origins((origin, callback) => {
  if (origin !== 'https://foo.example.com') {
    return callback('origin not allowed', false);
  }
  callback(null, true);
});
```

server.attach(httpServer[, options])
* httpServer (http.Server) 要附加到的服务器
* options (Object)
使用提供的选项（可选）将服务器连接到httpServer上的engine.io实例（可选）。

server.attach(port[, options])
* port (Number) 要监听的端口
* options (Object)

使用提供的选项（可选）将服务器连接到新的http.Server上的engine.io实例（可选）。

server.listen(httpServer[, options])
server.attach(httpServer [, options])的同义词。

server.listen(port[, options])
server.attach(port[, options])的同义词。

server.bind(engine)
* engine (engine.Server)
* Returns Server

仅限高级使用。将服务器绑定到特定的engine.io服务器（或兼容的API）实例。

server.onconnection(socket)
* socket (engine.Socket)
* Returns Server

仅限高级使用。从传入的engine.io（或兼容的API）套接字创建一个新的socket.io客户端。

server.of(nsp)
* (nsp (String)
* Returns Namespace
通过路径名标识符nsp初始化并检索给定的命名空间。如果命名空间已经初始化，它会立即返回。
```js
const adminNamespace = io.of('/admin');
```

server.close([callback])
* callback (Function)
关闭socket.io服务器。回调参数是可选的，并且将在所有连接关闭时调用。
```js
const Server = require('socket.io');
const PORT   = 3030;
const server = require('http').Server();

const io = Server(PORT);

io.close(); // Close current server

server.listen(PORT); // PORT is free to use

io = Server(server);
```

server.engine.generated
覆盖默认方法以生成您的自定义的socket.id。

该函数使用节点请求对象(http.IncomingMessage)作为第一个参数进行调用。
```js
io.engine.generateId = (req) => {
  return "custom:id:" + custom_id++; // custom id must be unique
}
```

##命名空间
表示在由路径名标识的给定范围下连接的socket池（例如：/ chat）。

客户端总是连接到/（主命名空间），然后可能连接到其他命名空间（同时使用相同的底层连接）。

namespace.name
* (String)

名称空间标识符属性。

namespace.connected
* (Object<Socket>)

连接到此名称空间的Socket对象的哈希值，由id索引。

namespace.adapter
* (Adapter)

用于命名空间的适配器。使用基于[Redis](https://github.com/socketio/socket.io-redis)的适配器时很有用，因为它提供了管理集群socket和rooms的方法。

注意：主名称空间的适配器可以通过io.of('/').adapter进行访问。

namespace.to(room)
* room (String)
* Returns Namespace for chaining

为后续事件发送设置一个修饰符，该事件将只广播给已加入给定房间的客户端。

要发送到多个房间，您可以多次调用to。
```js
const io = require('socket.io')();
const adminNamespace = io.of('/admin');

adminNamespace.to('level1').emit('an event', { some: 'data' });
```

namespace.in(room)
namespace.to(room)的同义词。

namespace.emit(eventName[, ...args])
* eventName (String)
* args
向所有连接的客户端发出事件。以下两种写法是等效的：
```js
const io = require('socket.io')();
io.emit('an event sent to all connected clients'); // main namespace

const chat = io.of('/chat');
chat.emit('an event sent to all connected clients in chat namespace');
```

注意：从命名空间发出时不支持确认。

namespace.clients(callback)
* callback (Function)
获取连接到此名称空间的客户端ID列表（如果适用，则跨所有节点）。
```js
const io = require('socket.io')();
io.of('/chat').clients((error, clients) => {
  if (error) throw error;
  console.log(clients); // => [PZDoMHjiu8PYfRiKAAAF, Anw2LatarvGVVXEIAAAD]
});
```
获得命名空间中的所有客户端的一个例子：
```js
io.of('/chat').in('general').clients((error, clients) => {
  if (error) throw error;
  console.log(clients); // => [Anw2LatarvGVVXEIAAAD]
});
```

namespace.use(fn)
* fn (Function)
注册一个中间件，每传入一个Socket时都会执行该函数，并接收作为参数的套接字和一个函数，以便将执行延迟到下一个注册的中间件。

传递给中间件回调的错误将作为特殊错误数据包发送给客户端。
```js
io.use((socket, next) => {
  if (socket.request.headers.cookie) return next();
  next(new Error('Authentication error'));
});
```

Event: 'connect'
* socket (Socket) 与客服端的socket连接

当有来自客户端的连接时触发。
```js
io.on('connect', (socket) => {
  // ...
});

io.of('/admin').on('connect', (socket) => {
  // ...
});
```

Event: 'connection'
Event: 'connect'的同义词

标志：'volatile'
为后续事件发射设置一个修饰符，如果客户端不准备接收消息，则可能会丢失事件数据（由于网络缓慢或其他问题，或者因为它们通过长轮询连接并且处于请求-响应周期中）。

```js
io.volatile.emit('an event', { some: 'data' }); //客户端可能也可能接收不到信息
```

标志：'local'
为后续事件发射设置一个修饰符，该事件数据只会广播到当前节点（使用Redis适配器时）。

##Socket
Socket是与浏览器客户端交互的基础类。一个Socket属于某个命名空间（默认为/），并使用一个底层客户端进行通信。

应该注意的是，Socket并不直接与实际的底层TCP/IP socket相关，而只是该类的名称。

在每个名字空间内，你还可以定义Socket可以加入和离开的任意通道（称为空间）。这提供了一种方便的方式来广播到一组socket（请参阅下面的Socket）。

Socket类继承自EventEmitter。 Socket类覆盖emit方法，并且不修改任何其他EventEmitter方法。此处记录的所有方法也为由EventEmitter实现的方法（除emit之外），并且适用于EventEmitter的文档。

socket.id
* (String)
会话的唯一标识符，来自底层客户端。

socket.rooms
* (Object)
标识客户所在房间的字符串散列，按房间名称索引。
```js
io.on('connection', (socket) => {
  socket.join('room 237', () => {
    let rooms = Object.keys(socket.rooms);
    console.log(rooms); // [ <socket.id>, 'room 237' ]
  });
});
```

socket.client
* (Client)
底层Client对象的引用。

socket.conn
* (engine.Socket)
对底层客户端传输连接（engine.io Socket对象）的引用。这允许访问IO传输层，大多数情况它仍然是抽象出的TCP/IP socket连接。

socket.request
* (Request)
一个getter代理，用于返回发起底层engine.io客户端的请求的引用。用于访问Cookie或User-Agent等请求标头。

socket.handshake
*(Object)

握手细节：
```js
{
  headers: /* 握手部分的头 */,
  time: /* 创建时间 (字符串) */,
  address: /* 客户端ip地址 */,
  xdomain: /* 连接是否跨域 */,
  secure: /* 连接是否安全 */,
  issued: /* 创建数据 (unix 时间戳) */,
  url: /* 请求url地址 */,
  query: /* 询问对象 */
}
```

用法：
```js
io.use((socket, next) => {
  let handshake = socket.handshake;
  // ...
});

io.on('connection', (socket) => {
  let handshake = socket.handshake;
  // ...
});
```

socket.use(fn)
* fn (Function)
注册一个中间件，这是一个当每传入数据包时执行的函数，其接收数据包的参数和一个函数，选择性地延迟执行到下一个注册的中间件。

传递给中间件回调的错误将作为特殊错误数据包发送给客户端。
```js
io.on('connection', (socket) => {
  socket.use((packet, next) => {
    if (packet.doge === true) return next();
    next(new Error('Not a doge error'));
  });
});
```

socket.send([...args][, ack])
* args
* ack (Function)
* 送消息事件。请参阅[socket.emit(eventName [,... args] [,ack])](https://socket.io/docs/server-api/#socketemiteventname-args-ack)。

socket.emit(eventName[, ...args][, ack])
(overrides EventEmitter.emit)

* eventName (String)
* args
* ack (Function)
* Returns Socket
向由字符串名称标识的套接字发出事件。任何其他参数都可以包含在内。所有可序列化的数据结构都受支持，包括Buffer。
```js
socket.emit('hello', 'world');
socket.emit('with-binary', 1, '2', { 3: '4', 5: new Buffer(6) });
```

ack参数是可选的，并且将与客户的答案一起被调用。
```js
io.on('connection', (socket) => {
  socket.emit('an event', { some: 'data' });

  socket.emit('ferret', 'tobi', (data) => {
    console.log(data); // data will be 'woot'
  });

  // the client code
  // client.on('ferret', (name, fn) => {
  //   fn('woot');
  // });

});
```

socket.on(eventName, callback)
(inherited from EventEmitter)

* eventName (String)
* callback (Function)
* Returns Socket
为给定事件注册一个新的处理程序。

```js
socket.on('news', (data) => {
  console.log(data);
});
// with several arguments
socket.on('news', (arg1, arg2, arg3) => {
  // ...
});
// or with acknowledgement
socket.on('news', (data, callback) => {
  callback(0);
});
```

socket.once(eventName, listener)

socket.removeListener(eventName, listener)

socket.removeAllListeners([eventName])

socket.eventNames()
继承自EventEmitter（以及此处未提及的其他方法）。请参阅events模块的Node.js文档。

socket.join(room[, callback])
* room (String)
* callback (Function)
* Returns Socket for chaining

将客户端添加到房间，并可选择触发具有err签名的回调（如果有的话）。
```js
io.on('connection', (socket) => {
  socket.join('room 237', () => {
    let rooms = Objects.keys(socket.rooms);
    console.log(rooms); // [ <socket.id>, 'room 237' ]
    io.to('room 237', 'a new user has joined the room'); // 广播到房间中的每个人
  });
});
```

连接房间的机制由已配置的适配器处理（请参阅上面的Server#adapter），默认为[socket.io-adapter](https://github.com/socketio/socket.io-adapter)。

```js
io.on('connection', (socket) => {
  socket.on('say to someone', (id, msg) => {
    // send a private message to the socket with the given id
    socket.to(id).emit('my message', msg);
  });
});
```

socket.join(rooms[, callback])
* rooms (Array)
* callback (Function)
* Returns Socket for chaining

将客户端添加到房间列表中，并可选择触发带有err签名的回调（如果有）。

socket.leave(room[, callback])
* room (String)
* callback (Function)
* Returns Socket for chaining
从房间中删除客户端，并可选择触发err签名（如果有）。

**断开后会自动离开房间**

socket.to(room)
* room (String)
为后续事件发射设置一个修饰符，该事件将仅播放给已加入给定房间的客户端（socket本身被排除）。

要发送到多个房间，您可以多次调用to。

```js
io.on('connection', (socket) => {
  // to one room
  socket.to('others').emit('an event', { some: 'data' });
  // to multiple rooms
  socket.to('room1').to('room2').emit('hello');
  // a private message to another socket
  socket.to(/* another socket id */).emit('hey');
});
```

注意：广播时不支持确认。

socket.in(room)
Synonym of socket.to(room).

socket.compress(value)
* value (Boolean) whether to following packet will be compressed
* Returns Socket for chaining
为后续事件发射设置修饰符，该事件数据只有在值为true时才会被压缩。当您不调用该方法时，默认为true。

```js
io.on('connection', (socket) => {
  socket.compress(false).emit('uncompressed', "that's rough");
});
```

socket.disconnect(close)
* close (Boolean) whether to close the underlying connection
* Returns Socket

断开这个客户端。如果close值为true，则关闭底层连接。否则，它只是断开命名空间。

```js
io.on('connection', (socket) => {
  setTimeout(() => socket.disconnect(true), 5000);
});
```

Flag: 'broadcast'
为后续事件发射设置修饰符，以便事件数据会发送给除发送者以外的每个socket。
```js
io.on('connection', (socket) => {
  socket.broadcast.emit('an event', { some: 'data' }); // everyone gets it but the sender
});
```

Flag: 'volatile'
为后续事件发射设置修饰符，以防事件数据在客户端未准备好接收消息时丢失（由于网络缓慢或其他问题，或者由于它们通过长轮询进行连接并处于请求-响应周期中）。
```js
io.on('connection', (socket) => {
  socket.volatile.emit('an event', { some: 'data' }); // the client may or may not receive it
});
```

Event: 'disconnect'
* reason (String) 断开连接的原因 (客户端或服务器端)

当断开连接时触发
```js
io.on('connection', (socket) => {
  socket.on('disconnect', (reason) => {
    // ...
  });
});
```

Event: 'error'
* error (Object) error object
当错误发生时触发
```js
io.on('connection', (socket) => {
  socket.on('error', (error) => {
    // ...
  });
});
```

Event: 'disconnecting'
 * reason（String）断开原因（客户端或服务器端）

当客户端断开连接时（但尚未离开客房）会被触发。

```js
io.on('connection', (socket) => {
  socket.on('disconnecting', (reason) => {
    let rooms = Object.keys(socket.rooms);
    // ...
  });
});
```

这些是不能用作事件名称的保留事件（例如connect，newListener和removeListener）。

##Client
客户端类表示传入的传输（engine.io）连接。客户端可以与许多属于不同命名空间的多路复用socket相关联。

client.conn
 * (engine.Socket)
引用底层的engine.io Socket连接。

client.request
 * (Request)
一个getter代理，用于将引用返回给由engine.io连接而发起的请求。用于访问Cookie或User-Agent等请求头。

*由于我也是第一次使用socket.io，其中也肯定有许多不准确的地方，如果发现的话，欢迎留言告知*

*现在基本上只是找个英文文档原模原样的翻译，后面打算自己写一个socket应用，再写一份自己的日志*