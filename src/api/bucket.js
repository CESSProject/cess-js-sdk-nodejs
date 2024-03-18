/*
 * @Description: js-sdk for cess storage
 * @Autor: cess lab
 */
const ControlBase = require("../control-base");
const { formatEntries } = require("../util/formatter");

module.exports = class Bucket extends ControlBase {
  constructor(api, keyring, isDebug = false) {
    super(api, keyring, isDebug);
  }

  async queryBucketNames(accountId32) {
    try {
      await this.api.isReady;
      let ret = await this.api.query.fileBank.userBucketList(accountId32);
      let data = ret.toHuman();
      return {
        msg: "ok",
        data,
      };
    } catch (error) {
      console.error(error);
      return {
        msg: "ok",
        errMsg: error.message,
        error: JSON.stringify(error),
      };
    }
  }

  async queryBucketList(accountId32) {
    try {
      await this.api.isReady;
      let ret = await this.api.query.fileBank.bucket.entries(accountId32);
      let data = formatEntries(ret, false, false);
      data.forEach((t) => {
        t.key = t.ids[1];
        delete t.ids;
        delete t.authority;
      });
      return {
        msg: "ok",
        data,
      };
    } catch (error) {
      console.error(error);
      return {
        msg: "ok",
        errMsg: error.message,
        error: JSON.stringify(error),
      };
    }
  }

  async queryBucketInfo(accountId32, name) {
    try {
      await this.api.isReady;
      let ret = await this.api.query.fileBank.bucket(accountId32, name);
      let data = ret.toJSON();
      return {
        msg: "ok",
        data,
      };
    } catch (error) {
      console.error(error);
      return {
        msg: "ok",
        errMsg: error.message,
        error: JSON.stringify(error),
      };
    }
  }

  async createBucket(mnemonic, name, subState = null) {
    await this.api.isReady;
    const pair = this.keyring.createFromUri(mnemonic);
    const extrinsic = this.api.tx.fileBank.createBucket(pair.address, name);
    return await this.signAndSend(mnemonic, extrinsic, subState);
  }

  async deleteBucket(mnemonic, name, subState = null) {
    await this.api.isReady;
    const pair = this.keyring.createFromUri(mnemonic);
    const extrinsic = this.api.tx.fileBank.deleteBucket(pair.address, name);
    return await this.signAndSend(mnemonic, extrinsic, subState);
  }
};
