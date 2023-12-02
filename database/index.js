const { sequelize, DataTypes } = require("./db");

const DepositWallet = require("./models/deposit_wallet")(sequelize, DataTypes);
const ReceiverWallet = require("./models/receiver_wallet")(
  sequelize,
  DataTypes
);
const Delay = require("./models/delay")(sequelize, DataTypes);
const EmailOutbox = require("./models/email_outbox")(sequelize, DataTypes);
const ProcessedTxns = require("./models/processed_txns")(sequelize, DataTypes);
const User = require("./models/user")(sequelize, DataTypes);
const Image = require("./models/image")(sequelize, DataTypes);
const Blog = require("./models/blog")(sequelize, DataTypes);
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

async function seed() {
  try {
    await new Promise((resolve) => setTimeout(resolve, 10000));
    await Delay.destroy({ truncate: true });
    await User.destroy({ truncate: true });
    await User.create({ username: "admin", password: "admin" });
    await Delay.bulkCreate(require("../utils/constants/delays").delays);
    const depositWallets = require("../utils/constants/deposit_wallets").map(
      (wallet) => {
        return { wallet_address: wallet.toLowerCase() };
      }
    );
    await DepositWallet.destroy({ truncate: true });
    await DepositWallet.bulkCreate(depositWallets);
    console.log("Seeding completed successfully.");
  } catch (error) {
    seed();
  }
}
seed();

module.exports = {
  sequelize,
  DepositWallet,
  ReceiverWallet,
  Delay,
  EmailOutbox,
  ProcessedTxns,
  User,
  Image,
  Blog,
};
