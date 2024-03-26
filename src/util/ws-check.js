const WebSocket = require("ws");

module.exports = async function main(urls) {
    for (let url of urls) {
        let isOK = await checkWS(url);
        if (isOK) {
            return url;
        }
    }
    return null;
}
async function checkWS(url) {
    return new Promise(async (resolve, reject) => {
        var websocket = new WebSocket(url);
        websocket.onopen = function () {
            console.log('websocket open');
            websocket.close();
            resolve(true);
        }
        websocket.onclose = function () {
            console.log('websocket close');
            resolve(false);
        }
        websocket.on('error', function (e) {
            console.log('ws error ', e.message);
            resolve(false);
        });

    });
}