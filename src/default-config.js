/*
 * @Description: js-sdk for cess storage
 * @Autor: cess lab
 */

// module.exports = {
//   nodeURL: [
//     'wss://testnet-rpc0.cess.cloud/ws/',
//     'wss://testnet-rpc1.cess.cloud/ws/',
//     'wss://testnet-rpc2.cess.cloud/ws/',
//     'wss://testnet-rpc3.cess.cloud/ws/',
//   ],
//   keyringOption: { type: "sr25519", ss58Format: 11330 },
//   gatewayURL: "http://deoss-pub-gateway.cess.cloud/",
//   gatewayAddr: "cXhwBytXqrZLr1qM5NHJhCzEMckSTzNKw17ci2aHft6ETSQm9"
// };

module.exports = {
  nodeURL: [
    'wss://devnet-rpc.cess.cloud/ws/'
  ],
  keyringOption: { type: "sr25519", ss58Format: 11330 },
  gatewayURL: "http://deoss-pub-gateway.cess.cloud/",
  gatewayAddr: "cXhwBytXqrZLr1qM5NHJhCzEMckSTzNKw17ci2aHft6ETSQm9"
};
