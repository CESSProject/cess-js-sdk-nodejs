function getSliceInfoArr(size, blockSize = 10485760) {
    let blockCount =  Math.ceil(size / blockSize);
    console.log(blockCount)

    let blockCount2 = parseInt(size / blockSize);
    blockCount2 = size % blockSize == 0 ? blockCount2 : blockCount2 + 1;
    console.log(blockCount2)

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

//   console.log(getSliceInfoArr(1,10));
//   console.log(getSliceInfoArr(13,10));
//   console.log(getSliceInfoArr(28,10));
  console.log(getSliceInfoArr(100,10));
//   console.log(getSliceInfoArr(99,10));
//   console.log(getSliceInfoArr(990,10));