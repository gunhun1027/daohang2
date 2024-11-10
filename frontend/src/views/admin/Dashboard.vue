<template>
  <div class="dashboard">
    <!-- 统计卡片 -->
    <el-row :gutter="20">
      <el-col :span="8">
        <el-card shadow="hover">
          <div class="stat-card">
            <div class="stat-value">{{ stats.categoryCount }}</div>
            <div class="stat-label">分类总数</div>
          </div>
        </el-card>
      </el-col>
      <el-col :span="8">
        <el-card shadow="hover">
          <div class="stat-card">
            <div class="stat-value">{{ stats.siteCount }}</div>
            <div class="stat-label">网站总数</div>
          </div>
        </el-card>
      </el-col>
      <el-col :span="8">
        <el-card shadow="hover">
          <div class="stat-card">
            <div class="stat-value">{{ stats.userCount }}</div>
            <div class="stat-label">用户总数</div>
          </div>
        </el-card>
      </el-col>
    </el-row>

    <!-- 最近添加 -->
    <el-row :gutter="20" class="mt-4">
      <el-col :span="12">
        <el-card>
          <template #header>
            <div class="card-header">
              <span>最近添加的分类</span>
            </div>
          </template>
          <el-table :data="stats.recentCategories">
            <el-table-column prop="name" label="分类名称" />
            <el-table-column prop="created_at" label="创建时间">
              <template #default="{ row }">
                {{ formatDate(row.created_at) }}
              </template>
            </el-table-column>
          </el-table>
        </el-card>
      </el-col>
      <el-col :span="12">
        <el-card>
          <template #header>
            <div class="card-header">
              <span>最近添加的网站</span>
            </div>
          </template>
          <el-table :data="stats.recentSites">
            <el-table-column prop="name" label="网站名称" />
            <el-table-column prop="created_at" label="创建时间">
              <template #default="{ row }">
                {{ formatDate(row.created_at) }}
              </template>
            </el-table-column>
          </el-table>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import api from '@/api/config'

const stats = ref({
  categoryCount: 0,
  siteCount: 0,
  userCount: 0,
  recentCategories: [],
  recentSites: []
})

// 格式化日期
const formatDate = (date) => {
  if (!date) return '';
  return new Date(date).toLocaleString('zh-CN', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit'
  });
}

const fetchStats = async () => {
  try {
    const res = await api.get('/stats')
    console.log('Stats data:', res.data)  // 添加调试日志
    stats.value = res.data
  } catch (error) {
    console.error('获取统计数据失败:', error)
  }
}

onMounted(() => {
  fetchStats()
})
</script>

<style scoped>
.dashboard {
  padding: 20px;
}

.stat-card {
  text-align: center;
  padding: 20px;
}

.stat-value {
  font-size: 24px;
  font-weight: bold;
  color: #409EFF;
}

.stat-label {
  margin-top: 10px;
  color: #666;
}

.mt-4 {
  margin-top: 20px;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
</style> 