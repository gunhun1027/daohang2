<template>
  <div class="settings">
    <el-card>
      <template #header>
        <div class="card-header">
          <span>系统设置</span>
        </div>
      </template>
      
      <el-form :model="form" label-width="120px">
        <el-form-item label="网站标题">
          <el-input v-model="form.siteTitle" />
        </el-form-item>
        
        <el-form-item label="网站描述">
          <el-input type="textarea" v-model="form.siteDescription" rows="3" />
        </el-form-item>
        
        <el-form-item label="每页显示数量">
          <el-input-number v-model="form.pageSize" :min="10" :max="100" />
        </el-form-item>
        
        <el-form-item label="开启访问统计">
          <el-switch v-model="form.enableStats" />
        </el-form-item>
        
        <el-form-item>
          <el-button type="primary" @click="handleSave">保存设置</el-button>
        </el-form-item>
      </el-form>
    </el-card>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { ElMessage } from 'element-plus'
import api from '@/api/config'

const form = ref({
  siteTitle: '导航网站',
  siteDescription: '',
  pageSize: 20,
  enableStats: true
})

const handleSave = async () => {
  try {
    await api.post('/settings', form.value)
    ElMessage.success('保存成功')
  } catch (error) {
    ElMessage.error('保存失败')
  }
}
</script>

<style scoped>
.settings {
  max-width: 800px;
  margin: 0 auto;
}
</style> 