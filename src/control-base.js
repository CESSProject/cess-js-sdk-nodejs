/*
 * @Description: js-sdk for cess storage
 * @Autor: cess lab
 */
const util = require("../src/util/index");
const defaultConfig = require("../src/default-config");

module.exports = class ControlBase {
  constructor(api, keyring, isDebug = false) {
    this.api = api;
    this.keyring = keyring;
    this.debug = isDebug;
  }

  log = (...msg) => {
    if (this.debug) {
      console.log(...msg);
    }
  };

  error = (...msg) => {
    if (this.debug) {
      console.error(...msg);
    }
  };

  async sign(mnemonic, tx) {
    const api = this.api;
    const pair = this.keyring.createFromUri(mnemonic);
    const { nonce } = await api.query.system.account(pair.address);
    // create the payload
    const signer = api.createType("SignerPayload", {
      method: tx,
      nonce,
      genesisHash: api.genesisHash,
      blockHash: api.genesisHash,
      runtimeVersion: api.runtimeVersion,
      version: api.extrinsicVersion,
    });
    const { signature } = api
      .createType("ExtrinsicPayload", signer.toPayload(), {
        version: api.extrinsicVersion,
      })
      .sign(pair);
    tx.addSignature(pair.address, signature, signer.toPayload());
    return tx.toHex();
  }

  async submitTransaction(transaction) {
    /* eslint-disable-next-line no-async-promise-executor */
    return new Promise(async (resolve, reject) => {
      const api = this.api;
      let tx;
      try {
        tx = api.tx(transaction);
      } catch (err) {
        reject(err);
      }
      try {
        const hash = await api.rpc.author.submitExtrinsic(tx);
        resolve(hash.toHex());
      } catch (err) {
        reject(err);
      }
    });
  }

  signAndSend(mnemonic, extrinsic, subState = null) {
    return new Promise(async (resolve, reject) => {
      try {
        const pair = this.keyring.createFromUri(mnemonic);
        const extrinsicHash = extrinsic.hash.toHex();
        const unsub = await extrinsic.signAndSend(pair, (result) => {
          // this.log(result.toHuman());
          if (subState && typeof subState == "function") {
            subState(result.toHuman());
          }
          if (result.status.isInBlock || result.status.isFinalized) {
            unsub();
            if (!result.dispatchInfo) {
              return reject({
                msg: "Cannot get `dispatchInfo` from the result.",
              });
            } else if (result.dispatchError) {
              return reject({
                msg: "dispatchError",
                data: result.dispatchError.toHuman(),
              });
            }
            resolve({ msg: "ok", data: extrinsicHash });
          } else if (result.status.isDropped) {
            unsub();
            reject("isDropped");
          } else if (result.status.isFinalityTimeout) {
            unsub();
            reject(`Finality timeout at block hash '${result.status.asFinalityTimeout}'.`);
          } else if (result.isError) {
            unsub();
            reject(result.toHuman());
          } else {
            this.log(result.toHuman());
          }
        });
      } catch (e) {
        this.error(e);
        reject(e.message);
      }
    });
  }

  async authSign(mnemonic, msg) {
    // console.log("Is in node.");
    let kr = this.keyring;
    const pair = kr.createFromUri(mnemonic);
    kr.setSS58Format(defaultConfig.keyringOption.ss58Format);
    const publicKeyU8A = pair.publicKey;
    // console.log("publicKeyU8A", publicKeyU8A);
    const ss58 = pair.address;
    const signU8A = pair.sign(msg);
    // console.log("signU8A", signU8A);
    const publicKeyStr = util.uint8ArrayToHex(publicKeyU8A);
    const signStr = util.uint8ArrayToHex(signU8A);
    return {
      mnemonic,
      msg,
      publicKeyU8A,
      publicKeyStr,
      signU8A,
      signStr,
      ss58,
    };
  }

  formatAccountId(accountId32) {
    if (!accountId32 || accountId32.length == 64) {
      return accountId32;
    }
    const pair = this.keyring.addFromAddress(accountId32);
    this.keyring.setSS58Format(defaultConfig.keyringOption.ss58Format);
    return pair.address;
  }
};
