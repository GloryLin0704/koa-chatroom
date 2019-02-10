document.querySelector("#btn").onclick = function() {
    var content = document.querySelector("#newContent").value;
    socket.emit("sendMsg", content);
};

document.querySelector("#sendPrivateMsg").onclick = function() {
    var socketid = document.querySelector("#towho").value;
    var privateMsg = document.querySelector("#privateMsg").value;

    var data = {
        toId: socketid,
        content: privateMsg
    };

    socket.emit("sendPrivateMsg", data);
};

var groupId = undefined;

document.querySelector("#glory").onclick = function() {
    socket.emit("groupChat", "glory");
    groupId = "glory";
};

document.querySelector("#yys").onclick = function() {
    socket.emit("groupChat", "yys");
    groupId = "yys";
};

document.querySelector("#sendGroupMsg").onclick = function() {
    var content = document.querySelector("#groupMsg").value;
    socket.emit("sendGroupMsg", { content, groupId });
};
