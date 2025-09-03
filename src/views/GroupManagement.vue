<template>
  <div class="group-management">
    <!-- 页面头部 -->
    <div class="page-header">
      <button class="back-btn" @click="goBack">← 返回</button>
      <div class="header-info">
        <h1>{{ groupInfo.title }}</h1>
        <p class="group-description">{{ groupInfo.description }}</p>
      </div>
      <button class="upload-btn" @click="triggerFileInput">
        <span>📤</span>
        上传图片
      </button>
    </div>

    <!-- 上传区域 -->
    <div class="upload-section" v-if="showUploadArea">
      <div 
        class="upload-dropzone" 
        :class="{ 'drag-over': isDragging }"
        @drop="handleDrop"
        @dragover="handleDragOver"
        @dragleave="handleDragLeave"
        @click="triggerFileInput"
      >
        <div class="upload-icon">📁</div>
        <h3>拖拽图片到此处或点击上传</h3>
        <p>支持 JPG、PNG、GIF 格式，最多可上传 20 张图片</p>
      </div>
      
      <input 
        ref="fileInput" 
        type="file" 
        multiple 
        accept="image/*" 
        @change="handleFileSelect"
        style="display: none"
      />
    </div>

    <!-- 预览区域 -->
    <div v-if="previewImages.length > 0" class="preview-section">
      <h3>预览 ({{ previewImages.length }} 张)</h3>
      <div class="preview-grid">
        <div 
          v-for="(image, index) in previewImages" 
          :key="index" 
          class="preview-item"
        >
          <img :src="image.url" :alt="image.name" />
          <div class="preview-overlay">
            <button class="remove-btn" @click="removePreview(index)">✕</button>
            <div class="image-info">
              <span class="image-name">{{ image.name }}</span>
              <span class="image-size">{{ formatFileSize(image.size) }}</span>
            </div>
          </div>
        </div>
      </div>
      
      <div class="upload-actions">
        <button class="btn cancel" @click="clearPreview">取消</button>
        <button class="btn confirm" @click="uploadImages" :disabled="isUploading">
          {{ isUploading ? '上传中...' : '确认上传' }}
        </button>
      </div>
    </div>

    <!-- 图片网格 -->
    <div class="images-section">
      <div class="section-header">
        <h2>已上传图片 ({{ images.length }} 张)</h2>
        <div class="view-options">
          <button 
            :class="{ active: viewMode === 'grid' }" 
            @click="viewMode = 'grid'"
          >
            网格
          </button>
          <button 
            :class="{ active: viewMode === 'list' }" 
            @click="viewMode = 'list'"
          >
            列表
          </button>
        </div>
      </div>

      <!-- 网格视图 -->
      <div v-if="viewMode === 'grid'" class="images-grid">
        <div 
          v-for="(image, index) in images" 
          :key="image.id" 
          class="image-card"
          @click="openImageViewer(index)"
        >
          <img :src="image.url" :alt="image.title" />
          <div class="image-overlay">
            <div class="image-actions">
              <button class="action-btn edit" @click.stop="editImage(image)">✏️</button>
              <button class="action-btn delete" @click.stop="deleteImage(image)">🗑️</button>
            </div>
            <div class="image-title">{{ image.title || '未命名' }}</div>
          </div>
        </div>

        <!-- 空状态 -->
        <div v-if="images.length === 0 && previewImages.length === 0" class="empty-state">
          <div class="empty-icon">📸</div>
          <h3>暂无图片</h3>
          <p>点击右上角"上传图片"按钮开始添加您的作品</p>
        </div>
      </div>

      <!-- 列表视图 -->
      <div v-if="viewMode === 'list'" class="images-list">
        <div 
          v-for="image in images" 
          :key="image.id" 
          class="image-item"
        >
          <img :src="image.url" :alt="image.title" class="list-thumbnail" />
          <div class="image-details">
            <h4>{{ image.title || '未命名' }}</h4>
            <p>{{ image.description || '暂无描述' }}</p>
            <span class="image-date">{{ image.uploadDate }}</span>
          </div>
          <div class="list-actions">
            <button class="action-btn edit" @click="editImage(image)">✏️</button>
            <button class="action-btn delete" @click="deleteImage(image)">🗑️</button>
          </div>
        </div>
      </div>
    </div>

    <!-- 图片查看器 -->
    <div v-if="showImageViewer" class="image-viewer" @click="closeImageViewer">
      <button class="viewer-close" @click="closeImageViewer">✕</button>
      <button class="viewer-nav prev" @click.stop="prevImage">‹</button>
      <img :src="images[currentImageIndex]?.url" :alt="images[currentImageIndex]?.title" />
      <button class="viewer-nav next" @click.stop="nextImage">›</button>
      <div class="viewer-info">
        <h3>{{ images[currentImageIndex]?.title || '未命名' }}</h3>
        <p>{{ images[currentImageIndex]?.description || '暂无描述' }}</p>
        <span>{{ currentImageIndex + 1 }} / {{ images.length }}</span>
      </div>
    </div>

    <!-- 编辑图片弹窗 -->
    <div v-if="showEditImage" class="modal-overlay" @click="closeModal">
      <div class="modal-content" @click.stop>
        <h2>编辑图片信息</h2>
        <div class="edit-image-preview">
          <img :src="editImageData.url" :alt="editImageData.title" />
        </div>
        <div class="form-group">
          <label>图片标题</label>
          <input 
            v-model="editImageData.title" 
            placeholder="请输入图片标题" 
            class="form-input"
            maxlength="50"
          />
        </div>
        <div class="form-group">
          <label>图片描述</label>
          <textarea 
            v-model="editImageData.description" 
            placeholder="请输入图片描述（选填）" 
            class="form-textarea"
            maxlength="200"
            rows="3"
          ></textarea>
        </div>
        <div class="modal-actions">
          <button class="btn cancel" @click="closeModal">取消</button>
          <button class="btn confirm" @click="confirmEditImage">保存</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { useRouter, useRoute } from 'vue-router';

