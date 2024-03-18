/*
 * @Description: js-sdk for cess storage
 * @Autor: cess lab
 *
 */
const bs58 = require("bs58");

const uint8ArrayToHex = (bytes) =>
  "0x" + bytes.reduce((str, byte) => str + byte.toString(16).padStart(2, "0"), "");
function uint8ArrayToString(u8arr) {
  var dataString = "";
  for (var i = 0; i < u8arr.length; i++) {
    dataString += String.fromCharCode(u8arr[i]);
  }
  return dataString;
}
function uint8ArrayToIP(u8arr) {
  return uint8ArrayToString(bs58.decode(uint8ArrayToString(u8arr)));
}
function base58ToIP(u8arr) {
  return uint8ArrayToString(bs58.decode(u8arr));
}

function stringToByte(str) {
  var bytes = new Array();
  var len, c;
  len = str.length;
  for (var i = 0; i < len; i++) {
    c = str.charCodeAt(i);
    if (c >= 0x010000 && c <= 0x10ffff) {
      bytes.push(((c >> 18) & 0x07) | 0xf0);
      bytes.push(((c >> 12) & 0x3f) | 0x80);
      bytes.push(((c >> 6) & 0x3f) | 0x80);
      bytes.push((c & 0x3f) | 0x80);
    } else if (c >= 0x000800 && c <= 0x00ffff) {
      bytes.push(((c >> 12) & 0x0f) | 0xe0);
      bytes.push(((c >> 6) & 0x3f) | 0x80);
      bytes.push((c & 0x3f) | 0x80);
    } else if (c >= 0x000080 && c <= 0x0007ff) {
      bytes.push(((c >> 6) & 0x1f) | 0xc0);
      bytes.push((c & 0x3f) | 0x80);
    } else {
      bytes.push(c & 0xff);
    }
  }
  return bytes;
}
function byteToString(arr) {
  if (typeof arr === "string") {
    return arr;
  }
  var str = "",
    _arr = arr;
  for (var i = 0; i < _arr.length; i++) {
    var one = _arr[i].toString(2),
      v = one.match(/^1+?(?=0)/);
    if (v && one.length == 8) {
      var bytesLength = v[0].length;
      var store = _arr[i].toString(2).slice(7 - bytesLength);
      for (var st = 1; st < bytesLength; st++) {
        store += _arr[st + i].toString(2).slice(2);
      }
      str += String.fromCharCode(parseInt(store, 2));
      i += bytesLength - 1;
    } else {
      str += String.fromCharCode(_arr[i]);
    }
  }
  return str;
}
function hexStringToUint8Array(hexString) {
  if (hexString.indexOf("0x") == 0) {
    hexString = hexString.replace("0x", "");
  }
  const length = Math.ceil(hexString.length / 2);
  const uint8Array = new Uint8Array(length);

  for (let i = 0; i < length; i++) {
    const startIndex = i * 2;
    const endIndex = startIndex + 2;
    const hexValue = hexString.substring(startIndex, endIndex);
    const byteValue = parseInt(hexValue, 16);
    uint8Array[i] = byteValue;
  }

  return uint8Array;
}

function getDataIfOk(result) {
  return result.msg === "ok" ? result.data : result;
}

module.exports = {
  base58ToIP,
  byteToString,
  getDataIfOk,
  hexStringToUint8Array,
  stringToByte,
  uint8ArrayToHex,
  uint8ArrayToIP,
  uint8ArrayToString,
};
