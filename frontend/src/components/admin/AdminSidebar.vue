<template>
  <el-menu
    :default-active="route.path"
    class="admin-sidebar"
    background-color="#001529"
    text-color="rgba(255,255,255,0.65)"
    active-text-color="#fff"
    :collapse="isCollapse"
    router
  >
    <el-menu-item index="/admin/dashboard">
      <el-icon><DataLine /></el-icon>
      <template #title>仪表盘</template>
    </el-menu-item>
    
    <el-menu-item index="/admin/categories">
      <el-icon><Grid /></el-icon>
      <template #title>分类管理</template>
    </el-menu-item>
    
    <el-menu-item index="/admin/sites">
      <el-icon><Link /></el-icon>
      <template #title>网站管理</template>
    </el-menu-item>

    <el-menu-item index="/admin/settings">
      <el-icon><Setting /></el-icon>
      <template #title>系统设置</template>
    </el-menu-item>
  </el-menu>
</template>

<script setup>
import { ref } from 'vue'
import { useRoute } from 'vue-router'
import { DataLine, Grid, Link, Setting } from '@element-plus/icons-vue'

const route = useRoute()
const isCollapse = ref(false)
</script>

<style scoped>
.admin-sidebar {
  height: calc(100vh - 60px);
  border-right: none;
}

.el-menu {
  border-right: none !important;
}

.el-menu-item {
  display: flex;
  align-items: center;
  height: 50px;
  padding: 0 20px !important;
  margin: 4px 0;
}

.el-menu-item.is-active {
  background-color: #1890ff !important;
}

.el-menu-item:hover {
  background-color: #1890ff !important;
  color: #fff !important;
}

.el-icon {
  font-size: 18px;
  margin-right: 10px;
}

:deep(.el-menu-item) {
  border-radius: 0 24px 24px 0;
  margin: 4px 16px 4px 0;
}
</style> 