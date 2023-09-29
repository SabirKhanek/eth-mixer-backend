const { Sequelize, DataTypes } = require("sequelize");
const { STORAGE_MOUNT, DB_LOGGING, DB_IN_MEMORY } = require("../config");

const db_path = STORAGE_MOUNT + "/database.sqlite";

// const fs = require('fs')
// if(fs.existsSync(db_path)) {
//     fs.unlinkSync(db_path)
// }

const sequelize = new Sequelize({
  dialect: "sqlite",
  storage: DB_IN_MEMORY ? ":memory:" : db_path,
  logging: DB_LOGGING, // Set to true to see SQL queries in the console
});

(async () => {
  try {
    await sequelize.authenticate();
    console.log("Database connected successfully..");
    await sequelize.sync();
    return sequelize;
  } catch (error) {
    console.error("Error connecting to the database", error);
    return null;
  }
})().catch((err) => {
  console.log(err);
});

module.exports = {
  sequelize,
  DataTypes,
};
