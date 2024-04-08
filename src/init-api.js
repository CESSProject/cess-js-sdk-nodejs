const { ApiPromise, WsProvider, Keyring } = require("@polkadot/api");
const defaultConfig = require("./default-config");

module.exports = async (config = defaultConfig) => {
  process.on("uncaughtException", function (err) {
    // console.log('uncaughtException');
    console.error(err);
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
  return new Promise((resolve, reject) => {
    console.log('connecting', nodeURL);
    const provider = new WsProvider(nodeURL);
    const api = new ApiPromise({ provider });
    api.on("connected", async() => {
      console.log("connect success ", nodeURL);
      await api.isReady;
      resolve({ msg: 'ok', api });
    });
    api.on("disconnected", () => {
      provider.disconnect();
      resolve({ msg: 'disconnected' });
    });
    api.on("error", (err) => {
      provider.disconnect();
      resolve({ msg: err.message });
    });
  });
}
