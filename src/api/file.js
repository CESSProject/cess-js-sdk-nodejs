/*
 * @Description: js-sdk for cess storage
 * @Autor: cess lab
 */
const ControlBase = require("../control-base");
const fileHelper = require("../util/file-helper");
const bs58 = require("bs58");
const moment = require("moment");
const { formatterSize } = require("../util/formatter");
const { hexToString } = require("@polkadot/util");
const { queryBlockHeight, blockHeightToDatetime } = require("../util/index.js");

module.exports = class File extends ControlBase {
  constructor(api, keyring, gatewayURL, isDebug = false) {
    super(api, keyring, isDebug);
    if (!gatewayURL) {
      gatewayURL = "http://deoss-sgp.cess.network/";
    }
    this.gatewayURL = gatewayURL;
    // this.gatewayURL="http://172.16.2.191:8080/";
  }

  async queryFileListFull(accountId32) {
    try {
      let ret = await this.queryFileList(accountId32);
      if (ret.msg !== "ok") {
        return ret;
      }
      for (let file of ret.data) {
        let tmp = await this.queryFileMetadata(file.fileHash);
        if (tmp.msg === "ok") {
          let owe = tmp.data.owner.find((t) => t.user == accountId32);
          if (owe) {
            file.fileName = owe.fileName;
            file.bucketName = owe.bucketName;
          }
          file.fileSizeStr = formatterSize(tmp.data.fileSize);
          file.stat = tmp.data.stat;
        }
      }
      return ret;
    } catch (error) {
      console.error(error);
      return {
        msg: "ok",
        errMsg: error.message,
        error: JSON.stringify(error),
      };
    }
  }

  async queryFileList(accountId32) {
    try {
      let ret = await this.api.query.fileBank.userHoldFileList(accountId32);
      let data2 = ret.toHuman();
      let data = ret.toJSON();
      data.forEach((t, i) => {
        t.fileHash = data2[i].fileHash;
        t.fileSizeStr = formatterSize(t.fileSize);
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

  async queryFileMetadata(fileHash) {
    try {
      let ret = await this.api.query.fileBank.file(fileHash);
      let hu = ret.toHuman();
      let data = ret.toJSON();
      if (data && data.owner && data.owner.length > 0) {
        for (let i = 0; i < data.owner.length; i++) {
          let n = hu.owner[i].fileName;
          let territoryName = hu.owner[i].territoryName;
          if (n.indexOf("0x") == 0) {
            try {
              n = hexToString(n);
            } catch (e) {
              console.error(e);
            }
          }
          if (territoryName.indexOf("0x") == 0) {
            try {
              territoryName = hexToString(territoryName);
            } catch (e) {
              console.error(e);
            }
          }
          if (n) {
            data.owner[i].fileName = n;
            data.title = n;
            data.fileName = n;
          }
          data.owner[i].bucketName = hu.owner[i].bucketName;
          data.owner[i].territoryName = territoryName;
          data.bucketName = hu.owner[i].bucketName;
          data.territoryName = territoryName;
        }
        data.fid = fileHash;
        data.fileSizeStr = formatterSize(data.fileSize);
        data.uploadTime = await blockHeightToDatetime(this.api, data.completion);
        delete data.segmentList;
      }
      return {
        msg: "ok",
        data,
      };
    } catch (error) {
      console.error(error);
      return {
        msg: "error",
        errMsg: error.message,
        error: JSON.stringify(error),
      };
    }
  }
  async queryFileDealMap(fileHash) {
    try {
      let ret = await this.api.query.fileBank.dealMap(fileHash);
      if (!ret) {
        return { msg: 'file not found' };
      }
      let json = ret.toJSON();
      let hu = ret.toHuman();
      if (!json) {
        return { msg: 'file not found' };
      }
      let currBlockHeight = await queryBlockHeight(this.api);
      let data = {
        fid: fileHash,
        fileSize: json?.fileSize,
        fileSizeStr: formatterSize(json?.fileSize),
        owner: [hu.user],
        bucketName: hu.user?.bucketName,
        fileName: hu.user?.fileName,
        title: hu.user?.fileName,
        territoryName: hu.user?.territoryName,
        stat: "Pending",
        completion: currBlockHeight,
        uploadTime: moment().format("YYYY-MM-DD HH:mm:ss")
      };
      return {
        msg: "ok",
        data,
      };
    } catch (error) {
      console.error(error);
      return {
        msg: "error",
        errMsg: error.message,
        error: JSON.stringify(error),
      };
    }
  }
  async queryFileInfo(fileHash) {
    let ret = await this.queryFileMetadata(fileHash);
    // console.log("queryFileMetadata", ret);
    if (ret.msg == 'ok' && ret.data) {
      return ret;
    }
    ret = await this.queryFileDealMap(fileHash);
    // console.log("queryFileDealMap", ret);
    return ret;
  }

  async uploadFile(mnemonic, filePath, territoryName, progressCb) {
    try {
      const pair = this.keyring.createFromUri(mnemonic);
      let accountId32 = pair.address;
      const message = "<Bytes>cess-js-sdk-" + new Date().valueOf() + "</Bytes>";
      const { signU8A } = await this.authSign(mnemonic, message);
      if (!signU8A) {
        return {
          msg: "sign error",
        };
      }
      const sign = bs58.encode(signU8A);

      if (!sign) {
        console.log("sign error");
        return {
          msg: "sign error",
        };
      }

      const headers = {
        Territory: territoryName,
        Bucket: 'cess',
        Account: accountId32,
        Message: message,
        Signature: sign,
      };
      const ret = await fileHelper.uploadByChunk(
        // const ret = await fileHelper.upload(
        this.gatewayURL,
        filePath,
        headers,
        this.log,
        progressCb,
      );
      return ret;
    } catch (e) {
      console.log(e);
      return { msg: "error", error: e };
    }
  }

  async downloadFile(fileHash, filePath) {
    let url = this.gatewayURL + '/download/' + fileHash;
    let ret = await fileHelper.download(url, filePath, this.log);
    return ret;
  }

  async deleteFile(mnemonic, fileHash, subState = null) {
    const pair = this.keyring.createFromUri(mnemonic);
    accountId32 = pair.address;
    const extrinsic = this.api.tx.fileBank.deleteFile(accountId32, fileHash);
    return await this.signAndSend(mnemonic, extrinsic, subState);
  }
};
