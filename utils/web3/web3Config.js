const { Alchemy, Network } = require("alchemy-sdk");
const CONFIG = require('../../config')

const NETWORK_TO_USE = CONFIG.RUNTIME_ENV==='development'?Network.ETH_SEPOLIA:Network.ETH_MAINNET;

const settings = {
    apiKey: "uTa4jIHobbKW5uc1AGIj8HYeU268h1ff",
    network: NETWORK_TO_USE
};

const alchemy = new Alchemy(settings);

// Test the connection
alchemy.core.getBlock("latest").then(res=>{
    console.log(`Connected to ETH ${NETWORK_TO_USE}. Latest Block: ${res.number}`)
}).catch(err=>{
    console.log("Couldn't connect with blockchain network")
    console.error(err)
});

module.exports = {
    alchemy,
    explorer_url: CONFIG.RUNTIME_ENV==='development'?'https://sepolia.etherscan.io':'https://etherscan.io'
}