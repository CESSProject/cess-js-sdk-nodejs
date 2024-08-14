/*
 * @Description: js-sdk for cess storage
 * @Autor: cess lab
 */
const { join: joinPath, resolve: resolvePath } = require("node:path");
const { testnetConfig, wellKnownAcct } = require("./myconfig.cjs");

const { File, Authorize, Bucket, Territory, InitAPI } = require("../");
const { getDataIfOk } = require("../util");
const path = require("path");

const LICENSE_PATH = resolvePath(joinPath(__dirname, "../../LICENSE"));
let BUCKET_NAME = "test01";
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
  const result = await oss.uploadFile(mnemonic, "E:\\图片素材\\2.png", territoryName, console.log);
  console.log(result, "\n");
  return result;
}

async function downloadFile(oss, fileHash) {
  console.log("downloadFile:");
  const result = await oss.downloadFile(fileHash, path.join(__dirname, "tmp.txt"));
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
  const territory = new Territory(api, keyring, true);


  // let info = await oss.queryFileInfo("c6bca58f17ecf6a01e10594f793928af48a714e1ae1ae7b7da650cf1ce7ad36d");
  // console.log('file info', info);

  // console.log("authorize:");
  // const ossAuthorze = new Authorize(api, keyring);
  // let result = await ossAuthorze.authorize(mnemonic, gatewayAddr);
  // console.log(getDataIfOk(result), "\n");

  // console.log("queryBucketList:");
  // const ossBucket = new Bucket(api, keyring);
  // result = await ossBucket.queryBucketList(addr);
  // if (result.msg != 'ok') {
  //   return console.log('query bucket error', result);
  // }
  // console.log('query bucket result', result);
  // if (result.data.length == 0) {
  //   result = await ossBucket.createBucket(mnemonic, BUCKET_NAME);
  //   console.log('createBucket result', result);
  // } else {
  //   BUCKET_NAME = result.data[0].key;
  // }
  let territoryList=await territory.queryMyTerritorys(addr);
  console.log("territoryList",territoryList);
  // let files = await queryFileList(oss, addr);
  // console.log({ files });
  // if (files.msg == "ok" && files.data.length > 0) {
  //   await downloadFile(oss, files.data[0].fileHash);
  // }
  // console.log('start upload file')
  await uploadFile(oss, mnemonic, territoryList.data[0].name);

  // let tmpFileHash = "0414617e35db30b114360d6ade6f6a980784c5c6052f6d8a8cae90b342d9ccb6";
  // await downloadFile(oss, tmpFileHash);

  // let result = await queryFileList(oss, addr);
  // if (result.msg != "ok") {
  //   return;
  // }
  // let bucketName = BUCKET_NAME;
  // if (result.data?.length) {
  //   let tmpFileHash = result.data[0].fileHash;
  // if(files.data.length>0){
  //   let tmpFileHash=files.data[0].fileHash;
  //   await queryFileMetadata(oss, tmpFileHash);
  // }

  //   bucketName = result.data[0].bucketName;
  //   await downloadFile(oss, tmpFileHash);
  //   await deleteFile(oss,mnemonic, tmpFileHash);
  // }
  // let bucketName = 'test';
  // await uploadFile(oss, mnemonic, bucketName);
}

main()
  .catch(console.error)
  .finally(() => process.exit());
