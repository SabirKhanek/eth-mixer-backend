
/**
 * @param {import('sequelize').Sequelize} sequelize 
 * @param {import('sequelize').DataTypes} DataTypes 
 */
module.exports = (sequelize, DataTypes) => {
    return sequelize.define('processed_txns', {
        txn_hash: {
            type: DataTypes.STRING,
            primaryKey: true
        }
    }, {tableName: 'processed_txns'})
}