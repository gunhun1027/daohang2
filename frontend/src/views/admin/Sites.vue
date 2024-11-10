<template>
  <div class="sites">
    <!-- 工具栏 -->
    <div class="toolbar">
      <el-button type="primary" @click="handleAdd">
        <el-icon><Plus /></el-icon>添加网站
      </el-button>
    </div>

    <!-- 网站列表 -->
    <el-table :data="sites" v-loading="loading">
      <el-table-column prop="name" label="网站名称" />
      <el-table-column prop="url" label="网址" />
      <el-table-column prop="category.name" label="所属分类" />
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
        <el-form-item label="网址" prop="url">
          <el-input v-model="form.url" />
        </el-form-item>
        <el-form-item label="分类" prop="category_id">
          <el-select v-model="form.category_id" style="width: 100%">
            <el-option
              v-for="item in categories"
              :key="item.id"
              :label="item.name"
              :value="item.id"
            />
          </el-select>
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

const sites = ref([])
const categories = ref([])
const loading = ref(false)
const dialogVisible = ref(false)
const dialogTitle = ref('')
const formRef = ref(null)

const form = ref({
  name: '',
  url: '',
  category_id: ''
})

const rules = {
  name: [{ required: true, message: '请输入网站名称', trigger: 'blur' }],
  url: [{ required: true, message: '请输入网址', trigger: 'blur' }],
  category_id: [{ required: true, message: '请选择分类', trigger: 'change' }]
}

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

// 获取数据
const fetchData = async () => {
  loading.value = true
  try {
    const [sitesRes, categoriesRes] = await Promise.all([
      api.get('/sites'),
      api.get('/categories')
    ])
    sites.value = sitesRes.data
    categories.value = categoriesRes.data
  } catch (error) {
    ElMessage.error('获取数据失败')
  } finally {
    loading.value = false
  }
}

// 添加网站
const handleAdd = () => {
  form.value = { name: '', url: '', category_id: '' }
  dialogTitle.value = '添加网站'
  dialogVisible.value = true
}

// 编辑网站
const handleEdit = (row) => {
  form.value = { ...row }
  dialogTitle.value = '编辑网站'
  dialogVisible.value = true
}

// 删除网站
const handleDelete = async (row) => {
  try {
    await ElMessageBox.confirm('确定要删除该网站吗？')
    await api.delete(`/sites/${row.id}`)
    ElMessage.success('删除成功')
    fetchData()
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
      await api.put(`/sites/${form.value.id}`, form.value)
    } else {
      await api.post('/sites', form.value)
    }
    ElMessage.success('保存成功')
    dialogVisible.value = false
    fetchData()
  } catch (error) {
    ElMessage.error('保存失败')
  }
}

onMounted(() => {
  fetchData()
})
</script>

<style scoped>
.sites {
  padding: 20px;
}

.toolbar {
  margin-bottom: 20px;
}
</style> 