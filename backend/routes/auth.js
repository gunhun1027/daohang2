const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const router = express.Router();
const { User } = require('../models');

// 创建管理员账号的路由
router.get('/create-admin', async (req, res) => {
  try {
    // 检查是否已存在管理员
    const adminExists = await User.findOne({ where: { isAdmin: true } });
    if (adminExists) {
      return res.status(400).json({ message: '管理员账号已存在' });
    }

    // 创建管理员账号
    const hashedPassword = await bcrypt.hash('123456', 10);
    const admin = await User.create({
      username: 'admin',
      password: hashedPassword,
      isAdmin: true
    });

    res.json({ message: '管理员账号创建成功' });
  } catch (error) {
    console.error('创建管理员失败:', error);
    res.status(500).json({ message: '服务器错误', error: error.message });
  }
});

// 登录路由
router.post('/login', async (req, res) => {
  try {
    const { username, password } = req.body;
    console.log('Login attempt:', { username, password });

    // 查找用户
    const user = await User.findOne({ 
      where: { username },
      raw: true
    });

    console.log('Found user:', user);

    if (!user) {
      console.log('User not found');
      return res.status(401).json({ message: '用户名或密码错误' });
    }

    // 验证密码
    const isValid = await bcrypt.compare(password, user.password);
    console.log('Password comparison:', { 
      provided: password,
      stored: user.password,
      isValid 
    });

    if (!isValid) {
      console.log('Invalid password');
      return res.status(401).json({ message: '用户名或密码错误' });
    }

    // 生成 token
    const token = jwt.sign(
      { 
        id: user.id, 
        username: user.username, 
        isAdmin: user.is_admin
      },
      'your-jwt-secret',
      { expiresIn: '24h' }
    );

    // 返回用户信息和 token
    res.json({
      token,
      user: {
        id: user.id,
        username: user.username,
        isAdmin: user.is_admin
      }
    });

  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ 
      message: '服务器错误',
      error: error.message 
    });
  }
});

// 重置管理员密码
router.post('/reset-admin', async (req, res) => {
  try {
    const hashedPassword = await bcrypt.hash('123456', 10);
    const admin = await User.findOne({ where: { username: 'admin' } });
    
    if (admin) {
      await admin.update({ password: hashedPassword });
      console.log('Admin password reset to: 123456');
      res.json({ message: '管理员密码已重置为: 123456' });
    } else {
      // 如果管理员不存在，创建一个
      await User.create({
        username: 'admin',
        password: hashedPassword,
        is_admin: true
      });
      console.log('Admin account created with password: 123456');
      res.json({ message: '管理员账号已创建，密码为: 123456' });
    }
  } catch (error) {
    console.error('Reset admin error:', error);
    res.status(500).json({ message: '重置失败' });
  }
});

module.exports = router; 