/*
 * @Description: js-sdk for cess storage
 * @Autor: cess lab
 *
 */
import { wellKnownAcct } from "./myconfig.mjs";
import { Authorize, InitAPI, defaultConfig } from "../index.mjs";
import { getDataIfOk } from "../util/index.js";

async function main() {
  const { api, keyring } = await InitAPI(defaultConfig);
  const { mnemonic, addr, gatewayAddr } = wellKnownAcct;

  const oss = new Authorize(api, keyring);

  console.log("query authorityList:");
  let result = await oss.authorityList(addr);
  console.log(result.data, "\n");

  console.log("authorize:");
  result = await oss.authorize(mnemonic, gatewayAddr);
  console.log(getDataIfOk(result), "\n");

  console.log("query authorityList:");
  result = await oss.authorityList(addr);
  console.log(getDataIfOk(result), "\n");

  console.log("cancelAuthorize:");
  result = await oss.cancelAuthorize(mnemonic, gatewayAddr);
  console.log(getDataIfOk(result), "\n");

  console.log("query authorityList:");
  result = await oss.authorityList(addr);
  console.log(getDataIfOk(result));

  // console.log("authorize:");
  // await oss.authorize(mnemonic, gatewayAddr);
  // console.log(getDataIfOk(result), "\n");
}

main()
  .catch(console.error)
  .finally(() => process.exit());
