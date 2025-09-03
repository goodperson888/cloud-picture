import './assets/main.css'

import { createApp } from 'vue'
import App from './App.vue'
import { createRouter, createWebHistory } from 'vue-router';
import Home from './views/Home.vue';
import ImageDetail from './views/ImageDetail.vue';
import UserProfile from './views/UserProfile.vue';
import ImageManagement from './views/ImageManagement.vue';
import FolderManagement from './views/FolderManagement.vue';
import GroupManagement from './views/GroupManagement.vue';
import Login from './views/Login.vue';
import vLazy from './directives/v-lazy';

const routes = [
  { path: '/', component: Home },
  { path: '/detail/:id', component: ImageDetail, props: true },
  { path: '/profile', component: UserProfile },
  { path: '/image-management', component: ImageManagement },
  { path: '/folder-management/:folderId?', component: FolderManagement, props: true },
  { path: '/group-management/:folderId/:groupId?', component: GroupManagement, props: true },
  { path: '/login', component: Login },
  { path: '/settings', component: Home },
  { path: '/category/:category', component: Home, props: true },
  { path: '/upload', component: ImageManagement },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

// 路由守卫：检查需要登录的页面
router.beforeEach((to, from, next) => {
  const token = localStorage.getItem('token');
  const publicRoutes = ['/login', '/']; // 公开路由
  
  // 如果需要登录的页面且没有token
  if (!publicRoutes.includes(to.path) && !token) {
    next('/login');
  } else {
    next();
  }
});

const app = createApp(App);
app.directive('lazy', vLazy);
app.use(router).mount('#app');
