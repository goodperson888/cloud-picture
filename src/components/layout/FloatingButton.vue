<template>
  <div class="floating-button-container">
    <button class="floating-button" @click="toggleMenu">
      <slot name="icon">+</slot>
    </button>
    <div v-if="showMenu" class="menu-overlay" @click.self="toggleMenu"></div>
    <transition name="slide-fade">
      <div v-if="showMenu" class="floating-menu">
        <slot name="menu-items">
          <ul>
            <li><a href="#" @click.prevent="checkAuthAndNavigate('/profile')">个人中心</a></li>
            <li><a href="#" @click.prevent="checkAuthAndNavigate('/image-management')">图片管理</a></li>
            <li><a href="#" @click.prevent="checkAuthAndNavigate('/settings')">设置</a></li>
            <li><a href="#" @click.prevent="handleLogout">退出登录</a></li>
          </ul>
        </slot>
      </div>
    </transition>
  </div>
</template>

<script setup>
import { ref, watch } from 'vue';
import { useRouter } from 'vue-router';

const router = useRouter();
const showMenu = ref(false);

const toggleMenu = () => {
  showMenu.value = !showMenu.value;
};

const checkAuthAndNavigate = (route) => {
  const token = localStorage.getItem('token');
  if (!token) {
    router.push('/login');
  } else {
    router.push(route);
  }
  showMenu.value = false;
};

const handleLogout = () => {
  localStorage.removeItem('token');
  localStorage.removeItem('userInfo');
  router.push('/login');
  showMenu.value = false;
};

// 路由变化时自动关闭菜单
watch(() => router.currentRoute.value, () => {
  showMenu.value = false;
});
</script>

<style scoped>
.floating-button-container {
  position: fixed;
  bottom: 20px;
  right: 20px;
  z-index: 1000;
}

.floating-button {
  width: 60px;
  height: 60px;
  border-radius: 50%;
  background-color: #007bff;
  color: white;
  font-size: 2em;
  border: none;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
  cursor: pointer;
  display: flex;
  justify-content: center;
  align-items: center;
  transition: background-color 0.3s ease;
}

.floating-button:hover {
  background-color: #0056b3;
}

.menu-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.3);
  z-index: 999;
}

.floating-menu {
  position: absolute;
  bottom: 80px; /* Adjust based on button size */
  right: 0;
  background-color: white;
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  padding: 10px 0;
  min-width: 150px;
  z-index: 1001;
}

.floating-menu ul {
  list-style: none;
  padding: 0;
  margin: 0;
}

.floating-menu li a {
  display: block;
  padding: 12px 20px;
  color: #333;
  text-decoration: none;
  transition: background-color 0.2s ease;
  font-size: 14px;
  line-height: 1.4;
}

.floating-menu li a:hover {
  background-color: #f8f9fa;
  color: #007bff;
}

/* Transition styles */
.slide-fade-enter-active,
.slide-fade-leave-active {
  transition: all 0.3s ease-out;
}

.slide-fade-enter-from,
.slide-fade-leave-to {
  transform: translateY(20px);
  opacity: 0;
}
</style>