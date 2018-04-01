#socket.io 教程翻译
##开始：聊天应用
在本指南中, 我们将创建一个基本的聊天应用。它几乎不需要基本的node.js 或socket.i相关的知识, 所以它是所有知识级别的用户的理想选择。

##介绍
传统上，使用流行的Web应用程序堆栈（如LAMP，PHP）编写聊天应用程序非常困难。它涉及到轮询服务器的更改，跟踪时间戳，而且比预期慢很多。

socket一直是大多数实时聊天系统架构的解决方案，其提供了客户端与服务器之间的双向通信通道。

这意味着服务器可以将消息推送到客户端。任何时候你发出一个聊天信息，服务器将获取到它后就会把信息推送给所有其他连接的客户端。

###web框架
首先我们需要有一个简单的HTML页面，提供表单和消息列表。为此，我们将使用Node.JS Web框架。确保你已安装Node.JS。

首先让我们创建一个描述我们项目的package.json清单文件。我建议你把它放在一个专用的空目录中（我的目录是chat-example）。
```js
{
  "name": "socket-chat-example",
  "version": "0.0.1",
  "description": "my first socket.io app",
  "dependencies": {}
}
```
现在，为了方便地用我们需要的东西填充依赖关系，我们将使用npm install --save：

``npm install --save express@4.15.2``

现在, 安装完express后, 我们可以创建一个index.js文件来启动我们的应用程序。

