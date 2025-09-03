<template>
  <div class="image-detail">
    <!-- 头部信息 -->
    <div class="detail-header">
      <button class="back-button" @click="goBack">
        <span class="back-icon">←</span>
        返回
      </button>
      <div class="header-content">
        <h1 class="detail-title">{{ imageData.title }}</h1>
        <p class="detail-description">{{ imageData.description }}</p>
        <!-- <div class="image-meta">
          <span class="meta-item">
            <span class="meta-label">分类：</span>
            {{ imageData.categoryName }}
          </span>
          <span class="meta-item">
            <span class="meta-label">标签：</span>
            <span v-for="tag in imageData.tags" :key="tag" class="tag">
              {{ tag }}
            </span>
          </span>
        </div> -->
      </div>
    </div>

    <!-- 瀑布流图片展示 -->
    <div class="waterfall-container">
      <div class="waterfall-grid" ref="waterfallGrid">
        <div 
          v-for="(img, index) in detailImages" 
          :key="index"
          class="waterfall-item"
          :class="{ 'loaded': img.loaded }"
        >
          <img 
            :src="img.url" 
            :alt="`图片 ${index + 1}`"
            class="waterfall-image"
            @load="onImageLoad(index)"
            @error="onImageError(index)"
            loading="lazy"
          >
          <div class="image-overlay">
            <button class="zoom-button" @click="openImage(img.url)">
              🔍 查看大图
            </button>
          </div>
        </div>
      </div>
      
      <div v-if="loading" class="loading-state">
        <div class="loading-spinner"></div>
        <p>加载中...</p>
      </div>
    </div>

    <!-- 大图查看器 -->
    <div v-if="showImageViewer" class="image-viewer" @click="closeImage">
      <img :src="currentImage" class="viewer-image" @click.stop>
      <button class="viewer-close" @click="closeImage">×</button>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { useRouter, useRoute } from 'vue-router';

const router = useRouter();
const route = useRoute();

// 状态管理
const imageData = ref({
  title: '',
  description: '',
  categoryName: '',
  tags: []
});

const detailImages = ref([]);
const loading = ref(true);
const showImageViewer = ref(false);
const currentImage = ref('');

// 模拟图片数据 - 使用多个可靠图片源
const mockImageData = {
  1: {
    title: '山间小路',
    description: '一条蜿蜒的小路，通向远方的山峦。清晨的阳光洒在山间，雾气缭绕，宛如仙境。这是我在旅行中偶然发现的秘境，远离喧嚣，只有大自然的宁静与美丽。',
    categoryName: '风光摄影',
    tags: ['自然', '山脉', '清晨', '宁静'],
    images: [
      'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=600&fit=crop',
      'https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=400&h=500&fit=crop',
      'https://images.unsplash.com/photo-1426604966848-d7adac402bff?w=400&h=700&fit=crop',
      'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=400&h=450&fit=crop',
      'https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?w=400&h=550&fit=crop',
      'https://images.unsplash.com/photo-1447752875215-b2761acb3c5d?w=400&h=650&fit=crop',
      'https://images.unsplash.com/photo-1501785888041-af3ef285b470?w=400&h=500&fit=crop',
      'https://images.unsplash.com/photo-1472214103451-9374bd1c798e?w=400&h=600&fit=crop'
    ]
  },
  2: {
    title: '湖光山色',
    description: '宁静的湖面，倒映着美丽的群山。夕阳西下，金色的阳光洒在湖面上，波光粼粼，美不胜收。这是大自然赐予我们的绝美画卷。',
    categoryName: '风光摄影',
    tags: ['湖泊', '倒影', '夕阳', '金色'],
    images: [
      'https://images.unsplash.com/photo-1505144808419-1957a94ca61e?w=400&h=550&fit=crop',
      'https://images.unsplash.com/photo-1439066615861-d1af74d74000?w=400&h=600&fit=crop',
      'https://images.unsplash.com/photo-1501785888041-af3ef285b470?w=400&h=450&fit=crop',
      'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=400&h=700&fit=crop',
      'https://images.unsplash.com/photo-1426604966848-d7adac402bff?w=400&h=500&fit=crop',
      'https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=400&h=650&fit=crop'
    ]
  },
  3: {
    title: '城市夜景',
    description: '灯火辉煌的城市，夜晚的魅力。高楼大厦的霓虹灯光与车流的光轨交相辉映，展现出现代都市的繁华与活力。',
    categoryName: '商业摄影',
    tags: ['城市', '夜景', '霓虹', '繁华'],
    images: [
      'https://images.unsplash.com/photo-1449824913935-59a10b8d2000?w=400&h=500&fit=crop',
      'https://images.unsplash.com/photo-1519501025264-65ba15a82390?w=400&h=600&fit=crop',
      'https://images.unsplash.com/photo-1477959858617-67f85cf4f1df?w=400&h=550&fit=crop',
      'https://images.unsplash.com/photo-1493246507139-91e8fad9978e?w=400&h=450&fit=crop',
      'https://images.unsplash.com/photo-1444723121867-7a241cacace9?w=400&h=650&fit=crop'
    ]
  }
};

