const express = require('express');
const router = express.Router();
const { Category, Link, User, sequelize } = require('../models');

router.get('/', async (req, res) => {
  try {
    // 使用原始查询获取统计数据
    const [[stats]] = await sequelize.query(`
      SELECT 
        (SELECT COUNT(*) FROM categories) as categoryCount,
        (SELECT COUNT(*) FROM links) as siteCount,
        (SELECT COUNT(*) FROM users) as userCount
    `);

    // 获取最近的分类
    const recentCategories = await Category.findAll({
      order: [['created_at', 'DESC']],
      limit: 5,
      raw: true
    });

    // 获取最近的网站
    const recentSites = await Link.findAll({
      order: [['created_at', 'DESC']],
      limit: 5,
      include: [{
        model: Category,
        attributes: ['name']
      }],
      raw: true,
      nest: true
    });

    // 格式化日期
    const formatTime = (list) => {
      return list.map(item => ({
        ...item,
        created_at: new Date(item.created_at).toLocaleString('zh-CN')
      }));
    };

    res.json({
      categoryCount: parseInt(stats.categoryCount) || 0,
      siteCount: parseInt(stats.siteCount) || 0,
      userCount: parseInt(stats.userCount) || 0,
      recentCategories: formatTime(recentCategories),
      recentSites: formatTime(recentSites)
    });

  } catch (error) {
    console.error('获取统计数据失败:', error);
    res.status(500).json({ message: '获取统计数据失败' });
  }
});

// 记录访问
router.post('/visit', async (req, res) => {
  try {
    await Visit.create({
      ip: req.ip,
      url: req.body.url
    });
    res.json({ success: true });
  } catch (error) {
    console.error('记录访问失败:', error);
    res.status(500).json({ message: '记录访问失败' });
  }
});

module.exports = router; 