const router = useRouter();
const route = useRoute();

// 路由参数
const folderId = computed(() => route.params.folderId);
const groupId = computed(() => route.params.groupId);

// 图组信息
const groupInfo = ref({
  title: '城市风光',
  description: '记录城市中的美丽建筑和街景'
});

// 上传状态
const showUploadArea = ref(false);
const isDragging = ref(false);
const previewImages = ref([]);
const isUploading = ref(false);

// 视图状态
const viewMode = ref('grid');
const showImageViewer = ref(false);
const currentImageIndex = ref(0);
const showEditImage = ref(false);
const editImageData = ref({});

// 模拟图片数据
const images = ref([
  {
    id: 1,
    url: 'https://picsum.photos/400/300?random=1',
    title: '城市天际线',
    description: '日落时分的城市天际线',
    uploadDate: '2024-01-15'
  },
  {
    id: 2,
    url: 'https://picsum.photos/400/300?random=2',
    title: '现代建筑',
    description: '玻璃幕墙的现代建筑',
    uploadDate: '2024-01-16'
  },
  {
    id: 3,
    url: 'https://picsum.photos/400/300?random=3',
    title: '城市夜景',
    description: '灯火辉煌的城市夜景',
    uploadDate: '2024-01-17'
  }
]);

// 文件输入引用
const fileInput = ref(null);

// 方法
const goBack = () => {
  router.push(`/folder-management/${folderId.value}`);
};

const triggerFileInput = () => {
  fileInput.value?.click();
};

const handleDragOver = (e) => {
  e.preventDefault();
  isDragging.value = true;
};

const handleDragLeave = () => {
  isDragging.value = false;
};

const handleDrop = (e) => {
  e.preventDefault();
  isDragging.value = false;
  const files = Array.from(e.dataTransfer.files);
  processFiles(files);
};

const handleFileSelect = (e) => {
  const files = Array.from(e.target.files);
  processFiles(files);
};

const processFiles = (files) => {
  const imageFiles = files.filter(file => file.type.startsWith('image/'));
  
  imageFiles.forEach(file => {
    const reader = new FileReader();
    reader.onload = (e) => {
      previewImages.value.push({
        file,
        url: e.target.result,
        name: file.name,
        size: file.size
      });
    };
    reader.readAsDataURL(file);
  });
  
  showUploadArea.value = false;
};

