const wellKnownAcct = {
  addr: "cXgaee2N8E77JJv9gdsGAckv1Qsf3hqWYf7NL4q6ZuQzuAUtB",
  mnemonic: "bottom drive obey lake curtain smoke basket hold race lonely fit walk",
  gatewayAddr: "cXfM5T1ogmGgrgYs12HCVzK8P4HZV9chxrgoMymBx4GNNmdAs",
};
const testnetConfig = {
  nodeURL: [
    'wss://testnet-rpc1.cess.cloud/ws/',
    'wss://testnet-rpc0.cess.cloud/ws/',
    'wss://testnet-rpc2.cess.cloud/ws/',
    'wss://testnet-rpc3.cess.cloud/ws/',
  ],
  keyringOption: { type: "sr25519", ss58Format: 11330 },
  gatewayURL: "http://dev-deoss-pub-gateway.cess.cloud",//"http://213.199.33.1:8192/chunks",//"https://dev-deoss-pub-gateway.cess.cloud/",
  gatewayAddr: "cXf2xaU1RiJUhpPc471PxWknFx3mqf5opV6VTEQ4oYohWLZib",//"cXfM5T1ogmGgrgYs12HCVzK8P4HZV9chxrgoMymBx4GNNmdAs"//"cXf2xaU1RiJUhpPc471PxWknFx3mqf5opV6VTEQ4oYohWLZib",
};
module.exports = {
  testnetConfig,
  wellKnownAcct,
};
