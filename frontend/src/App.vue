<script setup>
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import { ElConfigProvider } from 'element-plus'
import zhCn from 'element-plus/dist/locale/zh-cn.mjs'
import NavHeader from './components/NavHeader.vue'

const route = useRoute()
const isAdminRoute = computed(() => route.path.startsWith('/admin'))
</script>

<template>
  <el-config-provider :locale="zhCn">
    <div class="app-container">
      <!-- 前台导航站布局 -->
      <template v-if="!isAdminRoute">
        <nav-header />
        <el-main>
          <router-view />
        </el-main>
      </template>
      
      <!-- 管理后台布局通过 Layout.vue 处理 -->
      <template v-else>
        <router-view />
      </template>
    </div>
  </el-config-provider>
</template>

<style>
html, body {
  margin: 0;
  padding: 0;
  height: 100%;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
}

.app-container {
  min-height: 100vh;
  background-color: #f0f2f5;
}

.el-main {
  padding: 20px;
}

/* 全局样式 */
.el-menu--horizontal > .el-menu-item {
  height: 60px;
  line-height: 60px;
}
</style>