const removePreview = (index) => {
  previewImages.value.splice(index, 1);
};

const clearPreview = () => {
  previewImages.value = [];
};

const uploadImages = async () => {
  isUploading.value = true;
  
  // 模拟上传延迟
  setTimeout(() => {
    previewImages.value.forEach(preview => {
      const newImage = {
        id: Date.now() + Math.random(),
        url: preview.url,
        title: preview.name.replace(/\.[^/.]+$/, ''),
        description: '',
        uploadDate: new Date().toISOString().split('T')[0]
      };
      images.value.unshift(newImage);
    });
    
    previewImages.value = [];
    isUploading.value = false;
  }, 2000);
};

const formatFileSize = (bytes) => {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};

const openImageViewer = (index) => {
  currentImageIndex.value = index;
  showImageViewer.value = true;
};

const closeImageViewer = () => {
  showImageViewer.value = false;
};

const prevImage = () => {
  if (currentImageIndex.value > 0) {
    currentImageIndex.value--;
  }
};

const nextImage = () => {
  if (currentImageIndex.value < images.value.length - 1) {
    currentImageIndex.value++;
  }
};

const editImage = (image) => {
  editImageData.value = { ...image };
  showEditImage.value = true;
};

const deleteImage = (image) => {
  if (confirm(`确定要删除图片 "${image.title || '未命名'}" 吗？此操作不可恢复。`)) {
    const index = images.value.findIndex(img => img.id === image.id);
    if (index > -1) {
      images.value.splice(index, 1);
    }
  }
};

const confirmEditImage = () => {
  const index = images.value.findIndex(img => img.id === editImageData.value.id);
  if (index > -1) {
    images.value[index] = { ...editImageData.value };
  }
  closeModal();
};

const closeModal = () => {
  showEditImage.value = false;
  editImageData.value = {};
};

// 初始化
onMounted(() => {
  console.log('打开图组:', folderId.value, groupId.value);
});
</script>

<style scoped>
.group-management {
  min-height: 100vh;
  background: #f8f9fa;
  padding: 20px;
}

.page-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 30px;
  max-width: 1200px;
  margin-left: auto;
  margin-right: auto;
}

.back-btn {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 10px 20px;
  background: transparent;
  color: #667eea;
  border: 2px solid #667eea;
  border-radius: 25px;
  font-size: 1em;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
}

.back-btn:hover {
  background: #667eea;
  color: white;
  transform: translateY(-2px);
}

.header-info {
  flex: 1;
  text-align: center;
}

.header-info h1 {
  font-size: 2.2em;
  font-weight: 700;
  color: #333;
  margin: 0 0 5px 0;
}

.group-description {
  font-size: 1.2em;
  color: #666;
  margin: 0;
}

.upload-btn {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 12px 24px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border: none;
  border-radius: 25px;
  font-size: 1em;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
}

.upload-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 25px rgba(102, 126, 234, 0.3);
}

.upload-section {
  margin-bottom: 30px;
}

.upload-dropzone {
  border: 3px dashed #ddd;
  border-radius: 15px;
  padding: 60px 20px;
  text-align: center;
  cursor: pointer;
  transition: all 0.3s ease;
  background: white;
}

.upload-dropzone:hover,
.upload-dropzone.drag-over {
  border-color: #667eea;
  background: #f8f9ff;
}

.upload-icon {
  font-size: 4em;
  margin-bottom: 20px;
  color: #667eea;
}

.upload-dropzone h3 {
  font-size: 1.5em;
  color: #333;
  margin: 0 0 10px 0;
}

.upload-dropzone p {
  font-size: 1.1em;
  color: #666;
  margin: 0;
}

.preview-section {
  margin-bottom: 30px;
  background: white;
  border-radius: 15px;
  padding: 25px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
}

.preview-section h3 {
  font-size: 1.5em;
  font-weight: 600;
  color: #333;
  margin: 0 0 20px 0;
}

.preview-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
  gap: 15px;
  margin-bottom: 20px;
}

.preview-item {
  position: relative;
  border-radius: 10px;
  overflow: hidden;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.preview-item img {
  width: 100%;
  height: 150px;
  object-fit: cover;
}

.preview-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.7);
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  padding: 10px;
  opacity: 0;
  transition: opacity 0.3s ease;
}

