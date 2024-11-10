module.exports = {
  host: 'mysql.sqlpub.com',
  port: 3306,
  username: 'gunhun',
  password: 'kUAHi3uuqds7SXsJ',
  database: 'nav_site',
  dialect: 'mysql',
  define: {
    timestamps: true,
    underscored: true,
    freezeTableName: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at'
  },
  dialectOptions: {
    charset: 'utf8mb4',
    collate: 'utf8mb4_unicode_ci',
    dateStrings: true,
    typeCast: true
  },
  timezone: '+08:00',
  logging: console.log  // 开启 SQL 日志以便调试
}; 