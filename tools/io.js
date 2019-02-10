const IO = require("koa-socket");
let { mySessionStore } = require("../tools/session");

const io = new IO();
let app = undefined;

findUserBySocketId = socketId => {
    for (key in mySessionStore) {
        let obj = mySessionStore[key];
        if (obj.socketId === socketId) return key;
    }
};

io.on("connection", context => {
    // io.broadcast("allMsg", "大家好，我是服务器的消息");
});

//同步登录，处理 socketId 和 在线人数
io.on("login", context => {
    let username = context.data.username;
    let socketId = context.socket.socket.id;
    if (!socketId) {
        return;
    }
    mySessionStore[username] = {};
    mySessionStore[username].socketId = socketId;

    console.log("IO", mySessionStore);

    io.broadcast("online", mySessionStore);

    //当用户下线的时候，去除掉他的身份
    context.socket.on("disconnect", context => {
        let socketId = context.socket.socket.id;
        let username = findUserBySocketId(socketId);
        delete mySessionStore[username];

        io.broadcast("online", mySessionStore);
    });
});

// 公共频道输出
io.on("sendMsg", context => {
    let username = findUserBySocketId(context.socket.socket.id);
    io.broadcast("allMsg", `${username}说：${context.data}`);
});

// 私聊
io.on("sendPrivateMsg", context => {
    let { toId, content } = context.data;
    let username = findUserBySocketId(context.socket.socket.id);
    app._io.to(toId).emit("allMsg", `${username} say to you: ${content}`);
});

// 群聊
let group = {
    glory: "王者组",
    yys: "痒痒鼠"
};

// 加入组
io.on("groupChat", context => {
    let groupId = context.data;
    context.socket.socket.join(groupId);
});

//发送消息
io.on("sendGroupMsg", context => {
    let { groupId, content } = context.data;
    let socketId = context.socket.socket.id;
    let username = findUserBySocketId(socketId);

    app._io
        .to(groupId)
        .emit("allMsg", `来自${group[groupId]}的${username}说：${content}`);
});

module.exports = {
    io,
    //很重要，后面的 app._io 是 io 对象，要从 app.js 中拿到 app 实例过来
    getApp(a) {
        app = a;
    }
};
