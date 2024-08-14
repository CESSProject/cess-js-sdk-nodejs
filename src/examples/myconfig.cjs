const wellKnownAcct = {
  addr: "cXgaee2N8E77JJv9gdsGAckv1Qsf3hqWYf7NL4q6ZuQzuAUtB",
  mnemonic: "bottom drive obey lake curtain smoke basket hold race lonely fit walk",
  gatewayAddr: "cXjy16zpi3kFU6ThDHeTifpwHop4YjaF3EvYipTeJSbTjmayP",
};
const testnetConfig = {
  nodeURL: [
    'wss://testnet-rpc.cess.cloud/ws/',
    'wss://testnet-rpc.cess.network/ws/',
  ],
  keyringOption: { type: "sr25519", ss58Format: 11330 },
  gatewayURL: "https://deoss-sv.cess.network",//"http://213.199.33.1:8192/chunks",//"https://dev-deoss-pub-gateway.cess.cloud/",
};
module.exports = {
  testnetConfig,
  wellKnownAcct,
};
