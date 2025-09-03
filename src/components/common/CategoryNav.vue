<template>
  <div class="category-nav">
    <div class="category-container">
      <div 
        class="category-tabs" 
        :class="{ 'expanded': isExpanded }"
        ref="categoryTabs"
      >
        <button
          v-for="category in categories"
          :key="category.id"
          @click="selectCategory(category)"
          :class="['category-tab', { active: isActive(category) }]"
          class="category-tab"
        >
          {{ category.name }}
        </button>
      </div>
      
      <button
        v-if="showExpandButton"
        class="expand-button"
        @click="toggleExpand"
        :title="isExpanded ? '收起' : '展开更多'"
      >
        {{ isExpanded ? '收起' : '更多' }}
        <span :class="['arrow', { 'expanded': isExpanded }]">▼</span>
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue';

const props = defineProps({
  categories: {
    type: Array,
    required: true,
    default: () => [
      { id: 1, name: '风光摄影', slug: 'landscape' },
      { id: 2, name: '人像摄影', slug: 'portrait' },
      { id: 3, name: '纪实摄影', slug: 'documentary' },
      { id: 4, name: '商业摄影', slug: 'commercial' },
      { id: 5, name: '艺术摄影', slug: 'art' },
      { id: 6, name: '活动摄影', slug: 'event' },
      { id: 7, name: '宠物摄影', slug: 'pet' },
      { id: 8, name: '婚礼摄影', slug: 'wedding' },
      { id: 9, name: '建筑摄影', slug: 'architecture' },
      { id: 10, name: '美食摄影', slug: 'food' }
    ]
  },
  selectedCategory: {
    type: String,
    default: 'all'
  }
});

const emit = defineEmits(['select-category']);

// 状态管理
const isExpanded = ref(false);
const showExpandButton = ref(false);
const categoryTabs = ref(null);

// 当前选中的分类
const activeCategory = computed(() => props.selectedCategory);

// 判断分类是否激活
const isActive = (category) => {
  return category.slug === activeCategory.value;
};

// 选择分类
const selectCategory = (category) => {
  emit('select-category', category);
};

// 切换展开/收起
const toggleExpand = () => {
  isExpanded.value = !isExpanded.value;
};

// 检查是否需要展开按钮
const checkExpandButton = () => {
  if (categoryTabs.value) {
    const containerWidth = categoryTabs.value.parentElement.offsetWidth;
    const contentWidth = categoryTabs.value.scrollWidth;
    showExpandButton.value = contentWidth > containerWidth;
  }
};

// 生命周期
onMounted(() => {
  checkExpandButton();
  window.addEventListener('resize', checkExpandButton);
});

onUnmounted(() => {
  window.removeEventListener('resize', checkExpandButton);
});
</script>

<style scoped>
.category-nav {
  background: white;
  border-radius: 12px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.08);
  margin: 20px auto;
  max-width: 1200px;
  padding: 0 20px;
}

.category-container {
  display: flex;
  align-items: flex-start;
  gap: 10px;
  padding: 15px 0;
  position: relative;
}

.category-tabs {
  display: flex;
  flex-wrap: nowrap;
  gap: 8px;
  overflow-x: auto;
  flex: 1;
  scrollbar-width: none;
  -ms-overflow-style: none;
  max-height: 60px;
  transition: max-height 0.3s ease;
}

.category-tabs::-webkit-scrollbar {
  display: none;
}

.category-tabs.expanded {
  flex-wrap: wrap;
  max-height: none;
  overflow-x: visible;
}

.category-tab {
  flex-shrink: 0;
  padding: 10px 20px;
  border: none;
  background: #f8f9fa;
  color: #666;
  border-radius: 20px;
  cursor: pointer;
  transition: all 0.3s ease;
  font-size: 14px;
  font-weight: 500;
  white-space: nowrap;
}

.category-tab:hover {
  background: #e9ecef;
  color: #495057;
  transform: translateY(-1px);
}

.category-tab.active {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  box-shadow: 0 4px 12px rgba(102, 126, 234, 0.3);
}

.expand-button {
  flex-shrink: 0;
  padding: 10px 16px;
  border: none;
  background: #f8f9fa;
  color: #666;
  border-radius: 20px;
  cursor: pointer;
  font-size: 13px;
  font-weight: 500;
  display: flex;
  align-items: center;
  gap: 4px;
  transition: all 0.3s ease;
}

.expand-button:hover {
  background: #e9ecef;
  color: #495057;
}

.arrow {
  font-size: 12px;
  transition: transform 0.3s ease;
}

.arrow.expanded {
  transform: rotate(180deg);
}

/* 响应式设计 */
@media (max-width: 768px) {
  .category-nav {
    margin: 10px;
    padding: 0 15px;
    border-radius: 8px;
  }
  
  .category-container {
    padding: 10px 0;
  }
  
  .category-tab {
    padding: 8px 16px;
    font-size: 13px;
  }
  
  .expand-button {
    padding: 8px 12px;
    font-size: 12px;
  }
}

@media (max-width: 480px) {
  .category-tabs {
    gap: 6px;
  }
  
  .category-tab {
    padding: 6px 12px;
    font-size: 12px;
  }
}
</style>