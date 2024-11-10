const express = require('express');
const cors = require('cors');
const { sequelize } = require('./models');
const authRoutes = require('./routes/auth');
const categoryRoutes = require('./routes/categories');
const statsRoutes = require('./routes/stats');
const siteRoutes = require('./routes/sites');

const app = express();

// 中间件
app.use(cors({
  origin: 'http://localhost:5173',
  credentials: true
}));
app.use(express.json());

// API 根路由
app.get('/api', (req, res) => {
  res.json({ message: 'API is working' });
});

// 路由
app.use('/api/auth', authRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/stats', statsRoutes);
app.use('/api/sites', siteRoutes);

// 测试路由
app.get('/api/test', (req, res) => {
  console.log('Test route accessed');
  res.json({ message: 'API is working' });
});

// 404 处理
app.use((req, res) => {
  console.log('404 Not Found:', req.method, req.originalUrl);
  res.status(404).json({ 
    message: '接口不存在',
    path: req.originalUrl
  });
});

// 错误处理中间件
app.use((err, req, res, next) => {
  console.error('Error:', err);
  res.status(500).json({ message: '服务器错误', error: err.message });
});

const PORT = process.env.PORT || 3000;

// 初始化数据库并启动服务器
const initializeServer = async () => {
  try {
    // 测试数据库连接
    await sequelize.authenticate();
    console.log('Database connection established successfully.');

    // 同步数据库模型（改为 force: false）
    await sequelize.sync({ force: false });
    console.log('Database synchronized');

    // 检查是否需要创建管理员账号
    const { User } = require('./models');
    const bcrypt = require('bcryptjs');
    
    let admin = await User.findOne({ where: { username: 'admin' } });
    
    if (!admin) {
      const hashedPassword = await bcrypt.hash('123456', 10);
      admin = await User.create({
        username: 'admin',
        password: hashedPassword,
        is_admin: true
      });
      console.log('Admin account created');
    }

    // 启动服务器
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
      console.log(`Frontend URL: http://localhost:5173`);
      console.log(`Backend API URL: http://localhost:${PORT}/api`);
      console.log('Available routes:');
      console.log('- GET  /api');
      console.log('- POST /api/auth/login');
      console.log('- GET  /api/categories');
      console.log('- GET  /api/stats');
      console.log('- GET  /api/sites');
    });
  } catch (error) {
    console.error('Unable to start server:', error);
    process.exit(1);
  }
};

// 启动服务器
initializeServer();