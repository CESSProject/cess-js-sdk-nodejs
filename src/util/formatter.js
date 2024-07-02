/*
 * @Description: js-sdk for cess storage
 * @Autor: cess lab
 *
 */
const _ = require("lodash");
const moment = require("moment");

module.exports = {
  formatEntries,
  formatterSize,
  formatterSize2,
  formatBalance,
  formatAddress,
  formatAddressLong,
  fixed,
  formatTime,
  formatSpaceInfo
};
function formatEntries(result, isNeedSourceKey, isToJson) {
  return result.map(([key, entry]) => {
    let ids = key.args.map((k) => k.toHuman());
    let id = ids[0];

    let humanObj = isToJson ? entry.toJSON() : entry.toHuman();
    if (ids.length > 0) {
      humanObj.ids = ids;
    }
    if (isNeedSourceKey) {
      return _.assign(humanObj, { key: id, sourceKey: key });
    }
    return _.assign(humanObj, { key: id });
  });
}

function formatterSize(size) {
  let obj = formatterSize2(size);
  return obj.size + " " + obj.ext;
}

function formatterSize2(size) {
  let sizeNum = _.isString(size) ? _.toNumber(size) : size;
  const sizeUnits = ["B", "KB", "MB", "GB", "TB", "PB", "EB", "ZB", "YB"];

  let uIdx = 0;
  while (sizeNum >= 1024 && uIdx < sizeUnits.length - 1) {
    sizeNum /= 1024;
    uIdx += 1;
  }

  return {
    size: sizeNum.toFixed(2),
    ext: sizeUnits[uIdx],
  };
}

function formatBalance(balance) {
  if (!balance) {
    return "";
  }
  if (typeof balance == "object" && balance.free) {
    balance = parseInt(balance.free.toString());
  }
  if (isNaN(balance)) {
    return balance;
  }
  return balance / 1e18;
}
function formatAddress(addr) {
  if (!addr) return "";
  if (addr.length < 10) return addr;
  return addr.slice(0, 5) + "..." + addr.slice(-5);
}
function formatAddressLong(addr) {
  if (!addr) return "";
  if (addr.length < 26) return addr;
  return addr.slice(0, 13) + "..." + addr.slice(-13);
}
function fixed(n) {
  return Math.floor(n * 100) / 100;
}
function formatTime(time) {
  let h = parseInt((time / 60 / 60) % 24);
  h = h < 10 ? "0" + h : h;
  let m = parseInt((time / 60) % 60);
  m = m < 10 ? "0" + m : m;
  let s = parseInt(time % 60);
  s = s < 10 ? "0" + s : s;
  // return [h, m, s]
  if (h > 0) {
    return h + ":" + m + ":" + s;
  } else {
    return m + ":" + s;
  }
}


const GB = 1024 * 1024 * 1024;
const SECS_IN_DAY = 60 * 60 * 24;
const BLOCK_TIME = 6; // in seconds
function formatSpaceInfo(obj, blockHeight) {
  const result = { ...obj };
  result.totalSpaceGib = 0;
  result.totalSpaceStr = "0 GB";

  result.usedSpaceGib = 0;
  result.usedSpaceStr = "0 GB";

  result.lockedSpaceGib = 0;
  result.lockedSpaceStr = "0 GB";

  result.remainingSpaceGib = 0;
  result.remainingSpaceStr = "0 GB";

  result.deadlineTime = "--";
  result.remainingDays = 0;

  if (result.totalSpace) {
    result.totalSpaceGib = result.totalSpace / GB;
    result.totalSpaceStr = formatterSize(result.totalSpace);
  }
  if (result.usedSpace) {
    result.usedSpaceGib = result.usedSpace / GB;
    result.usedSpaceStr = formatterSize(result.usedSpace);
  }
  if (result.lockedSpace) {
    result.lockedSpaceGib = result.lockedSpace / GB;
    result.lockedSpaceStr = formatterSize(result.lockedSpace);
  }
  if (result.remainingSpace) {
    result.remainingSpaceGib = result.remainingSpace / GB;
    result.remainingSpaceStr = formatterSize(result.remainingSpace);
  }
  if (result.deadline && blockHeight) {
    let s = (result.deadline - blockHeight) * BLOCK_TIME;
    let time = moment().add(s, "s");
    result.deadlineTime = time.format("YYYY-MM-DD HH:mm:ss");
    result.remainingDays = parseInt(s / SECS_IN_DAY);
  }

  return result;
}