const express = require('express');
const router = express.Router();
const { Category } = require('../models');

// 获取所有分类
router.get('/', async (req, res) => {
  try {
    const categories = await Category.findAll();
    res.json(categories);
  } catch (error) {
    console.error('获取分类失败:', error);
    res.status(500).json({ message: '获取分类失败' });
  }
});

// 创建分类
router.post('/', async (req, res) => {
  try {
    const category = await Category.create(req.body);
    res.json(category);
  } catch (error) {
    res.status(500).json({ message: '创建分类失败' });
  }
});

// 更新分类
router.put('/:id', async (req, res) => {
  try {
    const category = await Category.findByPk(req.params.id);
    if (!category) {
      return res.status(404).json({ message: '分类不存在' });
    }
    await category.update(req.body);
    res.json(category);
  } catch (error) {
    res.status(500).json({ message: '更新分类失败' });
  }
});

// 删除分类
router.delete('/:id', async (req, res) => {
  try {
    const category = await Category.findByPk(req.params.id);
    if (!category) {
      return res.status(404).json({ message: '分类不存在' });
    }
    await category.destroy();
    res.json({ message: '删除成功' });
  } catch (error) {
    res.status(500).json({ message: '删除分类失败' });
  }
});

module.exports = router; 