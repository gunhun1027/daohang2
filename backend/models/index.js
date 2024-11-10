const { Sequelize } = require('sequelize');
const config = require('../config/database');

const sequelize = new Sequelize(
  config.database,
  config.username,
  config.password,
  {
    host: config.host,
    dialect: 'mysql',
    timezone: '+08:00'
  }
);

const db = {};
db.sequelize = sequelize;
db.Sequelize = Sequelize;

// 定义模型
db.User = require('./user')(sequelize, Sequelize);
db.Category = require('./category')(sequelize, Sequelize);
db.Link = require('./link')(sequelize, Sequelize);

// 定义关联关系
db.Category.hasMany(db.Link);
db.Link.belongsTo(db.Category);

module.exports = db; 