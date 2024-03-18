/*
 * @Description: js-sdk for cess storage
 * @Autor: cess lab
 */
const { wellKnownAcct } = require("./myconfig.cjs");
const { Bucket, InitAPI, defaultConfig } = require("../");
const { getDataIfOk } = require("../util");

const BUCKET_NAME = "test01";

async function main() {
  const { api, keyring } = await InitAPI(defaultConfig);
  const { mnemonic, addr } = wellKnownAcct;
  const oss = new Bucket(api, keyring);

  console.log("queryBucketList:");
  let result = await oss.queryBucketList(addr);
  console.log(getDataIfOk(result), "\n");

  // If result.msg is not "ok", something wrong with the remote connection, so we exit.
  if (result.msg !== "ok") return;

  console.log("createBucket:");
  result = await oss.createBucket(mnemonic, BUCKET_NAME);
  console.log(getDataIfOk(result), "\n");

  console.log("queryBucketInfo:");
  result = await oss.queryBucketInfo(addr, BUCKET_NAME);
  console.log(getDataIfOk(result), "\n");

  console.log("queryBucketList:");
  result = await oss.queryBucketList(addr);
  console.log(getDataIfOk(result), "\n");

  console.log("deleteBucket:");
  result = await oss.deleteBucket(mnemonic, BUCKET_NAME);
  console.log(getDataIfOk(result), "\n");

  console.log("queryBucketList:");
  result = await oss.queryBucketList(addr);
  console.log(getDataIfOk(result), "\n");
}

main()
  .catch(console.error)
  .finally(() => process.exit());
