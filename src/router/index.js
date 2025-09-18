import { createRouter, createWebHistory } from 'vue-router';
import Home from '@/views/Home.vue';
import ImageDetail from '@/views/ImageDetail.vue';
import UserProfile from '@/views/UserProfile.vue';
import ImageManagement from '@/views/ImageManagement.vue';
import FolderManagement from '@/views/FolderManagement.vue';
import GroupManagement from '@/views/GroupManagement.vue';
import Login from '@/views/Login.vue';

const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home,
    meta: {
      title: '首页 - 云图库'
    }
  },
  {
    path: '/detail/:id',
    name: 'ImageDetail',
    component: ImageDetail,
    props: true,
    meta: {
      title: '图片详情 - 云图库'
    }
  },
  {
    path: '/profile',
    name: 'UserProfile',
    component: UserProfile,
    meta: {
      title: '个人中心 - 云图库',
      requiresAuth: true
    }
  },
  {
    path: '/image-management',
    name: 'ImageManagement',
    component: ImageManagement,
    meta: {
      title: '图片管理 - 云图库',
      requiresAuth: true
    }
  },
  {
    path: '/folder-management/:folderId?',
    name: 'FolderManagement',
    component: FolderManagement,
    props: true,
    meta: {
      title: '文件夹管理 - 云图库',
      requiresAuth: true
    }
  },
  {
    path: '/group-management/:folderId/:groupId?',
    name: 'GroupManagement',
    component: GroupManagement,
    props: true,
    meta: {
      title: '分组管理 - 云图库',
      requiresAuth: true
    }
  },
  {
    path: '/login',
    name: 'Login',
    component: Login,
    meta: {
      title: '登录 - 云图库'
    }
  },
  {
    path: '/settings',
    name: 'Settings',
    component: Home,
    meta: {
      title: '设置 - 云图库',
      requiresAuth: true
    }
  },
  {
    path: '/category/:category',
    name: 'Category',
    component: Home,
    props: true,
    meta: {
      title: '分类浏览 - 云图库'
    }
  },
  {
    path: '/upload',
    name: 'Upload',
    component: ImageManagement,
    meta: {
      title: '上传图片 - 云图库',
      requiresAuth: true
    }
  }
];

const router = createRouter({
  history: createWebHistory('/cloud-picture/'),
  routes,
  scrollBehavior(to, from, savedPosition) {
    // 始终滚动到顶部
    if (savedPosition) {
      return savedPosition;
    } else {
      return { top: 0 };
    }
  }
});

// 路由守卫：检查需要登录的页面
router.beforeEach((to, from, next) => {
  // 设置页面标题
  if (to.meta && to.meta.title) {
    document.title = to.meta.title;
  }

  const token = localStorage.getItem('token');
  
  // 检查路由是否需要认证
  if (to.matched.some(record => record.meta.requiresAuth)) {
    // 需要登录但未登录
    if (!token) {
      next({
        path: '/login',
        query: { redirect: to.fullPath }
      });
    } else {
      next();
    }
  } else {
    // 不需要认证的路由，直接放行
    next();
  }
});

// 路由后置守卫
router.afterEach((to, from) => {
  // 可以在这里添加页面访问统计等逻辑
  console.log(`导航完成: ${from.path} -> ${to.path}`);
});

export default router;