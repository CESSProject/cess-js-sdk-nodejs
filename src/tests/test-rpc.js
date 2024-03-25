const init = require("../init-api");

// const init = require("./init");

async function main() {
    let { api } = await init();
    console.log('end')
    await api.rpc.chain.subscribeNewHeads((lastHeader) => {
        console.log(`last block #${lastHeader.number} has hash ${lastHeader.hash}`);
    });
}
main();