#socket.io官方文档翻译
##概述
##如何使用
###安装
`$ npm install socket.io`
###在node http服务器上使用
server(app.js)
```js
var app = require('http').createServer(handler)
var io = require('socket.io')(app);
var fs = require('fs');

app.listen(80);

function handler (req, res) {
  fs.readFile(__dirname + '/index.html',
  function (err, data) {
    if (err) {
      res.writeHead(500);
      return res.end('Error loading index.html');
    }

    res.writeHead(200);
    res.end(data);
  });
}

io.on('connection', function (socket) {
  socket.emit('news', { hello: 'world' });
  socket.on('my other event', function (data) {
    console.log(data);
  });
});
```

client(index.html)
```html
<script src="/socket.io/socket.io.js"></script>
<script>
  var socket = io('http://localhost');
  socket.on('news', function (data) {
    console.log(data);
    socket.emit('my other event', { my: 'data' });
  });
</script>
```

###在express3/4上使用
server(app.js)
```js
var app = require('express')();
var server = require('http').Server(app);
var io = require('socket.io')(server);

server.listen(80);

app.get('/', function (req, res) {
  res.sendfile(__dirname + '/index.html');
});

io.on('connection', function (socket) {
  socket.emit('news', { hello: 'world' });
  socket.on('my other event', function (data) {
    console.log(data);
  });
});
```

client(html)
```html
<script src="/socket.io/socket.io.js"></script>
<script>
  var socket = io.connect('http://localhost');
  socket.on('news', function (data) {
    console.log(data);
    socket.emit('my other event', { my: 'data' });
  });
</script>
```

###在express2.x上使用
server(app.js)
```js
var app = require('express').createServer();
var io = require('socket.io')(app);

app.listen(80);

app.get('/', function (req, res) {
  res.sendFile(__dirname + '/index.html');
});

io.on('connection', function (socket) {
  socket.emit('news', { hello: 'world' });
  socket.on('my other event', function (data) {
    console.log(data);
  });
});
```

###发送和接收事件
Socket.IO允许您发送和接收自定义事件。除了connect，message和disconnect，您都可以发出其他自定义事件：

server
```js
// note, io(<port>) will create a http server for you
// 注意，io(<port>)这种写法会为你创建一个http服务
var io = require('socket.io')(80);

io.on('connection', function (socket) {
  io.emit('this', { will: 'be received by everyone'});

  socket.on('private message', function (from, msg) {
    console.log('I received a private message by ', from, ' saying ', msg);
  });

  socket.on('disconnect', function () {
    io.emit('user disconnected');
  });
});
```

###限定自己的命名空间
如果您可以控制特定应用程序发出的所有消息和事件，则使用默认/命名空间即可。如果你想利用第三方代码，或者把自己的代码与他人共享，socket.io提供了一种命名空间方法。

这样做的好处是multiplexing(复用)单个连接。而不是使用两个WebSocket连接的socket.io，它只使用一个。

server(app.js)
```js
var io = require('socket.io')(80);
var chat = io
  .of('/chat')
  .on('connection', function (socket) {
    socket.emit('a message', {
        that: 'only'
      , '/chat': 'will get'
    });
    chat.emit('a message', {
        everyone: 'in'
      , '/chat': 'will get'
    });
  });

var news = io
  .of('/news')
  .on('connection', function (socket) {
    socket.emit('item', { news: 'item' });
  });
```
client(index.html)
```html
<script>
  var chat = io.connect('http://localhost/chat')
    , news = io.connect('http://localhost/news');
  
  chat.on('connect', function () {
    chat.emit('hi!');
  });
  
  news.on('news', function () {
    news.emit('woot');
  });
</script>
```

###发送可失效消息
有时某些消息可能会丢失。现在我们假设您要做一款显示关键字“bieber”的实时推送应用程序。

如果某个客户端没有准备好接收消息（由于网络缓慢或其他问题，或者因为它们通过长轮询连接并处于请求 - 响应周期的中间），所以如果它没有收到所有与bieber相关的消息，应用程序可以不受影响。

在这种情况下，您可能希望将这些消息作为可失效性消息发送。

server
```js
var io = require('socket.io')(80);

io.on('connection', function (socket) {
  var tweets = setInterval(function () {
    getBieberTweet(function (tweet) {
      socket.volatile.emit('bieber tweet', tweet);
    });
  }, 100);

  socket.on('disconnect', function () {
    clearInterval(tweets);
  });
});
```

###发送和接收数据（确认）
有时，您可能想得到在客户端收到信息后发出的一个反馈。

要做到这一点，只需传递一个函数作为.send或.emit的最后一个参数即可。更重要的是，当您使用.emit时，确认由您完成，这意味着您也可以传递数据：

server(app.js)
```js
var io = require('socket.io')(80);

io.on('connection', function (socket) {
  socket.on('ferret', function (name, fn) {
    fn('woot');
  });
});
```
client(index.html)
```html
<script>
  var socket = io(); // TIP: io() with no args does auto-discovery
  socket.on('connect', function () { // TIP: you can avoid listening on `connect` and listen on events directly too!
    socket.emit('ferret', 'tobi', function (data) {
      console.log(data); // data will be 'woot'
    });
  });
</script>
```

###广播消息
要进行广播，只需添加一个广播标志来调用emit和send方法即可。广播意味着将消息发送给除启动socket以外的其他人。

server
```js
var io = require('socket.io')(80);

io.on('connection', function (socket) {
  socket.broadcast.emit('user connected');
});
```

###将其用作跨浏览器的WebSocket
server(app.js)
```js
var io = require('socket.io')(80);

io.on('connection', function (socket) {
  socket.on('message', function () { });
  socket.on('disconnect', function () { });
});
```

client(index.html)
```html
<script>
  var socket = io('http://localhost/');
  socket.on('connect', function () {
    socket.send('hi');

    socket.on('message', function (msg) {
      // my msg
    });
  });
</script>
```

如果您不关心重新连接逻辑等，请查看[Engine.IO](https://github.com/socketio/engine.io)，它是Socket.IO使用的WebSocket语义传输层。