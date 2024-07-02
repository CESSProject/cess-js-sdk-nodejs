/*
 * @Description: js-sdk for cess storage
 * @Autor: cess lab
 *
 */
const { wellKnownAcct } = require("./myconfig.cjs");
const { Territory, InitAPI, defaultConfig } = require("../");
const { getDataIfOk } = require("../util");

async function main() {
  const { api, keyring } = await InitAPI(defaultConfig);
  const { mnemonic, addr, gatewayAddr } = wellKnownAcct;

  const oss = new Territory(api, keyring, true);

  console.log("query queryMyTerritorys:");
  let result = await oss.queryMyTerritorys(addr);
  console.log(result.data, "\n");

  if (result.data.length > 0) {
    let name = result.data[0].name;

    console.log("queryTerritoryInfo:");
    result = await oss.queryTerritoryInfo(addr, name);
    console.log(result, "\n");

    console.log("renameTerritory:");
    result = await oss.renameTerritory(mnemonic, name, 'test2', console.log);
    console.log(result, "\n");

    // console.log("expandingTerritory:");
    // result = await oss.expandingTerritory(mnemonic, name, 1, console.log);
    // console.log(result, "\n");

    // console.log("renewalTerritory:");
    // result = await oss.renewalTerritory(mnemonic, name, 10, console.log);
    // console.log(result, "\n");
  } else {
    // console.log("createTerritory:", gatewayAddr);
    // result = await oss.createTerritory(mnemonic, "test1", 1, console.log);
    // console.log(result, "\n");

  }


  console.log("query queryMyTerritorys:");
  result = await oss.queryMyTerritorys(addr);
  console.log(result.data, "\n");

}

main()
  .catch(console.error)
  .finally(() => process.exit());
