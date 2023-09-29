
/**
 * @param {import('sequelize').Sequelize} sequelize 
 * @param {import('sequelize').DataTypes} DataTypes 
 */
module.exports = (sequelize, DataTypes) => {
    return sequelize.define('deposit_wallet', {
        wallet_address: {
            primaryKey: true,
            type: DataTypes.STRING(42)
        }
    }, {
        tableName: 'deposit_wallet'
    })
}