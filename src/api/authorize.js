/*
 * @Description: js-sdk for cess storage
 * @Autor: cess lab
 */
const ControlBase = require("../control-base");

module.exports = class Authorize extends ControlBase {
  constructor(api, keyring, isDebug = false) {
    super(api, keyring, isDebug);
  }

  async authorityList(accountId32) {
    try {
      let ret = await this.api.query.oss.authorityList(accountId32);
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

  async authorize(mnemonic, operator, subState = null) {
    const extrinsic = this.api.tx.oss.authorize(operator);
    return await this.signAndSend(mnemonic, extrinsic, subState);
  }

  async cancelAuthorize(mnemonic, operator, subState = null) {
    const extrinsic = this.api.tx.oss.cancelAuthorize(operator);
    return await this.signAndSend(mnemonic, extrinsic, subState);
  }
};