// 计算属性
const imageId = computed(() => parseInt(route.params.id));

// 方法
const loadImageData = () => {
  console.log('Loading image data for ID:', imageId.value);
  console.log('Available IDs:', Object.keys(mockImageData));
  console.log('Current route params:', route.params);
  
  const data = mockImageData[imageId.value];
  if (data && data.images && Array.isArray(data.images)) {
    console.log('Found data with images:', data);
    imageData.value = data;
    detailImages.value = data.images.map(url => ({
      url: url || '',
      loaded: false
    })).filter(item => item.url);
  } else {
    console.warn('No data found for ID:', imageId.value, 'or images array is invalid');
    // 默认数据，防止页面空白
    imageData.value = {
      title: '默认图集',
      description: '这是默认的图集描述',
      categoryName: '默认分类',
      tags: ['默认'],
      images: [
        'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=600&fit=crop',
        'https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=400&h=500&fit=crop'
      ]
    };
    detailImages.value = imageData.value.images.map(url => ({
      url: url || '',
      loaded: false
    }));
  }
  
  console.log('Final detailImages:', detailImages.value);
  loading.value = false;
};

const goBack = () => {
  router.push('/');
};

const onImageLoad = (index) => {
  detailImages.value[index].loaded = true;
};

const onImageError = (index) => {
  // 使用多个备用图片源
  const backupUrls = [
    'https://via.placeholder.com/400x500/667eea/ffffff?text=Image+Not+Found',
    'https://placehold.co/400x500/764ba2/ffffff?text=Photo',
    'https://fakeimg.pl/400x500/667eea/ffffff?text=Picture'
  ];
  const randomBackup = backupUrls[Math.floor(Math.random() * backupUrls.length)];
  detailImages.value[index].url = randomBackup;
  detailImages.value[index].loaded = true;
};

const openImage = (url) => {
  currentImage.value = url;
  showImageViewer.value = true;
};

const closeImage = () => {
  showImageViewer.value = false;
  currentImage.value = '';
};

// 生命周期
onMounted(() => {
  loadImageData();
});
</script>

<style scoped>
.image-detail {
  min-height: 100vh;
  background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
  padding: 20px;
}

.detail-header {
  max-width: 1200px;
  margin: 0 auto 30px;
  background: white;
  border-radius: 15px;
  padding: 30px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
}

.back-button {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border: none;
  padding: 12px 20px;
  border-radius: 25px;
  cursor: pointer;
  font-size: 14px;
  font-weight: 500;
  margin-bottom: 20px;
  transition: all 0.3s ease;
}

.back-button:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(102, 126, 234, 0.3);
}

.back-icon {
  font-size: 16px;
}

.header-content {
  text-align: center;
}

