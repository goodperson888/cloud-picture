<template>
  <div class="user-profile">
    <!-- 用户信息头部 -->
    <div class="profile-header">
      <div class="avatar-container">
        <img src="https://picsum.photos/150/150?random=profile" alt="用户头像" class="avatar">
        <button class="edit-avatar" @click="editAvatar">📷</button>
      </div>
      <div class="user-info">
        <h1 class="username">{{ userInfo.username }}</h1>
        <p class="user-bio">{{ userInfo.bio }}</p>
        <div class="user-stats">
          <div class="stat-item">
            <span class="stat-number">{{ userInfo.totalImages }}</span>
            <span class="stat-label">总图片</span>
          </div>
          <div class="stat-item">
            <span class="stat-number">{{ userInfo.totalAlbums }}</span>
            <span class="stat-label">相册数</span>
          </div>
          <div class="stat-item">
            <span class="stat-number">{{ userInfo.totalViews }}</span>
            <span class="stat-label">浏览量</span>
          </div>
        </div>
      </div>
    </div>

    <!-- 功能菜单 -->
    <div class="profile-menu">
      <div class="menu-grid">
        <div class="menu-item" @click="goToImageManagement">
          <div class="menu-icon">📁</div>
          <h3>图片管理</h3>
          <p>管理您的图片文件夹和相册</p>
        </div>
        
        <div class="menu-item" @click="goToSettings">
          <div class="menu-icon">⚙️</div>
          <h3>账号设置</h3>
          <p>修改个人信息和偏好设置</p>
        </div>
        
        <div class="menu-item" @click="goToFavorites">
          <div class="menu-icon">⭐</div>
          <h3>我的收藏</h3>
          <p>查看您收藏的图片</p>
        </div>
        
        <div class="menu-item" @click="goToUpload">
          <div class="menu-icon">📤</div>
          <h3>上传图片</h3>
          <p>上传新的图片到您的相册</p>
        </div>
      </div>
    </div>

    <!-- 最近活动 -->
    <div class="recent-activity">
      <h2 class="section-title">最近活动</h2>
      <div class="activity-list">
        <div v-for="activity in recentActivities" :key="activity.id" class="activity-item">
          <div class="activity-icon">{{ activity.icon }}</div>
          <div class="activity-content">
            <p class="activity-text">{{ activity.text }}</p>
            <span class="activity-time">{{ activity.time }}</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';

const router = useRouter();

// 用户信息
const userInfo = ref({
  username: '摄影爱好者',
  bio: '热爱摄影，记录生活中的美好瞬间。喜欢自然风光和人文纪实摄影。',
  totalImages: 256,
  totalAlbums: 12,
  totalViews: '1.2k'
});

// 导航方法
const goToImageManagement = () => {
  router.push('/image-management');
};

const goToSettings = () => {
  router.push('/settings');
};

const goToFavorites = () => {
  router.push('/category/favorites');
};

const goToUpload = () => {
  router.push('/upload');
};

const editAvatar = () => {
  alert('头像编辑功能开发中...');
};

// 最近活动
const recentActivities = ref([
  { id: 1, icon: '📤', text: '上传了12张新图片到"城市风光"相册', time: '2小时前' },
  { id: 2, icon: '📁', text: '创建了新的相册"春日踏青"', time: '1天前' },
  { id: 3, icon: '⭐', text: '收藏了5张喜欢的图片', time: '2天前' },
  { id: 4, icon: '👁️', text: '浏览了"人像摄影"分类', time: '3天前' }
]);
</script>

<style scoped>
.user-profile {
  padding: 20px;
  max-width: 960px;
  margin: 0 auto;
  font-family: 'Arial', sans-serif;
  background-color: #f5f5f5;
  min-height: 100vh;
}

/* 用户信息头部 */
.profile-header {
  display: flex;
  align-items: center;
  background: white;
  padding: 30px;
  border-radius: 12px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  margin-bottom: 30px;
}

.avatar-container {
  position: relative;
  margin-right: 30px;
}

.avatar {
  width: 120px;
  height: 120px;
  border-radius: 50%;
  object-fit: cover;
  border: 3px solid #007bff;
}

.edit-avatar {
  position: absolute;
  bottom: 5px;
  right: 5px;
  width: 30px;
  height: 30px;
  border-radius: 50%;
  background: #007bff;
  color: white;
  border: none;
  cursor: pointer;
  font-size: 14px;
}

.user-info {
  flex: 1;
}

.username {
  font-size: 2em;
  color: #333;
  margin: 0 0 10px 0;
}

.user-bio {
  color: #666;
  font-size: 1.1em;
  margin-bottom: 20px;
  line-height: 1.5;
}

.user-stats {
  display: flex;
  gap: 30px;
}

.stat-item {
  text-align: center;
}

.stat-number {
  display: block;
  font-size: 1.5em;
  font-weight: bold;
  color: #007bff;
}

.stat-label {
  font-size: 0.9em;
  color: #666;
}

/* 功能菜单 */
.profile-menu {
  margin-bottom: 30px;
}

.menu-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
  gap: 20px;
}

.menu-item {
  background: white;
  padding: 25px;
  border-radius: 12px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  text-align: center;
  cursor: pointer;
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.menu-item:hover {
  transform: translateY(-5px);
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
}

.menu-icon {
  font-size: 2.5em;
  margin-bottom: 15px;
}

.menu-item h3 {
  font-size: 1.3em;
  color: #333;
  margin: 0 0 10px 0;
}

.menu-item p {
  color: #666;
  font-size: 0.9em;
  margin: 0;
}

/* 最近活动 */
.recent-activity {
  background: white;
  padding: 30px;
  border-radius: 12px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
}

.section-title {
  font-size: 1.8em;
  color: #333;
  margin: 0 0 20px 0;
}

.activity-list {
  display: flex;
  flex-direction: column;
  gap: 15px;
}

.activity-item {
  display: flex;
  align-items: center;
  padding: 15px;
  background: #f8f9fa;
  border-radius: 8px;
}

.activity-icon {
  font-size: 1.5em;
  margin-right: 15px;
}

.activity-content {
  flex: 1;
}

.activity-text {
  margin: 0 0 5px 0;
  color: #333;
}

.activity-time {
  font-size: 0.9em;
  color: #666;
}

@media (max-width: 768px) {
  .profile-header {
    flex-direction: column;
    text-align: center;
  }
  
  .avatar-container {
    margin-right: 0;
    margin-bottom: 20px;
  }
  
  .user-stats {
    justify-content: center;
  }
  
  .menu-grid {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 480px) {
  .user-profile {
    padding: 10px;
  }
  
  .profile-header,
  .recent-activity {
    padding: 20px;
  }
  
  .menu-item {
    padding: 20px;
  }
}
</style>