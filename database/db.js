const { Sequelize, DataTypes } = require('sequelize');
const {STORAGE_MOUNT} = require('../config')

const db_path = STORAGE_MOUNT + '/database.sqlite';

// const fs = require('fs')
// if(fs.existsSync(db_path)) {
//     fs.unlinkSync(db_path)
// }

const sequelize = new Sequelize({
    dialect: 'sqlite',
    storage: db_path,
    logging: true, // Set to true to see SQL queries in the console
});

(async () => {
    try {
        await sequelize.authenticate();
        console.log('Database connected successfully..');
        await sequelize.sync();
        return sequelize;
    } catch (error) {
        console.error('Error connecting to the database', error);
        return null;
    }
})();

module.exports = {
    sequelize,
    DataTypes,
};
