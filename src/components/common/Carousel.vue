<template>
  <div class="carousel-container" @mouseenter="stopAutoPlay" @mouseleave="startAutoPlay">
    <div class="carousel-images" :class="{ 'no-transition': noTransition }" :style="{ transform: `translateX(-${currentIndex * 100}%)` }">
      <img v-for="(image, index) in displayImages" :key="index" :src="image" class="carousel-image" />
    </div>
    <div class="carousel-dots">
      <span
        v-for="(image, index) in images"
        :key="index"
        :class="['dot', { active: index === getRealIndex() }]"
        @click="goToSlide(index)"
      ></span>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted, computed, nextTick } from 'vue';

const images = ref([
  'https://placehold.co/1200x400/E0BBE4/FFFFFF/png?text=Image+1',
  'https://placehold.co/1200x400/957DAD/FFFFFF/png?text=Image+2',
  'https://placehold.co/1200x400/D291BC/FFFFFF/png?text=Image+3',
]);

const currentIndex = ref(1); // 从第二张开始（第一张是最后一张的副本）
const noTransition = ref(false);
let intervalId = null;

// 创建显示用的图片数组，前后都添加副本实现无缝循环
const displayImages = computed(() => {
  if (images.value.length === 0) return [];
  return [
    images.value[images.value.length - 1], // 最后一张的副本放在最前
    ...images.value,
    images.value[0], // 第一张的副本放在最后
  ];
});

// 获取当前在原始数组中的真实索引
const getRealIndex = () => {
  if (images.value.length === 0) return 0;
  return (currentIndex.value - 1 + images.value.length) % images.value.length;
};

const startAutoPlay = () => {
  if (intervalId) return;
  intervalId = setInterval(() => {
    nextSlide();
  }, 3000);
};

const stopAutoPlay = () => {
  if (intervalId) {
    clearInterval(intervalId);
    intervalId = null;
  }
};

const nextSlide = () => {
  currentIndex.value++;
  
  // 当到达最后一张（第一张的副本）时
  if (currentIndex.value >= displayImages.value.length - 1) {
    setTimeout(() => {
      // 立即无动画跳转到真实的第一张位置（索引1）
      noTransition.value = true;
      currentIndex.value = 1;
      
      // 重新开启过渡动画
      nextTick(() => {
        setTimeout(() => {
        noTransition.value = false;
        }, 300);
      });
    }, 800); // 等待过渡动画完成
  }
};

const prevSlide = () => {
  currentIndex.value--;
  
  // 当到达第一张（最后一张的副本）时
  if (currentIndex.value <= 0) {
    setTimeout(() => {
      // 立即无动画跳转到真实的最后一张位置
      noTransition.value = true;
      currentIndex.value = displayImages.value.length - 2;
      
      // 重新开启过渡动画
      nextTick(() => {
        noTransition.value = false;
      });
    }, 800);
  }
};

const goToSlide = (index) => {
  // 跳转到对应的真实位置（索引+1）
  currentIndex.value = index + 1;
  stopAutoPlay();
  startAutoPlay();
};

onMounted(() => {
  startAutoPlay();
});

onUnmounted(() => {
  stopAutoPlay();
});
</script>

<style scoped>
.carousel-container {
  width: 100%;
  overflow: hidden;
  position: relative;
  border-radius: 10px;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
}

.carousel-images {
  display: flex;
  transition: transform 0.8s ease-in-out;
}

.carousel-images.no-transition {
  transition: none;
}

.carousel-image {
  width: 100%;
  flex-shrink: 0;
  display: block;
  object-fit: cover;
  height: 400px;
}

.carousel-dots {
  position: absolute;
  bottom: 15px;
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  gap: 8px;
}

.dot {
  width: 10px;
  height: 10px;
  background-color: rgba(255, 255, 255, 0.6);
  border-radius: 50%;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

.dot.active {
  background-color: rgba(255, 255, 255, 1);
}

@media (max-width: 768px) {
  .carousel-image {
    height: 250px;
  }
}

@media (max-width: 480px) {
  .carousel-image {
    height: 180px;
  }
}
</style>

<style scoped>
.carousel-container {
  width: 100%;
  overflow: hidden;
  position: relative;
  border-radius: 10px;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
}

.carousel-images {
  display: flex;
  transition: transform 0.8s ease-in-out;
}

.carousel-image {
  width: 100%;
  flex-shrink: 0;
  display: block;
  object-fit: cover;
  height: 400px; /* Adjust height as needed */
}

.carousel-dots {
  position: absolute;
  bottom: 15px;
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  gap: 8px;
}

.dot {
  width: 10px;
  height: 10px;
  background-color: rgba(255, 255, 255, 0.6);
  border-radius: 50%;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

.dot.active {
  background-color: rgba(255, 255, 255, 1);
}

@media (max-width: 768px) {
  .carousel-image {
    height: 250px;
  }
}

@media (max-width: 480px) {
  .carousel-image {
    height: 180px;
  }
}
</style>