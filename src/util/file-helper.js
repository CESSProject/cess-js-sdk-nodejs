/*
 * @Description: js-sdk for cess storage
 * @Autor: cess lab
 *
 */
const fs = require("fs");
const FormDataNode = require("form-data");
const axios = require("axios");

function download(url, savePath, log) {
  return new Promise((resolve, reject) => {
    try {
      log("Connecting …", url);
      axios
        .get(url, {
          headers: {
            Operation: "download",
            Account: "cXh5StobuVP4B7mGH9xn8dSsDtXks4qLAou8ZdkZ6DbB6zzxe",
          },
          responseType: "stream",
          onDownloadProgress: (progressEvent) => {
            const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
            log(`Completed：${percentCompleted}%`);
          },
        })
        .then((response) => {
          // console.log(response.data.toString());
          let out = fs.createWriteStream(savePath);
          out.on("finish", function () {
            resolve({ msg: "ok", data: savePath });
          });
          response.data.pipe(out);
        })
        .catch((error) => {
          console.error("Download fail：", error);
          reject(error);
        });
    } catch (e) {
      log(e);
      reject(e.message);
    }
  });
}
async function upload(url, filePath, header, log, progressCb) {
  return new Promise((resolve, reject) => {
    try {
      const fileStream = fs.createReadStream(filePath);
      const formData = new FormDataNode();
      formData.append("file", fileStream);
      const headers = formData.getHeaders();
      Object.keys(header).forEach((k) => {
        headers[k] = header[k];
      });
      log("Connecting …", url);
      let stime = new Date().getTime();
      let sloaded = 0;
      const controller = new AbortController();
      axios
        .put(url, formData, {
          signal: controller.signal,
          headers,
          onUploadProgress: (e) => {
            if (progressCb && typeof progressCb == "function") {
              let percentComplete = Math.ceil((e.loaded / e.total) * 100);
              let endTime = new Date().getTime();
              let dTime = (endTime - stime) / 1000;
              let dloaded = e.loaded - sloaded;
              let speed = dloaded / dTime;
              speed = speed / 1024;
              stime = new Date().getTime();
              sloaded = e.loaded;
              let speedUnit = "KB/s";
              if (speed > 1024) {
                speed = speed / 1024;
                speedUnit = "MB/s";
              }
              speed = speed.toFixed(1);
              progressCb({
                percentComplete,
                speed,
                speedUnit,
                controller,
              });
            }
          },
        })
        .then((res) => {
          resolve({ msg: "ok", data: res.data });
        })
        .catch((error) => {
          console.error("Upload fail：", error.message);
          reject(error.message);
        });
    } catch (e) {
      log(e);
      reject(e.message);
    }
  });
}

module.exports = {
  download,
  upload,
};
