<template>
  <div class="admin-layout">
    <el-container>
      <!-- 侧边栏 -->
      <el-aside width="200px">
        <div class="logo" @click="handleLogoClick">
          <el-icon><Monitor /></el-icon>
          <span>导航网站管理</span>
        </div>
        <!-- 侧边菜单 -->
        <el-menu
          :default-active="activeMenu"
          background-color="#304156"
          text-color="#fff"
          active-text-color="#409EFF"
          router
        >
          <el-menu-item index="/admin">
            <el-icon><DataLine /></el-icon>
            <span>仪表盘</span>
          </el-menu-item>
          <el-menu-item index="/admin/categories">
            <el-icon><Menu /></el-icon>
            <span>分类管理</span>
          </el-menu-item>
          <el-menu-item index="/admin/sites">
            <el-icon><Link /></el-icon>
            <span>网站管理</span>
          </el-menu-item>
          <el-menu-item index="/admin/settings">
            <el-icon><Setting /></el-icon>
            <span>系统设置</span>
          </el-menu-item>
        </el-menu>
      </el-aside>

      <!-- 主体内容 -->
      <el-container>
        <!-- 顶部导航 -->
        <el-header>
          <div class="header-right">
            <el-dropdown>
              <span class="user-info">
                管理员 <el-icon><ArrowDown /></el-icon>
              </span>
              <template #dropdown>
                <el-dropdown-menu>
                  <el-dropdown-item @click="handleLogout">退出登录</el-dropdown-item>
                </el-dropdown-menu>
              </template>
            </el-dropdown>
          </div>
        </el-header>

        <!-- 内容区域 -->
        <el-main>
          <div class="main-content">
            <router-view v-slot="{ Component }">
              <component :is="Component" />
            </router-view>
          </div>
        </el-main>
      </el-container>
    </el-container>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { Monitor, DataLine, Menu, Link, ArrowDown, Setting } from '@element-plus/icons-vue'

const route = useRoute()
const router = useRouter()

// 当前激活的菜单
const activeMenu = computed(() => route.path)

// 处理 logo 点击
const handleLogoClick = () => {
  router.push('/admin')
}

// 退出登录
const handleLogout = () => {
  localStorage.removeItem('token')
  router.push('/login')
}
</script>

<style scoped>
.admin-layout {
  height: 100vh;
}

.el-container {
  height: 100%;
}

.el-aside {
  background-color: #304156;
  color: #fff;
}

.logo {
  height: 60px;
  line-height: 60px;
  text-align: center;
  font-size: 20px;
  background-color: #2b3648;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  cursor: pointer;
  transition: background-color 0.3s;
}

.logo:hover {
  background-color: #263445;
}

.logo .el-icon {
  font-size: 24px;
  color: #409EFF;
}

.el-header {
  background-color: #fff;
  border-bottom: 1px solid #ddd;
  display: flex;
  align-items: center;
  justify-content: flex-end;
  padding: 0 20px;
}

.user-info {
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 8px;
}

.el-main {
  background-color: #f0f2f5;
  padding: 20px;
}

.main-content {
  background-color: #fff;
  border-radius: 4px;
  padding: 20px;
  min-height: calc(100vh - 140px);
}

.el-menu {
  border-right: none;
}

.el-menu-item {
  display: flex;
  align-items: center;
  gap: 8px;
}

.el-menu-item.is-active {
  background-color: #263445 !important;
}

.el-menu-item:hover {
  background-color: #263445 !important;
}
</style> 