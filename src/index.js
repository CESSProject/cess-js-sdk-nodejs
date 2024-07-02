/*
 * @Description: js-sdk for cess storage
 * @Autor: cess lab
 */
const InitAPI = require("./init-api");
const Common = require("./api/common");
const Authorize = require("./api/authorize");
const Bucket = require("./api/bucket");
const File = require("./api/file");
const Territory = require("./api/territory");
const defaultConfig = require("./default-config.js");

module.exports = {
  InitAPI,
  Authorize,
  Bucket,
  Common,
  File,
  Territory,
  defaultConfig,
};