.detail-title {
  font-size: 2.5em;
  font-weight: 700;
  color: #333;
  margin: 0 0 15px 0;
  line-height: 1.2;
}

.detail-description {
  font-size: 1.2em;
  color: #666;
  line-height: 1.6;
  margin: 0 0 20px 0;
  max-width: 800px;
  margin-left: auto;
  margin-right: auto;
}

.image-meta {
  display: flex;
  justify-content: center;
  gap: 30px;
  flex-wrap: wrap;
}

.meta-item {
  display: flex;
  align-items: center;
  gap: 5px;
  font-size: 1em;
  color: #555;
}

.meta-label {
  font-weight: 600;
  color: #333;
}

.tag {
  background: #f0f0f0;
  color: #666;
  padding: 4px 8px;
  border-radius: 12px;
  font-size: 0.9em;
  margin-right: 4px;
}

.waterfall-container {
  max-width: 1200px;
  margin: 0 auto;
}

.waterfall-grid {
  column-count: 4;
  column-gap: 20px;
  padding: 0 20px;
}

.waterfall-item {
  break-inside: avoid;
  margin-bottom: 20px;
  position: relative;
  border-radius: 12px;
  overflow: hidden;
  background: white;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
  transition: all 0.3s ease;
  opacity: 0;
  transform: translateY(20px);
}

.waterfall-item.loaded {
  opacity: 1;
  transform: translateY(0);
}

.waterfall-item:hover {
  transform: translateY(-5px);
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.15);
}

.waterfall-image {
  width: 100%;
  height: auto;
  display: block;
  transition: transform 0.3s ease;
}

.waterfall-item:hover .waterfall-image {
  transform: scale(1.05);
}

.image-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(135deg, rgba(0, 0, 0, 0.7), rgba(0, 0, 0, 0.3));
  display: flex;
  align-items: center;
  justify-content: center;
  opacity: 0;
  transition: opacity 0.3s ease;
}

.waterfall-item:hover .image-overlay {
  opacity: 1;
}

.zoom-button {
  background: white;
  color: #333;
  border: none;
  padding: 12px 20px;
  border-radius: 25px;
  cursor: pointer;
  font-size: 14px;
  font-weight: 500;
  transition: all 0.3s ease;
}

.zoom-button:hover {
  transform: scale(1.1);
}

.loading-state {
  text-align: center;
  padding: 60px 20px;
  color: #666;
}

.loading-spinner {
  width: 40px;
  height: 40px;
  border: 4px solid #f0f0f0;
  border-top: 4px solid #667eea;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin: 0 auto 20px;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

.image-viewer {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.9);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  cursor: pointer;
}

.viewer-image {
  max-width: 90%;
  max-height: 90%;
  border-radius: 8px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.5);
}

.viewer-close {
  position: absolute;
  top: 20px;
  right: 20px;
  background: rgba(255, 255, 255, 0.2);
  color: white;
  border: none;
  width: 40px;
  height: 40px;
  border-radius: 50%;
  font-size: 24px;
  cursor: pointer;
  transition: all 0.3s ease;
}

.viewer-close:hover {
  background: rgba(255, 255, 255, 0.3);
  transform: scale(1.1);
}

/* 响应式设计 */
@media (max-width: 1200px) {
  .waterfall-grid {
    column-count: 3;
  }
}

@media (max-width: 768px) {
  .waterfall-grid {
    column-count: 2;
    column-gap: 15px;
    padding: 0 15px;
  }
  
  .detail-title {
    font-size: 2em;
  }
  
  .detail-description {
    font-size: 1.1em;
  }
  
  .image-meta {
    flex-direction: column;
    align-items: center;
    gap: 15px;
  }
}

@media (max-width: 480px) {
  .waterfall-grid {
    column-count: 1;
    column-gap: 15px;
  }
  
  .detail-header {
    padding: 20px;
  }
  
  .detail-title {
    font-size: 1.8em;
  }
  
  .image-detail {
    padding: 10px;
  }
}
</style>