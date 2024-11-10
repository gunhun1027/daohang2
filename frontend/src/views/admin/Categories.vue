<template>
  <div class="categories">
    <!-- 工具栏 -->
    <div class="toolbar">
      <el-button type="primary" @click="handleAdd">
        <el-icon><Plus /></el-icon>添加分类
      </el-button>
    </div>

    <!-- 分类列表 -->
    <el-table :data="categories" v-loading="loading">
      <el-table-column prop="name" label="分类名称" />
      <el-table-column prop="description" label="描述" />
      <el-table-column prop="created_at" label="创建时间">
        <template #default="{ row }">
          {{ formatDate(row.created_at) }}
        </template>
      </el-table-column>
      <el-table-column label="操作" width="200">
        <template #default="{ row }">
          <el-button-group>
            <el-button type="primary" @click="handleEdit(row)">编辑</el-button>
            <el-button type="danger" @click="handleDelete(row)">删除</el-button>
          </el-button-group>
        </template>
      </el-table-column>
    </el-table>

    <!-- 添加/编辑对话框 -->
    <el-dialog
      :title="dialogTitle"
      v-model="dialogVisible"
      width="500px"
    >
      <el-form :model="form" :rules="rules" ref="formRef" label-width="80px">
        <el-form-item label="名称" prop="name">
          <el-input v-model="form.name" />
        </el-form-item>
        <el-form-item label="描述">
          <el-input type="textarea" v-model="form.description" rows="3" />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="dialogVisible = false">取消</el-button>
        <el-button type="primary" @click="handleSubmit">确定</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { Plus } from '@element-plus/icons-vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import api from '@/api/config'

const categories = ref([])
const loading = ref(false)
const dialogVisible = ref(false)
const dialogTitle = ref('')
const formRef = ref(null)

const form = ref({
  name: '',
  description: ''
})

const rules = {
  name: [
    { required: true, message: '请输入分类名称', trigger: 'blur' }
  ]
}

// 添加格式化日期函数
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

// 获取分类列表
const fetchCategories = async () => {
  loading.value = true
  try {
    const res = await api.get('/categories')
    categories.value = res.data
  } catch (error) {
    ElMessage.error('获取分类列表失败')
  } finally {
    loading.value = false
  }
}

// 添加分类
const handleAdd = () => {
  form.value = { name: '', description: '' }
  dialogTitle.value = '添加分类'
  dialogVisible.value = true
}

// 编辑分类
const handleEdit = (row) => {
  form.value = { ...row }
  dialogTitle.value = '编辑分类'
  dialogVisible.value = true
}

// 删除分类
const handleDelete = async (row) => {
  try {
    await ElMessageBox.confirm('确定要删除该分类吗？')
    await api.delete(`/categories/${row.id}`)
    ElMessage.success('删除成功')
    fetchCategories()
  } catch (error) {
    if (error !== 'cancel') {
      ElMessage.error('删除失败')
    }
  }
}

// 提交表单
const handleSubmit = async () => {
  if (!formRef.value) return
  
  try {
    await formRef.value.validate()
    if (form.value.id) {
      await api.put(`/categories/${form.value.id}`, form.value)
    } else {
      await api.post('/categories', form.value)
    }
    ElMessage.success('保存成功')
    dialogVisible.value = false
    fetchCategories()
  } catch (error) {
    ElMessage.error('保存失败')
  }
}

onMounted(() => {
  fetchCategories()
})
</script>

<style scoped>
.categories {
  padding: 20px;
}

.toolbar {
  margin-bottom: 20px;
}
</style>
