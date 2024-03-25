const init = require("../init-api");

// const init = require("./init");

async function main() {
    let api=await init();
    console.log('end')
}
main();