const init = require("../init-api");

const { ApiPromise, WsProvider, Keyring } = require("@polkadot/api");
const defaultConfig = require("../default-config");

// const init = require("./init");

async function main() {
    let { api } = await init();
    console.log('end')
    await api.rpc.chain.subscribeNewHeads((lastHeader) => {
        console.log(`last block #${lastHeader.number} has hash ${lastHeader.hash}`);
    });
    // for (let url of defaultConfig.nodeURL) {
    //     let isOK = await checkWS(url);
    //     if (isOK) {
    //         console.log(url)
    //         break;
    //     }

    // }
}
main();


async function checkWS(url) {
    return new Promise(async (resolve, reject) => {
        console.log('testing', url);
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