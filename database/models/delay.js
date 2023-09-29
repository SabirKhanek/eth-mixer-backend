/**
 * @param {import('sequelize').Sequelize} sequelize 
 * @param {import('sequelize').DataTypes} DataTypes 
 */
module.exports = (sequelize, DataTypes) => {
    return sequelize.define('delay', {
        id: {
            type: DataTypes.STRING,
            primaryKey: true
        }, value: {
            type: DataTypes.STRING,
            allowNull: false
        }
    }, {
        tableName: 'delay'
    })
}