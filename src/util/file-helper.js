/*
 * @Description: js-sdk for cess storage
 * @Autor: cess lab
 *
 */
const fs = require("fs");
const FormDataNode = require("form-data");
const axios = require("axios");
const util = require("../util");
const CHUNK_SIZE = 2 * 1024 * 1024;

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
          console.error("Upload fail：", error.response?.data || error.message);
          reject(error.message);
        });
    } catch (e) {
      log(e);
      reject(e.message);
    }
  });
}
async function uploadByChunk(url, filePath, header, log, progressCb) {
  try {
    const fileInfo = fs.statSync(filePath);
    const size = fileInfo.size;
    const buffInfoArray = getSliceInfoArr(size, CHUNK_SIZE);
    // console.log(buffInfoArray)    
    let arr = filePath.split('\\').join('/').split('/');
    header.FileName = encodeURIComponent(arr[arr.length - 1]);
    header.BlockNumber = buffInfoArray.length;
    header.TotalSize = size;
    let state = "uploading";
    console.log({ url, header });
    let res = { msg: "" };
    for (let i = 0; i < buffInfoArray.length; i++) {
      if (state == 'abort') {
        return { msg: "abort" };
      }
      try {
        let info = buffInfoArray[i];
        const buf = fs.createReadStream(filePath, info);
        let percentComplete = Math.ceil(((i + 1) / buffInfoArray.length) * 100);
        header.BlockIndex = i+1;
        let stime;
        for (let j = 0; j < 3; j++) {
          stime = new Date().getTime();
          res = await postFile(url, buf, header);
          if (res.msg == 'ok') {
            // console.log(res);
            break;
          } else {
            console.log('api error', res.msg, 'retrying...');
            await util.sleep(1000);
          }
        }
        if (res.msg != 'ok') {
          return res;
        }

        let endTime = new Date().getTime();
        let dTime = (endTime - stime) / 1000;
        let speed = (info.end - info.start) / dTime;
        speed = speed / 1024;
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
          result: { msg: res.msg, data: res.data },
          controller: {
            abort: () => { state = 'abort'; }
          }
        });
      } catch (e) {
        console.error(e);
      }
    }
    return res;
  } catch (e) {
    log(e);
    return { msg: e.message };
  }
}
function postFile(url, fileObj, header) {
  return new Promise(async (resolve, reject) => {
    try {
      const formData = new FormDataNode();
      formData.append("file", fileObj);
      const headers = formData.getHeaders();
      Object.keys(header).forEach((k) => {
        headers[k] = header[k];
      });
      // console.log({ url, headers });
      axios
        .put(url, formData, { headers })
        .then((res) => {
          let msg = res.status == 200 ? 'ok' : res.data || response.statusText;
          console.log('res.status', res.status);
          resolve({ msg, data: res.data });
        })
        .catch((error) => {
          let msg = error.response?.data || error.message;
          console.error("Upload error：", msg);
          resolve({ msg });
        });
    } catch (e) {
      console.error("Upload fail：", e.message);
      resolve({ msg: e.message });
    }
  });
}
function getSliceInfoArr(size, blockSize = 10485760) {
  let blockCount = Math.ceil(size / blockSize);
  const arr = [];
  for (let i = 0; i < blockCount; i++) {
    const o = {
      start: i * blockSize,
      end: (i + 1) * blockSize - 1,
    };
    if (o.end >= size - 1) {
      o.end = size - 1;
    }
    if (o.end >= o.start) {
      arr.push(o);
    }
  }
  return arr;
}
module.exports = {
  download,
  upload,
  uploadByChunk
};
