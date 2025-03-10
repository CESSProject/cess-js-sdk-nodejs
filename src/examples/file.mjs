/*
 * @Description: js-sdk for cess storage
 * @Autor: cess lab
 */

import { testnetConfig, wellKnownAcct } from "./myconfig.mjs";
import { File, Authorize, InitAPI } from "../index.mjs";
import { getDataIfOk } from "../util/index.js";
import path from "path";
import { join as joinPath, resolve as resolvePath } from "node:path";

const LICENSE_PATH = resolvePath(joinPath("../../LICENSE"));
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

async function uploadFile(oss, accountId32, mnemonic) {
  console.log("uploadFile:", LICENSE_PATH);
  const result = await oss.uploadFile(mnemonic, accountId32, LICENSE_PATH, console.log);
  console.log(getDataIfOk(result), "\n");
  return result;
}

async function downloadFile(oss, fileHash) {
  console.log("downloadFile:");
  const result = await oss.downloadFile(fileHash, "./tmp.txt");
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
  const oss = new File(api, keyring, testnetConfig.gatewayURL, true);

  let files = await queryFileList(oss, addr);
  if (files.msg == "ok" && files.data.length > 0) {
    await downloadFile(oss, files.data[0].fileHash);
  }
}

main()
  .catch(console.error)
  .finally(() => process.exit());