```js
var app = require('express')();
var http = require('http').Server(app);

app.get('/', function(req, res){
  res.send('<h1>Hello world</h1>');
});

http.listen(3000, function(){
  console.log('listening on *:3000');
});
```
这将转换为以下内容:
1.Express 初始话app为一个函数处理器，你可以提供用它来提供 HTTP 服务(如2行所示)。
2.我们定义了一个路由/，当我们点击网站首页时这是函数就会被调用。
3.我们让 http 服务器监听端口3000。
如果运行节点index.js, 您应该看到以下内容:
![](https://socket.io/assets/img/chat-1.png)
如果您将浏览器指向 http://localhost:3000:

###HTML服务
到目前为止,在index.js中我们调用res.send传递一个 HTML 字符串。如果我们把整个应用程序的 HTML 放在那里, 我们的代码看起来会非常混乱。因此， 我们创建一个index.html 文件来提供html服务。

现在我们用sendFile来重构我们的路由处理器：
```js
app.get('/', function(req, res){
res.sendFile(__dirname + '/index.html');
})
```
在index.html文件中编写如下的内容：

```html
<!doctype html>
<html>
  <head>
    <title>Socket.IO chat</title>
    <style>
      * { margin: 0; padding: 0; box-sizing: border-box; }
      body { font: 13px Helvetica, Arial; }
      form { background: #000; padding: 3px; position: fixed; bottom: 0; width: 100%; }
      form input { border: 0; padding: 10px; width: 90%; margin-right: .5%; }
      form button { width: 9%; background: rgb(130, 224, 255); border: none; padding: 10px; }
      #messages { list-style-type: none; margin: 0; padding: 0; }
      #messages li { padding: 5px 10px; }
      #messages li:nth-child(odd) { background: #eee; }
    </style>
  </head>
  <body>
    <ul id="messages"></ul>
    <form action="">
      <input id="m" autocomplete="off" /><button>Send</button>
    </form>
  </body>
</html>
```
如果你现在重启服务（点击ctrl+c 然后再次运行 node index）并刷新页面，你应该看到如下页面：![](https://socket.io/assets/img/chat-3.png)

###集成Socket.IO
Socket.IO由两部分组成：
*集成或则安装在Node.JS http服务上的：socket.io
*通过浏览器端加载的客服端库：socket.io-client

在开发过程中, socket.io 为我们自动扮演客服端的角色, 所以现在我们只需要安装一个模块：
`npm install --save socket.io`
上面的语句将安装模块并把依赖项添加到package.json中。现在我们编辑index.js 添加相应的功能:

```js
var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);

app.get('/', function(req, res){
  res.sendFile(__dirname + '/index.html');
});

io.on('connection', function(socket){
  console.log('a user connected');
});

http.listen(3000, function(){
  console.log('listening on *:3000');
});
```
请注意，我通过传递http（HTTP服务器）对象来初始化一个新的socket.io实例。然后我监听传入sockets的连接事件，并将其输出到控制台。

现在在index.html文件的<body>标签前面添加如下片段：
```js
<script src="/socket.io/socket.io.js"></script>
<script>
  var socket = io();
</script>
```
这就是加载socket.io-client所需要的全部工作，它暴露了一个全局io对象，然后连接。

请注意我并有没有给出调用io的url，因为，它默认连接到当前页面的主机地址。

如果你现在重新加载服务和网站，你可以在控制台中打印出"a user connected"

尝试着多打开几个tab页面，然后你会看到几条消息：
![](https://socket.io/assets/img/chat-4.png)

每一个socket连接都会触发一个特殊的disconnect事件：
```js
io.on('connection', function(socket){
  console.log('a user connected');
  socket.on('disconnect', function(){
    console.log('user disconnected');
  });
})
```
接下来，尝试刷新几遍页面，你将看到下面的结果：
![](https://socket.io/assets/img/chat-5.png)

###发送事件
Socke.IO的主要思想是你可以发送和接收你想要的任何事件，使用任何你想要的数据。任何对象都可以用JSON进行编码，同样支持二进制数据：

```html
<script src="/socket.io/socket.io.js"></script>
<script src="https://code.jquery.com/jquery-1.11.1.js"></script>
<script>
  $(function () {
    var socket = io();
    $('form').submit(function(){
      socket.emit('chat message', $('#m').val());
      $('#m').val('');
      return false;
    });
  });
</script>
```

接下来在index.js文件中，我们打印出chat message 事件：
```js
io.on('connection', function(socket){
  socket.on('chat message', function(msg){
    console.log('message: ' + msg);
  });
});
```

效果如下面的视频所示：贴出地址:(https://i.cloudup.com/transcoded/zboNrGSsai.mp4)
好像我打不开

###广播
下一步我们的目标是将事件从服务器发送到用户。
为了将事件发送到每一个用户，Socket.IO给我们提供了io.emit:
`io.emit('some event', { for: 'everyone' });`
如果你想发送一个消息给除了特定socket以外的每个人，我们有广播标志：
```js
io.on('connection', function(socket){
  socket.broadcast.emit('hi');
});
```
在这种情况下，为了简单起见，我们会将信息发送给每个人，包括发信人。

```js
io.on('connection', function(socket){
  socket.on('chat message', function(msg){
    io.emit('chat message', msg);
  });
});
```
在客户端，当我们捕获聊天消息事件时，我们会将其包含在页面中。总的客户端JavaScript代码如下：
```html
<script>
  $(function () {
    var socket = io();
    $('form').submit(function(){
      socket.emit('chat message', $('#m').val());
      $('#m').val('');
      return false;
    });
    socket.on('chat message', function(msg){
      $('#messages').append($('<li>').text(msg));
    });
  });
</script>
```
这就完成了我们的聊天应用程序，大约有20行代码！这是它的样子：
(https://i.cloudup.com/transcoded/J4xwRU9DRn.mp4)

###作业
以下是改进应用程序的一些建议：
*当有人连接或断开连接时，将消息广播给连接的用户
*添加对昵称的支持
*不要将相同的消息发送给自己发送的用户。相反，只要他按下输入，就直接追加消息。 
*添加“{user}正在输入”功能
*显示谁在线
*添加私人消息
*分享您的改进！

获得这个例子
你可以在GitHub上找到它。
`$ git clone https://github.com/socketio/chat-example.git`




