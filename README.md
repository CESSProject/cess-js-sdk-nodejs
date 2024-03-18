# cess-js-sdk-nodejs

## About

JS-SDK for Cess Project with file storage.

Supports CommonJS and ES Module import type.

Support usage in both node.js and browsers. If used in browser, please install the [Polkadot.js extension](https://polkadot.js.org/extension/) in the browser.

## Installation

```bash
# npm
npm i cess-js-sdk-nodejs --save
# yarn
yarn add cess-js-sdk-nodejs -S
# pnpm
pnpm add cess-js-sdk-nodejs
```

## Example

```ts
const { Space, InitAPI, Common, testnetConfig, wellKnownAcct } = require("cess-js-sdk-nodejs");

async function main() {
  const { api, keyring } = await InitAPI(testnetConfig);
  const { addr, mnemonicOrAccountId32 } = wellKnownAcct;

  const space = new Space(api, keyring);
  /*
    const bucket = new Bucket(api, keyring, true);
    const space2 = new Space2(api, keyring, true);
    const authorizeHandle = new Authorize(api, keyring, true);
    const fileHandle = new File(
      api,
      keyring,
      config.gatewayURL,
      true
    );
  */
  const common = new Common(api, keyring);

  console.log("query userOwnedSpace:");
  let result = await space.userOwnedSpace(addr);
  const blockHeight = await common.queryBlockHeight();

  result = common.formatSpaceInfo(result.data, blockHeight);
  console.log(result);

  function getDataIfOk(result) {
    return result.msg === "ok" ? result.data : result;
  }

  if (result.totalSpace) {
    console.log("expansionSpace:");
    result = await space.expansionSpace(mnemonicOrAccountId32, 1);
    console.log(getDataIfOk(result), "\n");

    console.log("renewalSpace:");
    result = await space.renewalSpace(mnemonicOrAccountId32, 1);
    console.log(getDataIfOk(result), "\n");
  } else {
    console.log("buySpace:");
    result = await space.buySpace(mnemonicOrAccountId32, 1);
    console.log(getDataIfOk(result), "\n");
  }

  console.log("query userOwnedSpace:");
  result = await space.userOwnedSpace(addr);
  result = common.formatSpaceInfo(result.data, blockHeight);
  console.log(result);
}

main()
  .catch(console.error)
  .finally(() => process.exit());
```

More examples are in the [**examples**](./examples) directory.

To run them all, run the command:

```bash
pnpm examples
```

All examples connect to the Testnet and use the account `cXgaee2N8E77JJv9gdsGAckv1Qsf3hqWYf7NL4q6ZuQzuAUtB` as default with the following mnemonicOrAccountId32:

```
bottom drive obey lake curtain smoke basket hold race lonely fit walk
```

This is the [well-known development account](https://github.com/substrate-developer-hub/substrate-developer-hub.github.io/issues/613) in Substrate. If you don't have the token needed, please fetch it from the [Testnet faucet](https://cess.cloud/faucet.html).

### CESS Testnet RPC Endpoints

```
wss://testnet-rpc0.cess.cloud/ws/
wss://testnet-rpc1.cess.cloud/ws/
wss://testnet-rpc2.cess.cloud/ws/
```

### CESS Testnet Faucet

```
https://testnet-faucet.cess.cloud/
```

### CESS Testnet Public Gateway

```
Address: https://deoss-pub-gateway.cess.cloud/
Account: cXhwBytXqrZLr1qM5NHJhCzEMckSTzNKw17ci2aHft6ETSQm9
```

## APIs

### CESS Config

The config object of `CESSConfig` type is:

```ts
const testnetConfig = {
  nodeURL: "wss://testnet-rpc0.cess.cloud/ws/",
  keyringOption: { type: "sr25519", ss58Format: 42 },
  gatewayURL: "http://deoss-pub-gateway.cess.cloud/",
};

function buildConfig(nodeURL, gatewayURL, keyringOption) {
  return {
    nodeURL,
    gatewayURL,
    // default value for keyring option
    keyringOption: keyringOption || {
      type: "sr25519",
      ss58Format: 42,
    },
  };
}
```

### Space

- `userOwnedSpace(accountId32: string): Promise<APIReturnedData>`
- `buySpace(mnemonicOrAccountId32: string, gibCount: number): Promise<any>`
- `expansionSpace(mnemonicOrAccountId32OrAccountId32: string, gibCount: number): Promise<any>`
- `renewalSpace(mnemonicOrAccountId32: string, days: number): Promise<any>`

### Authorize

- `authorityList(accountId32: string): Promise<APIReturnedData>`
- `authorize(mnemonicOrAccountId32: string, operator: string): Promise<any>`
- `cancelAuthorize(mnemonicOrAccountId32: string, operator: string): Promise<any>`

### Bucket

- `queryBucketNames(accountId32: string): Promise<APIReturnedData>`
- `queryBucketList(accountId32: string): Promise<APIReturnedData>`
- `queryBucketInfo(accountId32: string, name: string): Promise<APIReturnedData>`
- `createBucket(mnemonicOrAccountId32: string, accountId32: string, name: string): Promise<any>`
- `deleteBucket(mnemonicOrAccountId32: string, accountId32: string, name: string): Promise<any>`

### File

- `queryFileListFull(accountId32: string): Promise<APIReturnedData>`
- `queryFileList(accountId32: string): Promise<APIReturnedData>`
- `queryFileMetadata(fileHash: string): Promise<APIReturnedData>`
- `uploadFile(mnemonicOrAccountId32: string, accountId32: string, filePath: string, bucketName: string): Promise<any>`
- `downloadFile(fileHash: string, savePath: string): Promise<any>`
- `deleteFile(mnemonicOrAccountId32: string, accountId32: string, fileHashArray: string[]): Promise<any>`
