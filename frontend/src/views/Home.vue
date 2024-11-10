<template>
  <div class="home">
    <div class="search-box">
      <el-input
        v-model="searchKeyword"
        placeholder="请输入搜索内容"
        class="search-input"
        @keyup.enter="handleSearch"
      >
        <template #prefix>
          <el-icon><Search /></el-icon>
        </template>
      </el-input>
    </div>

    <div class="nav-content">
      <div v-for="category in categories" :key="category.id" class="nav-section">
        <h2 class="category-title">{{ category.name }}</h2>
        <div class="nav-grid">
          <a
            v-for="site in getSitesByCategory(category.id)"
            :key="site.id"
            :href="site.url"
            target="_blank"
            class="nav-item"
          >
            <img :src="site.icon" :alt="site.name" class="site-icon">
            <span class="site-name">{{ site.name }}</span>
          </a>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { Search } from '@element-plus/icons-vue'
import api from '../api/config'

const searchKeyword = ref('')
const categories = ref([])
const sites = ref([])

// 获取数据
const fetchData = async () => {
  try {
    const [categoriesRes, sitesRes] = await Promise.all([
      api.get('/categories'),
      api.get('/sites')
    ])
    categories.value = categoriesRes.data
    sites.value = sitesRes.data
  } catch (error) {
    console.error('获取数据失败:', error)
  }
}

// 根据分类获取网站
const getSitesByCategory = (categoryId) => {
  console.log('Sites:', sites.value);
  console.log('Looking for category:', categoryId);
  return sites.value.filter(site => Number(site.category_id) === Number(categoryId));
}

const handleSearch = () => {
  if (searchKeyword.value) {
    window.open(`https://www.baidu.com/s?wd=${searchKeyword.value}`, '_blank')
  }
}

onMounted(async () => {
  fetchData();
  // 记录访问
  try {
    await api.post('/stats/visit', { url: window.location.href });
  } catch (error) {
    console.error('记录访问失败:', error);
  }
});
</script>

<style scoped>
.home {
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
}

.search-box {
  margin: 20px 0 40px;
  display: flex;
  justify-content: center;
}

.search-input {
  width: 600px;
}

.nav-section {
  margin-bottom: 40px;
}

.category-title {
  font-size: 20px;
  margin-bottom: 20px;
  color: #333;
  border-left: 4px solid #409EFF;
  padding-left: 10px;
}

.nav-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(120px, 1fr));
  gap: 20px;
}

.nav-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 15px;
  border-radius: 8px;
  text-decoration: none;
  color: #333;
  transition: all 0.3s;
  background: #f5f7fa;
}

.nav-item:hover {
  transform: translateY(-2px);
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.1);
  background: #fff;
}

.site-icon {
  width: 32px;
  height: 32px;
  margin-bottom: 8px;
}

.site-name {
  font-size: 14px;
  text-align: center;
}
</style> 