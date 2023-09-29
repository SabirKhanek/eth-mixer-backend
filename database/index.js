const { sequelize, DataTypes } = require("./db");

const DepositWallet = require("./models/deposit_wallet")(sequelize, DataTypes);
const ReceiverWallet = require("./models/receiver_wallet")(
  sequelize,
  DataTypes
);
const Delay = require("./models/delay")(sequelize, DataTypes);
const EmailOutbox = require("./models/email_outbox")(sequelize, DataTypes);
const ProcessedTxns = require("./models/processed_txns")(sequelize, DataTypes);

DepositWallet.hasMany(ReceiverWallet, {
  foreignKey: { name: "deposit_wallet", allowNull: false },
  foreignKeyConstraint: "deposit_wallet",
});

Delay.hasMany(ReceiverWallet, {
  foreignKey: { name: "delay", defaultValue: "-1" },
  as: "receiver_wallet",
  foreignKeyConstraint: "delay",
});
ReceiverWallet.belongsTo(Delay, {
  foreignKey: { name: "delay", defaultValue: "-1" },
  as: "delay_obj",
  foreignKeyConstraint: "delay",
});
setTimeout(async () => {
  await Delay.destroy({ truncate: true });
  await Delay.bulkCreate(require("../utils/constants/delays").delays);
  const depositWallets = require("../utils/constants/deposit_wallets").map(
    (wallet) => {
      return { wallet_address: wallet.toLowerCase() };
    }
  );
  await DepositWallet.destroy({ truncate: true });
  // await DepositWallet.create({wallet_address: '0x18F5e7743dd3F1af54eBff5FD366dDf3Ee28e410'})
  await DepositWallet.bulkCreate(depositWallets);
}, 3_000);
module.exports = {
  sequelize,
  DepositWallet,
  ReceiverWallet,
  Delay,
  EmailOutbox,
  ProcessedTxns,
};
