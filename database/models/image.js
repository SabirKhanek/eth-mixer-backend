/**
 * @param {import('sequelize').Sequelize} sequelize
 * @param {import('sequelize').DataTypes} DataTypes
 */
module.exports = (sequelize, DataTypes) => {
  return sequelize.define(
    "image",
    {
      title: { type: DataTypes.STRING, unique: true },
      uri: DataTypes.STRING,
      physical_path: { type: DataTypes.STRING, allowNull: true },
    },
    {
      tableName: "image",
    }
  );
};
