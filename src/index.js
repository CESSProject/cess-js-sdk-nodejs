/*
 * @Description: js-sdk for cess storage
 * @Autor: cess lab
 */
const InitAPI = require("./init-api");
const Common = require("./api/common");
const Authorize = require("./api/authorize");
const Space = require("./api/space");
const Bucket = require("./api/bucket");
const File = require("./api/file");
const defaultConfig = require("./default-config.js");

module.exports = {
  InitAPI,
  Authorize,
  Bucket,
  Common,
  File,
  Space,
  defaultConfig,
};
