/* eslint-disable @typescript-eslint/no-explicit-any */
// Note: There are a few types that I don't know the return types. So enable the use of
// `any` for now.

import { ApiPromise, Keyring } from "@polkadot/api";

export as namespace CESS;
export = CESS;

interface APIReturnedData {
    msg: string;
    data?: any;
    errMsg?: string;
    error?: string;
}

interface KeyringOption {
    type: string;
    ss58Format: number;
}

declare namespace CESS {
    interface CESSConfig {
        nodeURL: string | string[];
        gatewayURL: string;
        gatewayAddr: string;
        keyringOption: KeyringOption;
    }

    interface SpaceInfo {
        totalSpace?: number;
        usedSpace?: number;
        lockedSpace?: number;
        remainingSpace?: number;
        deadline?: number;
    }

    interface SpaceInfoFormatted extends SpaceInfo {
        totalSpaceGib?: number;
        totalSpaceStr?: string;

        usedSpaceGib?: number;
        usedSpaceStr?: string;

        lockedSpaceGib?: number;
        lockedSpaceStr?: string;

        remainingSpaceGib?: number;
        remainingSpaceStr?: string;

        deadlineTime?: string;
        remainingDays?: number;
    }

    function InitAPI(config: CESSConfig): Promise<{
        api: ApiPromise;
        keyring: Keyring;
    }>;

    class ControlBase {
        constructor(api: ApiPromise, keyring: Keyring, isDebug?: boolean);
        log(...msgs: string[]): void;
        error(...msgs: string[]): void;
        sign(mnemonic: string, tx: any): Promise<string>;
        submitTransaction(transaction: object): Promise<string>;
        signAndSend(
            mnemonic: string,
            extrinsic: object,
            subStateFun?: (status: any) => void,
        ): Promise<any>;
        authSign(mnemonic: string, msg: string): Promise<any>;
        formatAccountId(accountId32: string | undefined): string | undefined;
    }

    class Common extends ControlBase {
        constructor(api: ApiPromise, keyring: Keyring, isDebug?: boolean);
        queryBlockHeight(): Promise<number>;
        formatSpaceInfo(spaceInfo: SpaceInfo | undefined, blockHeight: number): SpaceInfoFormatted;
        subscribeBalance(accountId32: string, subFun: Function): Promise<Function>;
    }

    class Territory extends ControlBase {
        constructor(api: ApiPromise, keyring: Keyring, isDebug?: boolean);
        queryMyTerritorys(accountId32: string): Promise<APIReturnedData>;
        queryTerritoryInfo(accountId32: string, territoryName: string): Promise<APIReturnedData>;
        createTerritory(mnemonic: string, territoryName: string, gibCount: number, subState?: (status: any) => void): Promise<any>;
        expandingTerritory(
            mnemonic: string,
            territoryName: string,
            gibCount: number,
            subState?: (status: any) => void,
        ): Promise<any>;
        renewalTerritory(mnemonic: string, territoryName: string, days: number, subState?: (status: any) => void): Promise<any>;
        renameTerritory(mnemonic: string, oldName: string, newName: string, subState?: (status: any) => void): Promise<any>;
        reactivateTerritory(accountId32: string, territoryName: string, days: number, subState?: (status: any) => void): Promise<any>;
    }

    class Authorize extends ControlBase {
        constructor(api: ApiPromise, keyring: Keyring, isDebug?: boolean);
        authorityList(accountId32: string): Promise<APIReturnedData>;
        authorize(mnemonic: string, operator: string, subState?: (status: any) => void): Promise<any>;
        cancelAuthorize(
            mnemonic: string,
            operator: string,
            subState?: (status: any) => void,
        ): Promise<any>;
    }

    class Bucket extends ControlBase {
        constructor(api: ApiPromise, keyring: Keyring, isDebug?: boolean);
        queryBucketNames(accountId32: string): Promise<APIReturnedData>;
        queryBucketList(accountId32: string): Promise<APIReturnedData>;
        queryBucketInfo(accountId32: string, name: string): Promise<APIReturnedData>;
        createBucket(
            mnemonic: string,
            accountId32: string,
            name: string,
            subState?: (status: any) => void,
        ): Promise<any>;
        deleteBucket(
            mnemonic: string,
            accountId32: string,
            name: string,
            subState?: (status: any) => void,
        ): Promise<any>;
    }

    class File extends ControlBase {
        constructor(api: ApiPromise, keyring: Keyring, gatewayURL?: string, isDebug?: boolean);
        queryFileListFull(accountId32: string): Promise<APIReturnedData>;
        queryFileList(accountId32: string): Promise<APIReturnedData>;
        queryFileMetadata(fileHash: string): Promise<APIReturnedData>;
        uploadFile(
            mnemonic: string,
            filePath: string,
            bucketName: string,
            progressCb?: (status: any) => void
        ): Promise<any>;
        downloadFile(fileHash: string, filePath: string): Promise<any>;
        deleteFile(
            mnemonic: string,
            fileHash: string,
            subState?: (status: any) => void,
        ): Promise<any>;
    }

    const defaultConfig: CESSConfig;
}