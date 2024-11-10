import { createRouter, createWebHistory } from 'vue-router'

const routes = [
  {
    path: '/',
    name: 'Home',
    component: () => import('../views/Home.vue')
  },
  {
    path: '/login',
    name: 'Login',
    component: () => import('../views/Login.vue')
  },
  {
    path: '/admin',
    component: () => import('../views/admin/Layout.vue'),
    meta: { requiresAuth: true },
    children: [
      {
        path: '',
        name: 'AdminDashboard',
        component: () => import('../views/admin/Dashboard.vue')
      },
      {
        path: 'dashboard',
        name: 'Dashboard',
        component: () => import('../views/admin/Dashboard.vue')
      },
      {
        path: 'categories',
        name: 'Categories',
        component: () => import('../views/admin/Categories.vue')
      },
      {
        path: 'sites',
        name: 'Sites',
        component: () => import('../views/admin/Sites.vue')
      },
      {
        path: 'settings',
        name: 'Settings',
        component: () => import('../views/admin/Settings.vue')
      }
    ]
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

// 路由守卫
router.beforeEach((to, from, next) => {
  const token = localStorage.getItem('token')
  const user = JSON.parse(localStorage.getItem('user') || '{}')
  
  if (to.matched.some(record => record.meta.requiresAuth)) {
    if (!token) {
      next({
        path: '/login',
        query: { redirect: to.fullPath }
      })
    } else if (to.path.startsWith('/admin') && !user.isAdmin) {
      next('/')
    } else {
      next()
    }
  } else {
    if (to.path === '/login' && token) {
      next('/admin/dashboard')
    } else {
      next()
    }
  }
})

export default router 