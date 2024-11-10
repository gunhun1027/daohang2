module.exports = (sequelize, DataTypes) => {
  const Visit = sequelize.define('Visit', {
    ip: {
      type: DataTypes.STRING,
      allowNull: true
    },
    url: {
      type: DataTypes.STRING,
      allowNull: true
    }
  }, {
    tableName: 'visits',
    underscored: true,
    timestamps: true
  });
  return Visit;
}; 