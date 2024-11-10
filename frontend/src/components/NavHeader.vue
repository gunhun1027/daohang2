<template>
  <div class="nav-header">
    <div class="logo">
      <h1>导航网站</h1>
    </div>
    <div class="nav-menu">
      <el-menu mode="horizontal" router>
        <el-menu-item index="/">首页</el-menu-item>
        <el-menu-item index="/categories">分类</el-menu-item>
        <el-menu-item v-if="isAdmin" index="/admin">管理后台</el-menu-item>
        <el-menu-item v-if="!isLoggedIn" index="/login">登录</el-menu-item>
        <el-menu-item v-else @click="handleLogout">退出</el-menu-item>
      </el-menu>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()
const isLoggedIn = ref(false)
const isAdmin = ref(false)

// 检查登录状态
const checkLoginStatus = () => {
  const token = localStorage.getItem('token')
  const user = JSON.parse(localStorage.getItem('user') || '{}')
  
  isLoggedIn.value = !!token
  isAdmin.value = user.isAdmin
}

const handleLogout = () => {
  localStorage.removeItem('token')
  localStorage.removeItem('user')
  isLoggedIn.value = false
  isAdmin.value = false
  router.push('/')
}

onMounted(() => {
  checkLoginStatus()
})
</script>

<style scoped>
.nav-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 20px;
  background: #fff;
  box-shadow: 0 1px 4px rgba(0,21,41,.08);
}

.logo h1 {
  margin: 0;
  font-size: 24px;
  color: #409EFF;
}

.nav-menu {
  flex: 1;
  display: flex;
  justify-content: flex-end;
}

:deep(.el-menu) {
  border-bottom: none;
}

:deep(.el-menu-item) {
  font-size: 14px;
}
</style> 