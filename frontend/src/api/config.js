import axios from 'axios'

// 创建 axios 实例
const api = axios.create({
  baseURL: 'http://localhost:3000/api',  // 确保这个端口号与后端一致
  timeout: 5000,
  headers: {
    'Content-Type': 'application/json'
  }
});

// 请求拦截器
api.interceptors.request.use(
  config => {
    const token = localStorage.getItem('token')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  error => {
    console.error('Request error:', error)
    return Promise.reject(error)
  }
)

// 响应拦截器
api.interceptors.response.use(
  response => response,
  error => {
    console.error('Response error:', error)
    return Promise.reject(error)
  }
)

export default api 