.preview-item:hover .preview-overlay {
  opacity: 1;
}

.remove-btn {
  align-self: flex-end;
  width: 30px;
  height: 30px;
  background: #f44336;
  color: white;
  border: none;
  border-radius: 50%;
  cursor: pointer;
  font-size: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.image-info {
  color: white;
  font-size: 0.8em;
}

.image-name {
  display: block;
  font-weight: 600;
  margin-bottom: 2px;
}

.upload-actions {
  display: flex;
  gap: 15px;
  justify-content: flex-end;
}

.images-section {
  max-width: 1200px;
  margin: 0 auto;
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 25px;
}

.section-header h2 {
  font-size: 1.8em;
  font-weight: 600;
  color: #333;
  margin: 0;
}

.view-options {
  display: flex;
  gap: 10px;
}

.view-options button {
  padding: 8px 16px;
  border: 2px solid #ddd;
  background: white;
  color: #666;
  border-radius: 20px;
  cursor: pointer;
  transition: all 0.3s ease;
}

.view-options button.active {
  background: #667eea;
  color: white;
  border-color: #667eea;
}

.images-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  gap: 20px;
}

.image-card {
  position: relative;
  border-radius: 15px;
  overflow: hidden;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
}

.image-card:hover {
  transform: translateY(-3px);
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.15);
}

.image-card img {
  width: 100%;
  height: 200px;
  object-fit: cover;
}

.image-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(to bottom, transparent 0%, rgba(0, 0, 0, 0.7) 100%);
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  padding: 15px;
  opacity: 0;
  transition: opacity 0.3s ease;
}

.image-card:hover .image-overlay {
  opacity: 1;
}

.image-actions {
  display: flex;
  gap: 8px;
  justify-content: flex-end;
}

.action-btn {
  width: 36px;
  height: 36px;
  border: none;
  border-radius: 50%;
  font-size: 16px;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
}

.action-btn.edit {
  background: rgba(255, 255, 255, 0.9);
  color: #667eea;
}

.action-btn.delete {
  background: rgba(255, 255, 255, 0.9);
  color: #f44336;
}

.action-btn:hover {
  transform: scale(1.1);
}

.image-title {
  color: white;
  font-size: 1.1em;
  font-weight: 600;
}

.empty-state {
  grid-column: 1 / -1;
  text-align: center;
  padding: 80px 20px;
  color: #666;
}

.empty-icon {
  font-size: 4em;
  margin-bottom: 20px;
  opacity: 0.5;
}

.empty-state h3 {
  font-size: 1.8em;
  margin: 0 0 15px 0;
  color: #333;
}

.empty-state p {
  font-size: 1.2em;
  color: #666;
  margin: 0;
}

.images-list {
  background: white;
  border-radius: 15px;
  overflow: hidden;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
}

.image-item {
  display: flex;
  align-items: center;
  gap: 20px;
  padding: 20px;
  border-bottom: 1px solid #eee;
  transition: background-color 0.3s ease;
}

.image-item:hover {
  background: #f8f9fa;
}

.image-item:last-child {
  border-bottom: none;
}

.list-thumbnail {
  width: 80px;
  height: 60px;
  object-fit: cover;
  border-radius: 8px;
}

.image-details {
  flex: 1;
}

.image-details h4 {
  font-size: 1.2em;
  font-weight: 600;
  color: #333;
  margin: 0 0 5px 0;
}

.image-details p {
  font-size: 1em;
  color: #666;
  margin: 0 0 5px 0;
}

.image-date {
  font-size: 0.9em;
  color: #999;
}

.list-actions {
  display: flex;
  gap: 10px;
}

.image-viewer {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.9);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}

.image-viewer img {
  max-width: 90%;
  max-height: 80vh;
  border-radius: 10px;
}

.viewer-close {
  position: absolute;
  top: 20px;
  right: 20px;
  background: rgba(255, 255, 255, 0.2);
  color: white;
  border: none;
  width: 50px;
  height: 50px;
  border-radius: 50%;
  font-size: 24px;
  cursor: pointer;
  transition: background 0.3s ease;
}

