#### 一个简易版的聊天室，实现群聊和私聊


基于 koa，使用 koa-socket 和 art-template

`npm i && npm start`

app._io 是 io 对象的语法糖

---

socket 和 http 最大的区别是没有 http 的请求头，即无法携带 cookie ，所以如何处理用户身份，即获取 socktid 是很关键的事



主要思路：

1、首先登录，后端采集此时用户的用户名，生成对象 mySessionStore = { username:{ } };

2、在建立起 socket 前的交互还是 http ，所以可以将登录后的 cookie 传给 html

3、html 建立 socket 时，将上一步中拿到的 username 回写给后端，让后端做 username 和 socketid 的匹配 

4、通信的方式无非就三种，公共频道通信、私聊、群聊

5、公共频道通信直接广播出来即可，私聊需要发送者的 socketid 和 对话者的 socketid ，群聊需要预先加入某个组，自定义个唯一标志，类似 socketid，群聊者的消息往这个 uid 发送，使用了通一个 uid 的用户会收到消息

6、可以进行愉快的通信了

---

页面比较简单，主要是在后端 koa 和 koa-socket 的应用