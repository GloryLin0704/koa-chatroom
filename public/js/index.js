// 封装的 Ajax
const $ = {};

const Ajax = (TYPE, URL, DATA, callback) => {
    let xhr = new XMLHttpRequest();

    xhr.open(TYPE, URL);

    xhr.send(DATA);

    xhr.onreadystatechange = function() {
        if (xhr.status === 200 && xhr.readyState === 4) {
            callback(xhr.responseText);
            return;
        }
    };
};


module.exports = Ajax;
