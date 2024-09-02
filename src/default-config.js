/*
 * @Description: js-sdk for cess storage
 * @Autor: cess lab
 */

module.exports = {
  nodeURL: [
    'wss://testnet-rpc.cess.cloud/ws/',
    'wss://testnet-rpc.cess.network/ws/',
  ],
  keyringOption: { type: "sr25519", ss58Format: 11330 },
  gatewayURL: "https://deoss-sgp.cess.network",
  gatewayAddr: "cXjy16zpi3kFU6ThDHeTifpwHop4YjaF3EvYipTeJSbTjmayP"
};

// module.exports = {
//   nodeURL: [
//     'wss://devnet-rpc.cess.cloud/ws/'
//   ],
//   keyringOption: { type: "sr25519", ss58Format: 11330 },
//   gatewayURL: "http://192.168.110.247:8080",
//   gatewayAddr: "cXhwBytXqrZLr1qM5NHJhCzEMckSTzNKw17ci2aHft6ETSQm9"
// };
