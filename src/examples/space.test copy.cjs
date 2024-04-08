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

  console.log("query userOwnedSpace:");
  let result = await space.userOwnedSpace("cXfVNaeLo9M5vRnwrfpm2BkbfHvFRUxXZskw4j5vJMPSVkPga");
  console.log({result});
  const blockHeight = await common.queryBlockHeight();

  result = common.formatSpaceInfo(result.data, blockHeight);
  console.log(result);return;

  if (result.totalSpace) {
    console.log("expansionSpace:");
    result = await space.expansionSpace(mnemonic, 1);
    console.log(getDataIfOk(result), "\n");

    console.log("renewalSpace:");
    result = await space.renewalSpace(mnemonic, 1);
    console.log(getDataIfOk(result), "\n");
  } else {
    console.log("buySpace:");
    result = await space.buySpace(mnemonic, 1);
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
