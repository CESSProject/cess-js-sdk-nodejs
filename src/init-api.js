const { ApiPromise, WsProvider, Keyring } = require("@polkadot/api");
const defaultConfig = require("./default-config");

module.exports = async (config = defaultConfig) => {
  process.on("uncaughtException", function (err, o) {
    // console.log('uncaughtException');
    // console.log(err);
    // console.log(o);
  });
  let rpcs = config.nodeURL;
  if (!Array.isArray(config.nodeURL)) {
    rpcs = [config.nodeURL];
  }
  let res = {};
  for (let rpc of rpcs) {
    try {
      res = await connect(rpc);
      if (res.msg == 'ok') {
        break;
      }
    } catch (err) {
      console.log(err);
    }
  }
  const keyring = new Keyring(config.keyringOption);
  return { api: res.api, keyring };
}

function connect(nodeURL) {
  return new Promise(async (resolve, reject) => {
    let hasReturn = false;
    console.log('connecting', nodeURL);
    const provider = new WsProvider(nodeURL);
    const api = new ApiPromise({ provider });
    api.on("connected", () => {
      console.log("connect success ", nodeURL);
      retFun('ok');
      resolve({ msg: 'ok', api });
    });
    api.on("disconnected", () => {
      // console.log('disconnected');
      retFun('disconnected');
    });
    api.on("error", (err) => {
      // console.log('error');
      retFun(err.message);
    });
    function retFun(msg) {
      if (hasReturn) return;
      hasReturn = true;
      if (msg != 'ok') {
        provider.disconnect();
      }
      resolve({ msg, api });
    }
  });
}
