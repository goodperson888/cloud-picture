<template>
  <div class="home-page">
    <!-- 轮播图 -->
    <Carousel :images="carouselImages" />
    
    <!-- 分类栏 -->
    <CategoryNav :categories="categories" :selected-category="currentCategory" @select-category="handleCategorySelect" />
    
    <!-- 图集展示 -->
    <ImageGallery 
      :images="filteredImages" 
      @image-click="handleImageClick"
    />
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import Carousel from '../components/common/Carousel.vue';
import CategoryNav from '../components/common/CategoryNav.vue';
import ImageGallery from '../components/features/ImageGallery.vue';

const router = useRouter();

// 轮播图数据
const carouselImages = ref([
  {
    id: 1,
    url: 'https://picsum.photos/1200/400?random=1',
    title: '精彩瞬间',
    description: '记录生活中的美好时刻'
  },
  {
    id: 2,
    url: 'https://picsum.photos/1200/400?random=2',
    title: '自然之美',
    description: '大自然的壮丽景色'
  },
  {
    id: 3,
    url: 'https://picsum.photos/1200/400?random=3',
    title: '城市风光',
    description: '现代都市的独特魅力'
  }
]);

// 分类数据（可扩展）
const categories = ref([
  { id: 'all', name: '全部', slug: 'all' },
  { id: 1, name: '风光摄影', slug: 'landscape' },
  { id: 2, name: '人像摄影', slug: 'portrait' },
  { id: 3, name: '纪实摄影', slug: 'documentary' },
  { id: 4, name: '商业摄影', slug: 'commercial' },
  { id: 5, name: '艺术摄影', slug: 'art' },
  { id: 6, name: '活动摄影', slug: 'event' },
  { id: 7, name: '宠物摄影', slug: 'pet' },
  { id: 8, name: '婚礼摄影', slug: 'wedding' }
]);

// 图集数据
const images = ref([
  {
    id: 1,
    title: '山间小路',
    description: '一条蜿蜒的小路，通向远方的山峦。',
    url: 'https://picsum.photos/300/200?random=1',
    category: 'landscape',
    tags: ['自然', '山脉']
  },
  {
    id: 2,
    title: '湖光山色',
    description: '宁静的湖面，倒映着美丽的群山。',
    url: 'https://picsum.photos/300/200?random=2',
    category: 'landscape',
    tags: ['湖泊', '倒影']
  },
  {
    id: 3,
    title: '城市夜景',
    description: '灯火辉煌的城市，夜晚的魅力。',
    url: 'https://picsum.photos/300/200?random=3',
    category: 'commercial',
    tags: ['城市', '夜景']
  },
  {
    id: 4,
    title: '人像写真',
    description: '专业人像摄影作品展示。',
    url: 'https://picsum.photos/300/200?random=4',
    category: 'portrait',
    tags: ['人像', '时尚']
  },
  {
    id: 5,
    title: '婚礼现场',
    description: '浪漫婚礼的珍贵瞬间。',
    url: 'https://picsum.photos/300/200?random=5',
    category: 'wedding',
    tags: ['婚礼', '浪漫']
  },
  {
    id: 6,
    title: '宠物萌照',
    description: '可爱宠物的精彩瞬间。',
    url: 'https://picsum.photos/300/200?random=6',
    category: 'pet',
    tags: ['宠物', '可爱']
  }
]);

// 当前选中的分类
const currentCategory = ref('all');

// 过滤后的图片
const filteredImages = computed(() => {
  if (currentCategory.value === 'all') {
    return images.value;
  }
  return images.value.filter(img => img.category === currentCategory.value);
});

// 处理分类选择
const handleCategorySelect = (category) => {
  currentCategory.value = category.slug;
  router.push(`/category/${category.slug}`);
};

// 处理图片点击
const handleImageClick = (image) => {
  router.push(`/detail/${image.id}`);
};

// 处理路由参数中的分类
onMounted(() => {
  const routeCategory = router.currentRoute.value.params.category;
  if (routeCategory) {
    currentCategory.value = routeCategory;
  }
});
</script>

<style scoped>
.home-page {
  min-height: 100vh;
  background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
}
</style>