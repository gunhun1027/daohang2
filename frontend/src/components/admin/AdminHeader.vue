<template>
  <div class="admin-header">
    <div class="header-left">
      <el-breadcrumb separator="/">
        <el-breadcrumb-item :to="{ path: '/admin' }">首页</el-breadcrumb-item>
        <el-breadcrumb-item>{{ currentRoute }}</el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <div class="header-right">
      <el-dropdown trigger="click">
        <div class="user-info">
          <el-avatar :size="32" icon="UserFilled" />
          <span class="username">管理员</span>
          <el-icon class="el-icon--right"><CaretBottom /></el-icon>
        </div>
        <template #dropdown>
          <el-dropdown-menu>
            <el-dropdown-item @click="handleProfile">
              <el-icon><User /></el-icon>个人信息
            </el-dropdown-item>
            <el-dropdown-item @click="handleSettings">
              <el-icon><Setting /></el-icon>系统设置
            </el-dropdown-item>
            <el-dropdown-item divided @click="handleLogout">
              <el-icon><SwitchButton /></el-icon>退出登录
            </el-dropdown-item>
          </el-dropdown-menu>
        </template>
      </el-dropdown>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { 
  CaretBottom,
  User,
  Setting,
  SwitchButton
} from '@element-plus/icons-vue'

const route = useRoute()
const router = useRouter()

const currentRoute = computed(() => {
  const pathMap = {
    '/admin/dashboard': '仪表盘',
    '/admin/categories': '分类管理',
    '/admin/sites': '网站管理',
    '/admin/settings': '系统设置'
  }
  return pathMap[route.path] || '首页'
})

const handleProfile = () => {
  // 实现个人信息功能
}

const handleSettings = () => {
  router.push('/admin/settings')
}

const handleLogout = () => {
  localStorage.removeItem('token')
  router.push('/login')
}
</script>

<style scoped>
.admin-header {
  height: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 20px;
}

.user-info {
  display: flex;
  align-items: center;
  cursor: pointer;
  padding: 0 8px;
  height: 40px;
  border-radius: 4px;
  transition: all 0.3s;
}

.user-info:hover {
  background: rgba(0,0,0,.025);
}

.username {
  margin: 0 8px;
  color: rgba(0,0,0,.85);
}

:deep(.el-dropdown-menu__item) {
  display: flex;
  align-items: center;
  gap: 8px;
}

:deep(.el-dropdown-menu__item .el-icon) {
  margin-right: 4px;
}
</style> 