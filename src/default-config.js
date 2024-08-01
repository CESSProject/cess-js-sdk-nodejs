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
  gatewayURL: "http://deoss-pub-gateway.cess.cloud/",
  gatewayAddr: "cXhwBytXqrZLr1qM5NHJhCzEMckSTzNKw17ci2aHft6ETSQm9"
};

// module.exports = {
//   nodeURL: [
//     'wss://devnet-rpc.cess.cloud/ws/'
//   ],
//   keyringOption: { type: "sr25519", ss58Format: 11330 },
//   gatewayURL: "http://deoss-pub-gateway.cess.cloud/",
//   gatewayAddr: "cXhwBytXqrZLr1qM5NHJhCzEMckSTzNKw17ci2aHft6ETSQm9"
// };
