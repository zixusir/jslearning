#实现注册登陆登出功能
##1. 开发注册登陆页面
1.1 建立一个名为userData的mysql数据库
>mysql操作
登陆：>mysql -u root -p

>准备直接使用mysql的query操作数据库，
_问题：目前通过root账户无密码接入，存在安全隐患，后期需要更改用户_

1.2 编写配置文件config

1.3 _编写前端页面_
1.3.1 登陆
  通过POST提交username,password, 查询mysql数据库，如果找到用户则登陆，否则退回登陆页面signin.html
  登陆以后写cookie和session
  

1.3.2 注册
  通过POST提交username,password, 前端页面完成对pwd1===pwd2的验证。后端通过mysql语句将用户信息插入数据表userp,成功定向registerok.html,失败后返回signin.html
  注册以后自动登陆

_问题：目前暂时没有考虑断线重连mysql的问题_        ctx.session.username = null

**现在卡在如何判断mysql语句是否执行成功上**
找到了如何判断mysql执行状态的方法，主要问题还是在于nodejs的异步机制，以致query执行完毕以后，ctx已经返回，因此需要一个await.
_需要深入了解nodejs的步机制，async与await搭配使用的方法_

>>注意：The values in the INSERT INTO query must be enclosed with single quotes ' not backticks and not a mixture of both. Backticks can only be used on the field and table name.使用mysql的query语句必须以单引号结尾，否则报错！！！并且只能有一对单引号，否则仍然报错！！

>>mysql操作的异步逻辑简直就是一个大坑！

>>有了一种思路，首先封装mysql的操作，再用async,await的写法进行数据库操作。

1.4 登陆状态的保持
需要的中间件
koa 是一个中间件框架，本身并不能处理 session，在 koa 中处理 session 需要其他中间件的支持。本文用 koa-session-minimal 做 session 处理的中间件，其他处理 session 的中间件大同小异。
>>请记住我，浏览器cookie目前暂且没有设置！！现在每次打开网页需要重新登陆！

##2开发消息页面
2.1开发消息前端页面
需要消息窗口，用户信息窗口，用户列表窗口，用户输入窗口
2.2开发消息后端程序
>>对于this指针的具体对象仍然存在很大的疑问？？？
[理解this对箭头函数和普通函数的区别](http://es6.ruanyifeng.com/#docs/function#%E7%AE%AD%E5%A4%B4%E5%87%BD%E6%95%B0)
websocket 的具体运作方式是什么
每一次访问都记录了ctx.server = server这显然不太好
2.3 基于vue开法消息前端程序
>>问题：什么是preventDefault()
vue的使用导致dom 的点击事件无法进入
[保持聊天是scroll总是在最底部的方法](https://segmentfault.com/q/1010000005060643)

2.4 我觉得需要自己总结一下webSocket的相关东西，这个还是很陌生，现在仅仅简单会用一点功能。
https://segmentfault.com/a/1190000011538416

2.5开发进行到今天，我准备换用socket.io重新尝试，也不是因为啥，主要是我刚刚认认真真读了socket.io的文档，或许比起ws来我更能操作些。