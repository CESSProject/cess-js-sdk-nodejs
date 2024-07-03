/*
 * @Description: js-sdk for cess storage
 * @Autor: cess lab
 */
const ControlBase = require("../control-base");
const { formatEntries, formatSpaceInfo } = require("../util/formatter");
const { queryBlockHeight } = require("../util/index");

module.exports = class Territory extends ControlBase {
    constructor(api, keyring, isDebug = false) {
        super(api, keyring, isDebug);
    }

    async queryMyTerritorys(accountId32) {
        try {
            let ret = await this.api.query.storageHandler.territory.entries(accountId32);
            let data = formatEntries(ret, false, true);
            let blockHeight = await queryBlockHeight(this.api);
            let arr = [];
            data.forEach((t) => {
                t.owner = t.ids[0];
                t.name = t.ids[1];
                t.key = t.token;
                delete t.token;
                delete t.ids;
                arr.push(formatSpaceInfo(t, blockHeight));
            });
            return {
                msg: "ok",
                data: arr,
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
    async queryTerritoryInfo(accountId32, territoryName) {
        try {
            let ret = await this.api.query.storageHandler.territory(accountId32, territoryName);
            let data = ret.toJSON();
            data.owner = accountId32;
            data.name = territoryName;
            data.key = data.token;
            let blockHeight = await queryBlockHeight(this.api);
            data = formatSpaceInfo(data, blockHeight);
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
    async createTerritory(mnemonic, territoryName, gibCount, subState = null) {
        const extrinsic = this.api.tx.storageHandler.mintTerritory(gibCount, territoryName);
        return await this.signAndSend(mnemonic, extrinsic, subState);
    }
    async expandingTerritory(mnemonic, territoryName, gibCount, subState = null) {
        const extrinsic = this.api.tx.storageHandler.expandingTerritory(territoryName, gibCount);
        return await this.signAndSend(mnemonic, extrinsic, subState);
    }
    async renewalTerritory(mnemonic, territoryName, days, subState = null) {
        const extrinsic = this.api.tx.storageHandler.renewalTerritory(territoryName, days);
        return await this.signAndSend(mnemonic, extrinsic, subState);
    }
    async renameTerritory(mnemonic, oldName, newName, subState = null) {
        const extrinsic = this.api.tx.storageHandler.territoryRename(oldName, newName);
        return await this.signAndSend(mnemonic, extrinsic, subState);
    }
    async reactivateTerritory(mnemonic, territoryName, days, subState = null) {
        const extrinsic = this.api.tx.storageHandler.reactivateTerritory(territoryName, days);
        return await this.signAndSend(mnemonic, extrinsic, subState);
    }
};
