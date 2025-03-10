/*
 * @Description: js-sdk for cess storage
 * @Autor: cess lab
 */
const { join: joinPath, resolve: resolvePath } = require("node:path");
const { testnetConfig, wellKnownAcct } = require("./myconfig.cjs");

const { File, Authorize, Territory, InitAPI } = require("../");
const { getDataIfOk } = require("../util");
const path = require("path");

const LICENSE_PATH = resolvePath(joinPath(__dirname, "../../LICENSE"));
const { mnemonic, addr, gatewayAddr } = wellKnownAcct;

async function queryFileList(oss, accountId32) {
  console.log("queryFileList:");
  let result = await oss.queryFileListFull(accountId32);
  console.log(getDataIfOk(result), "\n");
  return result;
}

async function queryFileMetadata(oss, fileHash) {
  console.log("queryFileMetadata:");
  const result = await oss.queryFileMetadata(fileHash);
  console.log(getDataIfOk(result), "\n");
}

async function uploadFile(oss, mnemonic, territoryName) {
  console.log("uploadFile:", LICENSE_PATH);
  territoryName = "TW_TEST_1";
  const result = await oss.uploadFile(mnemonic, LICENSE_PATH, territoryName, console.log);
  console.log(result, "\n");
  return result;
}

async function downloadFile(oss, fileHash) {
  console.log("downloadFile:");
  const result = await oss.downloadFile(fileHash, path.join(__dirname, "111.mp4"));
  console.log(result.msg === "ok" ? result.data : result);
}

async function deleteFile(oss, accountId32, mnemonic, fileHash) {
  console.log("deleteFile:");
  const result = await oss.deleteFile(mnemonic, accountId32, [fileHash]);
  console.log(result.msg === "ok" ? result.data : result);
}

async function main() {
  const { api, keyring } = await InitAPI(testnetConfig);
  const { mnemonic, addr } = wellKnownAcct;
  // let gatewayURL="http://192.168.110.247:8080";
  const oss = new File(api, keyring, testnetConfig.gatewayURL, true);
  const territory = new Territory(api, keyring, true);

  await uploadFile(oss, mnemonic, "");

  
}

main()
  .catch(console.error)
  .finally(() => process.exit());
