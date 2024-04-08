const wellKnownAcct = {
  addr: "cXgaee2N8E77JJv9gdsGAckv1Qsf3hqWYf7NL4q6ZuQzuAUtB",
  mnemonic: "bottom drive obey lake curtain smoke basket hold race lonely fit walk",
  gatewayAddr: "cXhwBytXqrZLr1qM5NHJhCzEMckSTzNKw17ci2aHft6ETSQm9",
};
const testnetConfig = {
  nodeURL: [
    'wss://testnet-rpc1.cess.cloud/ws/',
    'wss://testnet-rpc0.cess.cloud/ws/',
    'wss://testnet-rpc2.cess.cloud/ws/',
    'wss://testnet-rpc3.cess.cloud/ws/',
  ],
  keyringOption: { type: "sr25519", ss58Format: 11330 },
  gatewayURL: "http://deoss-pub-gateway.cess.cloud/",
  gatewayAddr: "cXhwBytXqrZLr1qM5NHJhCzEMckSTzNKw17ci2aHft6ETSQm9",
};
module.exports = {
  testnetConfig,
  wellKnownAcct,
};
