<template>
  <div id="app">
    <!-- <header class="app-header">
      <div class="header-content">
        <h1 class="studio-title">摄影工作室</h1>
        <nav class="main-nav">
          <router-link to="/" class="nav-link">首页</router-link>
          <router-link to="/login" class="nav-link">登录</router-link>
          <router-link to="/upload" class="nav-link">上传</router-link>
        </nav>
      </div>
    </header> -->
    
    <!-- 路由视图，用于显示当前路由对应的组件 -->
    <RouterView />
    
    <footer class="app-footer">
      <p>© 2023 摄影工作室. All rights reserved.</p>
      <p>服务地区: 全国</p>
      <p>联系方式: 123-456-7890 | info@example.com</p>
    </footer>
  </div>
  
  <FloatingButton>
    <template #icon>
      <span>☰</span>
    </template>
    <template #menu-items>
      <ul>
        <li><router-link to="/profile">个人中心</router-link></li>
        <li><router-link to="/settings">设置</router-link></li>
        <li><router-link to="/logout">退出</router-link></li>
      </ul>
    </template>
  </FloatingButton>
</template>

<script setup>
import { RouterLink, RouterView } from 'vue-router';
import Carousel from './components/common/Carousel.vue';
import CategoryNav from './components/common/CategoryNav.vue';
import ImageGallery from './components/features/ImageGallery.vue';
import FloatingButton from './components/layout/FloatingButton.vue';
</script>

<style scoped>
.app-header {
  padding: 20px 16px 10px 16px;
  text-align: center;
  background: linear-gradient(135deg, #f6d365 0%, #fda085 100%);
  color: #fff;
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
  border-bottom-left-radius: 15px;
  border-bottom-right-radius: 15px;
}
.header-content {
  display: flex;
  justify-content: space-between;
  align-items: center;
  max-width: 1200px;
  margin: 0 auto;
}
.studio-title {
  font-size: 2.2rem;
  font-weight: bold;
  margin-bottom: 10px;
  text-shadow: 1px 1px 2px rgba(0,0,0,0.1);
}
.main-nav .nav-link {
  color: #fff;
  text-decoration: none;
  margin-left: 20px;
  font-size: 1.1rem;
  transition: color 0.3s ease;
}
.main-nav .nav-link:hover {
  color: #eee;
}
.app-footer {
  background: linear-gradient(135deg, #f0f0f0, #e0e0e0);
  color: #555;
  text-align: center;
  padding: 20px;
  font-size: 0.9rem;
  border-top: 1px solid #ddd;
  margin-top: 40px;
}
.app-footer p {
  margin: 5px 0;
}
@media (max-width: 768px) {
  .header-content {
    flex-direction: column;
  }
  .main-nav {
    margin-top: 10px;
  }
  .main-nav .nav-link {
    margin: 0 10px;
  }
}
@media (max-width: 480px) {
  .studio-header {
    padding: 15px 10px 8px 10px;
  }
  .studio-title {
    font-size: 1.8rem;
  }
  .studio-contact {
    gap: 10px;
  }
  .contact-btn {
    padding: 5px 12px;
    font-size: 0.85rem;
  }
  .category-nav {
    gap: 8px;
    margin: 15px 0;
    padding: 0 5px;
  }
  .category-tag {
    padding: 4px 12px;
    font-size: 0.85rem;
  }
  .works-section {
    gap: 20px;
    padding: 0 10px;
  }
  .work-card {
    padding: 12px;
    border-radius: 12px;
  }
  .work-img {
    border-radius: 10px;
  }
  .work-desc {
    font-size: 1rem;
  }
  .work-tags {
    font-size: 0.75rem;
  }
  .studio-footer {
    padding: 10px 0;
  }
  .footer-btn {
    padding: 7px 18px;
    font-size: 0.9rem;
  }
}
</style>
