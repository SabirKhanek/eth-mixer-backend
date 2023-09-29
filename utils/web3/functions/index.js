const { alchemy } = require("../web3Config");

function formatWeiToEther(weiAmount) {
  const etherValue = weiAmount / 1e18; // 1 Ether = 1e18 Wei
  return etherValue;
}

module.exports.getInfoFromTxnHash = async (txn_hash) => {
  const txn = await alchemy.core.waitForTransaction(txn_hash);
  const txn_obj = await alchemy.core.getTransaction(txn_hash);
  const block = await alchemy.core.getBlock(txn.blockHash);
  const val = formatWeiToEther(txn_obj.value);
  console.log();
  return {
    sender_address: txn.from.toLowerCase(),
    receiver_address: txn.to.toLowerCase(),
    txn_at: new Date(block.timestamp * 1000),
    value: val,
  };
};
