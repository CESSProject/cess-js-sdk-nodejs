/*
 * @Description: js-sdk for cess storage
 * @Autor: cess lab
 */
const ControlBase = require("../control-base");
const formatter = require("../util/formatter");

module.exports = class Space extends ControlBase {
  constructor(api, keyring, isDebug = false) {
    super(api, keyring, isDebug);
  }

  async userOwnedSpace(accountId32) {
    try {
      let ret = await this.api.query.storageHandler.userOwnedSpace(accountId32);
      let data = ret.toJSON();
      if (data) {
        let human = ret.toHuman();
        data.state = human.state;
      }
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

  async subscribeUserOwnedSpace(accountId32, subFun) {
    if (!accountId32) throw 'accountId32 is required';
    if (!subFun) throw 'subFun is required';
    if (typeof subFun != 'function') throw 'subFun must a function';
    let blockHeight = 0;
    let unsubHeader = await this.api.rpc.chain.subscribeNewHeads((lastHeader) => {
      blockHeight = lastHeader.number;
    });
    let unsubSpace = await this.api.query.storageHandler.userOwnedSpace(accountId32, (ret) => {
      let data = ret.toJSON();
      if (data) {
        let human = ret.toHuman();
        data.state = human.state;
      }
      subFun(formatter.formatSpaceInfo(data, blockHeight));
    });
    return () => {
      unsubHeader();
      unsubSpace();
    }
  }

  async buySpace(mnemonic, gibCount, subState = null) {
    const extrinsic = this.api.tx.storageHandler.buySpace(gibCount);
    return await this.signAndSend(mnemonic, extrinsic, subState);
  }

  async expansionSpace(mnemonic, gibCount, subState = null) {
    const extrinsic = this.api.tx.storageHandler.expansionSpace(gibCount);
    return await this.signAndSend(mnemonic, extrinsic, subState);
  }

  async renewalSpace(mnemonic, days, subState = null) {
    const extrinsic = this.api.tx.storageHandler.renewalSpace(days);
    return await this.signAndSend(mnemonic, extrinsic, subState);
  }
};
