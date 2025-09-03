<template>
  <div class="image-gallery">
    <div class="gallery-header" v-if="title || subtitle">
      <h2 class="gallery-title">{{ title }}</h2>
      <p class="gallery-subtitle" v-if="subtitle">{{ subtitle }}</p>
    </div>
    
    <div class="gallery-grid">
      <div 
        v-for="image in images" 
        :key="image.id" 
        class="gallery-item"
        @click="handleImageClick(image)"
      >
        <div class="image-container">
          <img 
            v-lazy="image.url" 
            :alt="image.title" 
            class="gallery-image"
            @error="handleImageError"
          >
          <div class="image-overlay">
            <div class="overlay-content">
              <span class="view-icon">👁️</span>
              <span class="view-text">查看详情</span>
            </div>
          </div>
        </div>
        
        <div class="gallery-info">
          <h3 class="image-title">{{ image.title }}</h3>
          <p class="image-description">{{ image.description }}</p>
          <!-- <div class="image-meta" v-if="image.tags">
            <span 
              v-for="tag in image.tags" 
              :key="tag"
              class="image-tag"
            >
              {{ tag }}
            </span>
          </div> -->
        </div>
      </div>
    </div>
    
    <div v-if="images.length === 0" class="empty-state">
      <div class="empty-icon">📷</div>
      <h3>暂无图片</h3>
      <p>该分类下还没有图片，敬请期待</p>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue';

const props = defineProps({
  images: {
    type: Array,
    required: true,
    default: () => []
  },
  title: {
    type: String,
    default: ''
  },
  subtitle: {
    type: String,
    default: ''
  }
});

const emit = defineEmits(['image-click']);

// 处理图片点击
const handleImageClick = (image) => {
  emit('image-click', image);
};

// 处理图片加载错误
const handleImageError = (event) => {
  event.target.src = 'https://picsum.photos/300/200?random=' + Math.floor(Math.random() * 1000);
};

// 计算属性
const hasImages = computed(() => props.images && props.images.length > 0);
</script>

<style scoped>
.image-gallery {
  padding: 20px;
  max-width: 1200px;
  margin: 0 auto;
}

.gallery-header {
  text-align: center;
  margin-bottom: 30px;
}

.gallery-title {
  font-size: 2em;
  color: #333;
  margin: 0 0 10px 0;
  font-weight: 600;
}

.gallery-subtitle {
  font-size: 1.1em;
  color: #666;
  margin: 0;
}

.gallery-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 25px;
}

.gallery-item {
  background: white;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
  transition: all 0.3s ease;
  cursor: pointer;
}

.gallery-item:hover {
  transform: translateY(-8px);
  box-shadow: 0 12px 24px rgba(0, 0, 0, 0.15);
}

.image-container {
  position: relative;
  width: 100%;
  height: 200px;
  overflow: hidden;
}

.gallery-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.3s ease;
}

.gallery-item:hover .gallery-image {
  transform: scale(1.1);
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

.gallery-item:hover .image-overlay {
  opacity: 1;
}

.overlay-content {
  text-align: center;
  color: white;
}

.view-icon {
  display: block;
  font-size: 2em;
  margin-bottom: 8px;
}

.view-text {
  display: block;
  font-size: 0.9em;
  font-weight: 500;
}

.gallery-info {
  padding: 20px;
}

.image-title {
  margin: 0 0 8px 0;
  font-size: 1.3em;
  font-weight: 600;
  color: #333;
  line-height: 1.3;
}

.image-description {
  margin: 0 0 12px 0;
  color: #666;
  font-size: 0.95em;
  line-height: 1.5;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.image-meta {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
}

.image-tag {
  background: #f0f0f0;
  color: #666;
  padding: 4px 8px;
  border-radius: 12px;
  font-size: 0.8em;
  font-weight: 500;
}

.empty-state {
  text-align: center;
  padding: 60px 20px;
  color: #999;
}

.empty-icon {
  font-size: 4em;
  margin-bottom: 20px;
}

.empty-state h3 {
  font-size: 1.5em;
  margin: 0 0 10px 0;
  color: #666;
}

.empty-state p {
  margin: 0;
  font-size: 1.1em;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .image-gallery {
    padding: 15px;
  }
  
  .gallery-grid {
    grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
    gap: 15px;
  }
  
  .gallery-title {
    font-size: 1.8em;
  }
  
  .image-container {
    height: 180px;
  }
}

@media (max-width: 480px) {
  .gallery-grid {
    grid-template-columns: 1fr;
    gap: 15px;
  }
  
  .gallery-title {
    font-size: 1.5em;
  }
  
  .image-container {
    height: 200px;
  }
  
  .gallery-info {
    padding: 15px;
  }
}

/* 加载动画 */
.gallery-image[lazy="loading"] {
  background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%);
  background-size: 200% 100%;
  animation: loading 1.5s infinite;
}

@keyframes loading {
  0% {
    background-position: 200% 0;
  }
  100% {
    background-position: -200% 0;
  }
}
</style>