socket.on("allMsg", data => {
    var ul = document.querySelector("ul");
    var li = document.createElement("li");
    li.innerHTML = data;
    ul.append(li);
});

socket.on("online", data => {
    var number = document.querySelector('#online')
    var arr = Object.keys(data)
    number.innerHTML = arr.length

    var select = document.querySelector("#towho");
    var HTML;
    for (i in data) {
        HTML += `
            <option value=${data[i].socketId}>
                ${i}
            </option>
        `;
    }
    select.innerHTML = HTML;
});
