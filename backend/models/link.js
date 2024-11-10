module.exports = (sequelize, DataTypes) => {
  const Link = sequelize.define('Link', {
    name: {
      type: DataTypes.STRING(100),
      allowNull: false
    },
    url: {
      type: DataTypes.STRING(255),
      allowNull: false
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    icon: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    category_id: {
      type: DataTypes.INTEGER,
      references: {
        model: 'categories',
        key: 'id'
      }
    }
  }, {
    tableName: 'links',
    underscored: true,
    timestamps: true
  });
  return Link;
}; 