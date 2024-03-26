const WebSocket = require("ws");

module.exports = async function main(urls) {
    return new Promise(async (resolve, reject) => {
        for (let url of urls) {
            checkWS(url).then(isOK => {
                if (isOK) {
                    resolve(url);
                }
            });
        }
    });
}
async function checkWS(url) {
    return new Promise(async (resolve, reject) => {
        console.log('connecting ', url);
        const websocket = new WebSocket(url);
        websocket.onopen = function () {
            console.log("connect success ", url);
            websocket.close();
            resolve(true);
        }
        websocket.onclose = function () {
            // console.log('websocket close');
            resolve(false);
        }
        websocket.error = function () {
            // console.log('ws error ', e.message);
            resolve(false);
        }
    });
}