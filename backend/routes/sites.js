const express = require('express');
const router = express.Router();
const { Link, Category } = require('../models');
const axios = require('axios');
const cheerio = require('cheerio');

// 获取所有网站
router.get('/', async (req, res) => {
  try {
    const sites = await Link.findAll({
      include: [{
        model: Category,
        attributes: ['id', 'name']
      }],
      attributes: ['id', 'name', 'url', 'icon', 'category_id', 'description']
    });

    // 格式化返回数据
    const formattedSites = sites.map(site => {
      const siteData = site.get({ plain: true });
      // 确保网站有图标
      if (!siteData.icon) {
        try {
          const url = new URL(siteData.url);
          siteData.icon = `${url.protocol}//${url.host}/favicon.ico`;
        } catch (error) {
          console.error('Invalid URL:', siteData.url);
        }
      }
      return {
        ...siteData,
        categoryName: site.Category ? site.Category.name : null
      };
    });

    res.json(formattedSites);
  } catch (error) {
    console.error('获取网站列表失败:', error);
    res.status(500).json({ message: '获取网站列表失败' });
  }
});

// 创建网站
router.post('/', async (req, res) => {
  try {
    const { name, url, icon, categoryId, description } = req.body;
    const site = await Link.create({
      name,
      url,
      icon,
      category_id: categoryId,
      description
    });
    res.json(site);
  } catch (error) {
    console.error('创建网站失败:', error);
    res.status(500).json({ message: '创建网站失败' });
  }
});

// 更新网站
router.put('/:id', async (req, res) => {
  try {
    const { name, url, icon, categoryId, description } = req.body;
    const site = await Link.findByPk(req.params.id);
    if (!site) {
      return res.status(404).json({ message: '网站不存在' });
    }
    await site.update({
      name,
      url,
      icon,
      category_id: categoryId,
      description
    });
    res.json(site);
  } catch (error) {
    console.error('更新网站失败:', error);
    res.status(500).json({ message: '更新网站失败' });
  }
});

// 删除网站
router.delete('/:id', async (req, res) => {
  try {
    const site = await Link.findByPk(req.params.id);
    if (!site) {
      return res.status(404).json({ message: '网站不存在' });
    }
    await site.destroy();
    res.json({ message: '删除成功' });
  } catch (error) {
    console.error('删除网站失败:', error);
    res.status(500).json({ message: '删除网站失败' });
  }
});

// 获取网站信息
router.post('/fetch-info', async (req, res) => {
  try {
    const { url } = req.body;
    
    // 规范化 URL
    let targetUrl = url;
    if (!url.startsWith('http')) {
      targetUrl = 'https://' + url;
    }

    // 设置请求配置
    const config = {
      timeout: 5000,
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
      },
      maxRedirects: 5
    };

    // 获取网页内容
    const response = await axios.get(targetUrl, config);
    const $ = cheerio.load(response.data);
    
    // 获取网站标题
    let name = $('title').text() || '';
    name = name.trim();
    
    // 获取网站图标
    let icon = '';
    const iconLink = $('link[rel="icon"]').attr('href') || 
                    $('link[rel="shortcut icon"]').attr('href') ||
                    '/favicon.ico';
    
    // 处理相对路径
    if (iconLink.startsWith('//')) {
      icon = 'https:' + iconLink;
    } else if (iconLink.startsWith('/')) {
      const urlObj = new URL(targetUrl);
      icon = `${urlObj.protocol}//${urlObj.host}${iconLink}`;
    } else if (!iconLink.startsWith('http')) {
      const urlObj = new URL(targetUrl);
      icon = `${urlObj.protocol}//${urlObj.host}/${iconLink}`;
    } else {
      icon = iconLink;
    }

    // 验证图标是否可访问
    try {
      await axios.head(icon, { timeout: 3000 });
    } catch (error) {
      // 如果图标不可访问，使用默认的 favicon.ico
      const urlObj = new URL(targetUrl);
      icon = `${urlObj.protocol}//${urlObj.host}/favicon.ico`;
    }

    res.json({ name, icon });

  } catch (error) {
    console.error('获取网站信息失败:', error.message);
    res.status(500).json({ 
      message: '获取网站信息失败',
      error: error.message,
      url: req.body.url
    });
  }
});

// 获取网站名称
router.post('/fetch-name', async (req, res) => {
  try {
    const { url } = req.body;
    
    // 规范化 URL
    let targetUrl = url;
    if (!targetUrl.startsWith('http')) {
      targetUrl = 'https://' + targetUrl;
    }

    const config = {
      timeout: 5000,
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
      }
    };

    const response = await axios.get(targetUrl, config);
    const $ = cheerio.load(response.data);
    
    // 获取网站标题
    let name = $('title').text() || '';
    name = name.trim();

    // 获取网站图标
    let icon = '';
    const iconLink = $('link[rel="icon"]').attr('href') || 
                    $('link[rel="shortcut icon"]').attr('href') ||
                    '/favicon.ico';

    // 处理图标 URL
    if (iconLink.startsWith('//')) {
      icon = 'https:' + iconLink;
    } else if (iconLink.startsWith('/')) {
      const urlObj = new URL(targetUrl);
      icon = `${urlObj.protocol}//${urlObj.host}${iconLink}`;
    } else if (!iconLink.startsWith('http')) {
      const urlObj = new URL(targetUrl);
      icon = `${urlObj.protocol}//${urlObj.host}/${iconLink}`;
    } else {
      icon = iconLink;
    }

    // 如果没有找到图标，使用默认的 favicon.ico
    if (!icon) {
      const urlObj = new URL(targetUrl);
      icon = `${urlObj.protocol}//${urlObj.host}/favicon.ico`;
    }

    // 验证图标是否可访问
    try {
      await axios.head(icon, { timeout: 3000 });
    } catch (error) {
      // 如果图标不可访问，使用 Google 的 favicon 服务
      const urlObj = new URL(targetUrl);
      icon = `https://www.google.com/s2/favicons?domain=${urlObj.host}`;
    }
    
    res.json({ name, icon });
  } catch (error) {
    console.error('获取网站信息失败:', error);
    res.status(500).json({ message: '获取网站信息失败' });
  }
});

// 获取网站图标
router.post('/fetch-icon', async (req, res) => {
  try {
    const { url } = req.body;
    
    // 规范化 URL
    let targetUrl = url;
    if (!targetUrl.startsWith('http')) {
      targetUrl = 'https://' + targetUrl;
    }

    const urlObj = new URL(targetUrl);
    // 直接使用网站的 favicon
    const icon = `${urlObj.protocol}//${urlObj.host}/favicon.ico`;
    
    res.json({ icon });
  } catch (error) {
    console.error('获取网站图标失败:', error);
    res.status(500).json({ message: '获取网站图标失败' });
  }
});

module.exports = router; 