.viewer-close:hover {
  background: rgba(255, 255, 255, 0.3);
}

.viewer-nav {
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  background: rgba(255, 255, 255, 0.2);
  color: white;
  border: none;
  width: 60px;
  height: 60px;
  border-radius: 50%;
  font-size: 30px;
  cursor: pointer;
  transition: background 0.3s ease;
}

.viewer-nav:hover {
  background: rgba(255, 255, 255, 0.3);
}

.viewer-nav.prev {
  left: 20px;
}

.viewer-nav.next {
  right: 20px;
}

.viewer-info {
  position: absolute;
  bottom: 20px;
  left: 50%;
  transform: translateX(-50%);
  background: rgba(0, 0, 0, 0.7);
  color: white;
  padding: 15px 30px;
  border-radius: 25px;
  text-align: center;
}

.viewer-info h3 {
  font-size: 1.3em;
  font-weight: 600;
  margin: 0 0 5px 0;
}

.viewer-info p {
  font-size: 1em;
  margin: 0 0 5px 0;
  opacity: 0.8;
}

.viewer-info span {
  font-size: 0.9em;
  opacity: 0.6;
}

.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1001;
}

.modal-content {
  background: white;
  border-radius: 15px;
  padding: 40px;
  width: 90%;
  max-width: 500px;
}

.modal-content h2 {
  font-size: 1.8em;
  font-weight: 600;
  color: #333;
  margin: 0 0 25px 0;
  text-align: center;
}

.edit-image-preview {
  text-align: center;
  margin-bottom: 25px;
}

.edit-image-preview img {
  max-width: 100%;
  max-height: 200px;
  border-radius: 10px;
  object-fit: cover;
}

.form-group {
  margin-bottom: 20px;
}

.form-group label {
  display: block;
  font-size: 1.1em;
  font-weight: 600;
  color: #333;
  margin-bottom: 8px;
}

.form-input,
.form-textarea {
  width: 100%;
  padding: 15px;
  font-size: 1.1em;
  border: 2px solid #e0e0e0;
  border-radius: 10px;
  transition: border-color 0.3s ease;
  font-family: inherit;
}

.form-input:focus,
.form-textarea:focus {
  outline: none;
  border-color: #667eea;
}

.form-textarea {
  resize: vertical;
  min-height: 80px;
}

.modal-actions {
  display: flex;
  gap: 15px;
  justify-content: flex-end;
  margin-top: 30px;
}

.btn {
  padding: 12px 30px;
  border: none;
  border-radius: 25px;
  font-size: 1em;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
}

.btn.cancel {
  background: #f0f0f0;
  color: #333;
}

.btn.cancel:hover {
  background: #e0e0e0;
}

.btn.confirm {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
}

.btn.confirm:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 25px rgba(102, 126, 234, 0.3);
}

.btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.btn:disabled:hover {
  transform: none;
  box-shadow: none;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .group-management {
    padding: 15px;
  }
  
  .page-header {
    flex-direction: column;
    gap: 15px;
    align-items: stretch;
  }
  
  .header-info h1 {
    font-size: 1.8em;
  }
  
  .group-description {
    font-size: 1.1em;
  }
  
  .back-btn,
  .upload-btn {
    width: 100%;
    justify-content: center;
  }
  
  .images-grid {
    grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
    gap: 15px;
  }
  
  .image-card img {
    height: 150px;
  }
  
  .preview-grid {
    grid-template-columns: repeat(auto-fill, minmax(120px, 1fr));
  }
  
  .modal-content {
    margin: 20px;
    padding: 30px 20px;
  }
  
  .modal-actions {
    flex-direction: column;
  }
  
  .btn {
    width: 100%;
  }
}

@media (max-width: 480px) {
  .header-info h1 {
    font-size: 1.5em;
  }
  
  .images-grid {
    grid-template-columns: 1fr;
  }
  
  .image-card img {
    height: 200px;
  }
  
  .viewer-nav {
    width: 50px;
    height: 50px;
    font-size: 24px;
  }
  
  .viewer-nav.prev {
    left: 10px;
  }
  
  .viewer-nav.next {
    right: 10px;
  }
}
</style>