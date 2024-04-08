/*
 * @Description: js-sdk for cess storage
 * @Autor: cess lab
 */
const { testnetConfig, wellKnownAcct } = require("./myconfig.cjs");
const { Space, InitAPI, Common } = require("../");
const { getDataIfOk } = require("../util");


async function main() {
  const { api, keyring } = await InitAPI(testnetConfig);
  const { addr, mnemonic } = wellKnownAcct;

  const space = new Space(api, keyring);
  const common = new Common(api, keyring);

  console.log("subscribeUserOwnedSpace:");
  let result = await space.subscribeUserOwnedSpace("cXfVNaeLo9M5vRnwrfpm2BkbfHvFRUxXZskw4j5vJMPSVkPga", (result) => {
    console.log({ result });
  });
  await common.subscribeBalance("cXfVNaeLo9M5vRnwrfpm2BkbfHvFRUxXZskw4j5vJMPSVkPga", (result) => {
    console.log({ result });
  });

}

main();
