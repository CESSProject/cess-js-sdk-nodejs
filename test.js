const fs = require("fs");
const slicer = require("fs-slicer");

async function main(files) {
  let arr = [];
  // console.log(b.toString('utf8'));return;
  let fileInfos = [];
  for (f of files) {
    const size = fs.statSync(f).size;
    let buf = await slicer.readOneBlock(f, { start: 0, end: size - 1 });
    arr.push(buf);
    console.log(buf);
    fileInfos.push({ size, name: f, id: new Date().valueOf() });
  }
  let str = JSON.stringify(fileInfos) + '\n';
  let b = Buffer.from(str, 'binary');
  arr.unshift(b);
  await slicer.joinBlcoksToFile('./a.txt', arr);
}
async function unzip() {
  let buf = await slicer.readOneBlock('./a.txt', { start: 0, end: 1000 });
  let str = buf.toString('utf-8');
  let jsonStr = str.slice(0, str.indexOf('\n'));
  let json = JSON.parse(jsonStr);
  console.log(json)
  let start = jsonStr.length + 1;
  for (let a of json) {
    console.log(a);
    let buf = await slicer.readOneBlock('./a.txt', { start, end: start + a.size - 1 });
    await slicer.joinBlcoksToFile(a.name, [buf]);
    start += a.size;
  }
}
async function mafa() {
  const filePath = './abc/1.jpg';
  // 需要读取的头部大小，例如5个字节
  const headerSize = 2;

  // 读取文件头部信息
  fs.open(filePath, 'r', (err, fd) => {
    if (err) {
      throw err;
    }

    // 创建缓冲区用于存储头部数据
    const buffer = Buffer.alloc(headerSize);

    // 读取文件头部
    fs.read(fd, buffer, 0, headerSize, 0, (readErr) => {
      if (readErr) {
        throw readErr;
      }

      // 转换缓冲区为字符串并打印
      console.log(buffer.toString('hex'));

      // 关闭文件描述符
      fs.close(fd, (closeErr) => {
        if (closeErr) {
          throw closeErr;
        }
      });
    });
  });
}
async function writeFile() {
  let arr = [];
  let fileInfos={a:123,b:4332,c:'功'};
  let str = JSON.stringify(fileInfos);
  console.log('str.length',str.length);
  let b = Buffer.from(str,'binary');
  arr.unshift(b);
  console.log('b.length',b.length);
  await slicer.joinBlcoksToFile('./a.txt', arr);
}
async function test() {
  let str=new Array(10);
  str[str.length-1]=255;
  let b = Buffer.from(str);
  console.log(b,'hex');
}
// main(['./abc/1.jpg', './abc/2.jpg', './abc/3.jpg', './abc/4.jpg', './abc/5.jpg']);
// unzip();
// mafa();
// writeFile();
test();