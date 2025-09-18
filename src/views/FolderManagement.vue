<template>
  <div class="folder-management">
    <!-- 页面头部 -->
    <div class="page-header">
      <button class="back-btn" @click="goBack">← 返回</button>
      <h1>{{ folderName }} - 图组管理</h1>
      <button class="create-group-btn" @click="showCreateGroup = true">
        <span>+</span>
        新建图组
      </button>
    </div>

    <!-- 加载状态 -->
    <div v-if="loading" class="loading-state">
      <div class="loading-spinner"></div>
      <p>正在加载图集...</p>
    </div>

    <!-- 错误状态 -->
    <div v-else-if="error" class="error-state">
      <div class="error-icon">⚠️</div>
      <h3>加载失败</h3>
      <p>{{ error }}</p>
      <button class="retry-btn" @click="loadAlbums">重新加载</button>
    </div>

    <!-- 图组网格 -->
    <div v-else class="groups-grid">
      <div 
        v-for="group in imageGroups" 
        :key="group.id" 
        class="group-card"
        @click="openGroup(group)"
      >
        <div class="group-cover">
          <img :src="group.coverImage || 'https://picsum.photos/300/200?random=' + group.id" :alt="group.title">
          <div class="image-count">{{ group.imageCount }} 张</div>
        </div>
        <div class="group-info">
          <h3 class="group-title">{{ group.title }}</h3>
          <p class="group-description">{{ group.description }}</p>
          <p class="group-date">创建于 {{ group.createdAt }}</p>
        </div>
        <div class="group-actions" @click.stop>
          <button class="action-btn edit" @click="editGroup(group)">✏️</button>
          <button class="action-btn delete" @click="deleteGroup(group)">🗑️</button>
        </div>
      </div>

      <!-- 空状态 -->
      <div v-if="imageGroups.length === 0" class="empty-state">
        <div class="empty-icon">📸</div>
        <h3>暂无图组</h3>
        <p>点击右上角"新建图组"开始创建您的第一个图组</p>
        <button class="create-first-btn" @click="showCreateGroup = true">创建图组</button>
      </div>
    </div>

    <!-- 创建图组弹窗 -->
    <div v-if="showCreateGroup" class="modal-overlay" @click="closeModal">
      <div class="modal-content" @click.stop>
        <h2>新建图组</h2>
        <div class="form-group">
          <label>图组标题</label>
          <input 
            v-model="newGroup.title" 
            placeholder="请输入图组标题" 
            class="form-input"
            maxlength="50"
          />
        </div>
        <div class="form-group">
          <label>图组描述</label>
          <textarea 
            v-model="newGroup.description" 
            placeholder="请输入图组描述（选填）" 
            class="form-textarea"
            maxlength="200"
            rows="3"
          ></textarea>
        </div>
        
        <!-- 图片上传区域 -->
        <div class="form-group">
          <label>上传图片</label>
          <div 
            class="upload-dropzone"
            :class="{ 'drag-over': isDragging }"
            @drop="handleDrop"
            @dragover="handleDragOver"
            @dragleave="handleDragLeave"
            @click="triggerFileInput"
          >
            <div class="upload-icon">📁</div>
            <h4>拖拽图片到此处或点击上传</h4>
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
          <h4>预览 ({{ previewImages.length }} 张)</h4>
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
        </div>

        <div class="modal-actions">
          <button class="btn cancel" @click="closeModal">取消</button>
          <button class="btn confirm" @click="createGroup" :disabled="isUploading">
            {{ isUploading ? '创建中...' : '创建图组' }}
          </button>
        </div>
      </div>
    </div>

    <!-- 编辑图组弹窗 -->
    <div v-if="showEditGroup" class="modal-overlay" @click="closeModal">
      <div class="modal-content" @click.stop>
        <h2>编辑图组</h2>
        <div class="form-group">
          <label>图组标题</label>
          <input 
            v-model="editGroupData.title" 
            class="form-input"
            maxlength="50"
          />
        </div>
        <div class="form-group">
          <label>图组描述</label>
          <textarea 
            v-model="editGroupData.description" 
            class="form-textarea"
            maxlength="200"
            rows="3"
          ></textarea>
        </div>
        <div class="modal-actions">
          <button class="btn cancel" @click="closeModal">取消</button>
          <button class="btn confirm" @click="confirmEdit">保存</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import { albumApi } from '@/services/api';

const router = useRouter();
const route = useRoute();

// 从路由参数获取文件夹ID
const folderId = computed(() => route.params.folderId);
const folderName = computed(() => {
  const folders = {
    '1': '风光摄影',
    '2': '人像摄影',
    '3': '建筑摄影',
    '4': '美食摄影'
  };
  return folders[folderId.value] || '未知文件夹';
});

// 图组数据
const imageGroups = ref([]);
const loading = ref(false);
const error = ref(null);

// 弹窗状态
const showCreateGroup = ref(false);
const showEditGroup = ref(false);
const newGroup = ref({
  title: '',
  description: ''
});
const editGroupData = ref({
  id: null,
  title: '',
  description: ''
});

// 上传相关
const fileInput = ref(null);
const previewImages = ref([]);
const isDragging = ref(false);
const isUploading = ref(false);

// 方法
const goBack = () => {
  router.push('/image-management');
};

const openGroup = (group) => {
  router.push(`/group-management/${folderId.value}/${group.id}`);
};

// 加载图集列表
const loadAlbums = async () => {
  if (!folderId.value) return;
  
  loading.value = true;
  error.value = null;
  
  try {
    const response = await albumApi.getAlbumsByCategory(folderId.value, {
      page: 1,
      page_size: 100,
      sort_by: 'created_at',
      sort_order: 'desc'
    });
    
    if (response.code === 200) {
      // 将API返回的数据映射为页面需要的数据结构
      imageGroups.value = response.data.albums.map(album => ({
        id: album.id,
        title: album.name,
        description: album.description || '暂无描述',
        imageCount: album.media_count || 0,
        coverImage: album.cover_image ? album.cover_image.thumbnail_path : 
                   `https://picsum.photos/300/200?random=${album.id}`,
        createdAt: album.created_at ? album.created_at.split('T')[0] : '未知日期'
      }));
    } else {
      error.value = response.message || '获取图集列表失败';
    }
  } catch (err) {
    console.error('加载图集失败:', err);
    error.value = '加载图集失败，请稍后重试';
  } finally {
    loading.value = false;
  }
};

const createGroup = async () => {
  if (!newGroup.value.title.trim()) return;
  
  isUploading.value = true;
  
  try {
    // 1. 先创建图集
    const albumData = {
      category_id: parseInt(folderId.value),
      name: newGroup.value.title.trim(),
      description: newGroup.value.description.trim()
    };
    
    const createResponse = await albumApi.createAlbum(albumData);
    
    if (createResponse.code !== 200) {
      throw new Error(createResponse.message || '创建图集失败');
    }
    
    const newAlbum = createResponse.data;
    
    // 2. 如果有图片，批量上传到图集
    if (previewImages.value.length > 0) {
      const files = previewImages.value.map(img => img.file);
      
      try {
        await albumApi.uploadMediaToAlbum(newAlbum.id, files
        // , {
        //   album_id: newAlbum.id
        // }
      );
      } catch (uploadError) {
        console.error('图片上传失败:', uploadError);
        // 图片上传失败不影响图集创建，继续执行
      }
    }
    
    // 3. 重新加载图集列表
    await loadAlbums();
    
    // 4. 重置表单并关闭弹窗
    newGroup.value = { title: '', description: '' };
    previewImages.value = [];
    closeModal();
    
  } catch (error) {
    console.error('创建图集失败:', error);
    alert(error.message || '创建图集失败，请稍后重试');
  } finally {
    isUploading.value = false;
  }
};

const triggerFileInput = () => {
  fileInput.value.click();
};

const handleFileSelect = (e) => {
  const files = Array.from(e.target.files);
  processFiles(files);
};

const handleDrop = (e) => {
  e.preventDefault();
  isDragging.value = false;
  const files = Array.from(e.dataTransfer.files);
  processFiles(files);
};

const handleDragOver = (e) => {
  e.preventDefault();
  isDragging.value = true;
};

const handleDragLeave = () => {
  isDragging.value = false;
};

const processFiles = (files) => {
  const imageFiles = files.filter(f => f.type.startsWith('image/'));
  const maxFiles = 20 - previewImages.value.length;
  const limited = imageFiles.slice(0, maxFiles);
  limited.forEach(file => {
    const reader = new FileReader();
    reader.onload = (e) => {
      previewImages.value.push({
        url: e.target.result,
        name: file.name,
        size: file.size,
        file
      });
    };
    reader.readAsDataURL(file);
  });
};

const removePreview = (index) => {
  previewImages.value.splice(index, 1);
};

const formatFileSize = (bytes) => {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};

const editGroup = (group) => {
  editGroupData.value = {
    id: group.id,
    title: group.title,
    description: group.description
  };
  showEditGroup.value = true;
};

const confirmEdit = async () => {
  if (editGroupData.value.id && editGroupData.value.title.trim()) {
    try {
      const updateData = {
        name: editGroupData.value.title.trim(),
        description: editGroupData.value.description.trim()
      };
      
      const response = await albumApi.updateAlbum(editGroupData.value.id, updateData);
      
      if (response.code === 200) {
        await loadAlbums();
        closeModal();
      } else {
        alert(response.message || '更新图集失败');
      }
    } catch (error) {
      console.error('更新图集失败:', error);
      alert('更新图集失败，请稍后重试');
    }
  }
};

const deleteGroup = async (group) => {
  if (confirm(`确定要删除图组 "${group.title}" 吗？此操作将删除该图组及其所有图片。`)) {
    try {
      const response = await albumApi.deleteAlbum(group.id);
      
      if (response.code === 200) {
        await loadAlbums();
      } else {
        alert(response.message || '删除图集失败');
      }
    } catch (error) {
      console.error('删除图集失败:', error);
      alert('删除图集失败，请稍后重试');
    }
  }
};

const closeModal = () => {
  showCreateGroup.value = false;
  showEditGroup.value = false;
  newGroup.value = { title: '', description: '' };
  editGroupData.value = { id: null, title: '', description: '' };
};

// 初始化
onMounted(() => {
  console.log('打开文件夹:', folderId.value);
  loadAlbums();
});
</script>

<style scoped>
.folder-management {
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

.page-header h1 {
  font-size: 2.2em;
  font-weight: 700;
  color: #333;
  margin: 0;
  flex: 1;
  text-align: center;
}

.create-group-btn {
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

.create-group-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 25px rgba(102, 126, 234, 0.3);
}

.create-group-btn span {
  font-size: 1.2em;
  font-weight: bold;
}

.groups-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 25px;
  max-width: 1200px;
  margin: 0 auto;
}

.group-card {
  background: white;
  border-radius: 15px;
  overflow: hidden;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
  position: relative;
}

.group-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 12px 32px rgba(0, 0, 0, 0.15);
}

.group-cover {
  position: relative;
  height: 200px;
  overflow: hidden;
}

.group-cover img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.3s ease;
}

.group-card:hover .group-cover img {
  transform: scale(1.05);
}

.image-count {
  position: absolute;
  top: 10px;
  right: 10px;
  background: rgba(0, 0, 0, 0.7);
  color: white;
  padding: 5px 12px;
  border-radius: 20px;
  font-size: 0.9em;
  font-weight: 600;
}

.group-info {
  padding: 20px;
}

.group-title {
  font-size: 1.4em;
  font-weight: 600;
  color: #333;
  margin: 0 0 8px 0;
}

.group-description {
  font-size: 1em;
  color: #666;
  line-height: 1.5;
  margin: 0 0 10px 0;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.group-date {
  font-size: 0.9em;
  color: #999;
  margin: 0;
}

.group-actions {
  position: absolute;
  top: 10px;
  right: 10px;
  display: flex;
  gap: 8px;
  opacity: 0;
  transition: opacity 0.3s ease;
}

.group-card:hover .group-actions {
  opacity: 1;
}

.action-btn {
  width: 32px;
  height: 32px;
  border: none;
  border-radius: 50%;
  font-size: 14px;
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

.action-btn.edit:hover {
  background: white;
  transform: scale(1.1);
}

.action-btn.delete {
  background: rgba(255, 255, 255, 0.9);
  color: #f44336;
}

.action-btn.delete:hover {
  background: white;
  transform: scale(1.1);
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
  margin: 0 0 25px 0;
}

.create-first-btn {
  padding: 12px 30px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border: none;
  border-radius: 25px;
  font-size: 1.1em;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
}

.create-first-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 25px rgba(102, 126, 234, 0.3);
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
  z-index: 1000;
}

.modal-content {
    background: white;
    border-radius: 15px;
    padding: 30px;
    width: 90%;
    max-width: 500px;
    max-height: 85vh;
    overflow-y: auto;
    position: relative;
  }

.form-group {
    margin-bottom: 20px;
  }

  .form-group label {
    display: block;
    font-size: 1em;
    font-weight: 600;
    color: #333;
    margin-bottom: 6px;
  }

.form-input,
  .form-textarea {
    width: 100%;
    padding: 12px;
    font-size: 1em;
    border: 2px solid #e0e0e0;
    border-radius: 8px;
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
    gap: 12px;
    justify-content: flex-end;
    margin-top: 25px;
  }

.btn {
    padding: 10px 25px;
    border: none;
    border-radius: 20px;
    font-size: 0.95em;
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
    transform: none;
  }

  .upload-dropzone {
    border: 2px dashed #ddd;
    border-radius: 8px;
    padding: 20px 15px;
    text-align: center;
    cursor: pointer;
    transition: all 0.3s ease;
    background: #f8f9fa;
    margin-top: 8px;
  }

  .upload-dropzone:hover,
  .upload-dropzone.drag-over {
    border-color: #667eea;
    background: #f0f4ff;
  }

  .upload-dropzone .upload-icon {
    font-size: 2em;
    margin-bottom: 10px;
    color: #667eea;
  }

  .upload-dropzone h4 {
    font-size: 1.1em;
    color: #333;
    margin: 0 0 4px 0;
    font-weight: 600;
  }

  .upload-dropzone p {
    font-size: 0.9em;
    color: #666;
    margin: 0;
  }

  .preview-section {
    margin-top: 15px;
    padding: 12px;
    background: #f8f9fa;
    border-radius: 8px;
  }

  .preview-section h4 {
    font-size: 1em;
    font-weight: 600;
    color: #333;
    margin: 0 0 10px 0;
  }

  .preview-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(70px, 1fr));
    gap: 8px;
  }

  .preview-item {
    position: relative;
    border-radius: 8px;
    overflow: hidden;
    aspect-ratio: 1;
  }

  .preview-item img {
    width: 100%;
    height: 100%;
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
    padding: 5px;
    opacity: 0;
    transition: opacity 0.3s ease;
  }

  .preview-item:hover .preview-overlay {
    opacity: 1;
  }

  .remove-btn {
    align-self: flex-end;
    width: 20px;
    height: 20px;
    background: #f44336;
    color: white;
    border: none;
    border-radius: 50%;
    cursor: pointer;
    font-size: 12px;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .image-info {
    color: white;
    font-size: 0.7em;
    line-height: 1.2;
  }

  .image-name {
    display: block;
    font-weight: 600;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  .image-size {
    display: block;
    font-size: 0.8em;
    opacity: 0.8;
  }

.loading-state,
.error-state {
  grid-column: 1 / -1;
  text-align: center;
  padding: 80px 20px;
  color: #666;
}

.loading-spinner {
  width: 40px;
  height: 40px;
  border: 4px solid #f3f3f3;
  border-top: 4px solid #667eea;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin: 0 auto 20px;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

.error-icon {
  font-size: 4em;
  margin-bottom: 20px;
}

.retry-btn {
  padding: 10px 25px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border: none;
  border-radius: 25px;
  font-size: 1em;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  margin-top: 15px;
}

.retry-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 25px rgba(102, 126, 234, 0.3);
}

/* 响应式设计 */
@media (max-width: 768px) {
  .folder-management {
    padding: 15px;
  }
  
  .page-header {
    flex-direction: column;
    gap: 15px;
    align-items: stretch;
  }
  
  .back-btn {
    align-self: flex-start;
  }
  
  .page-header h1 {
    font-size: 1.8em;
    text-align: center;
  }
  
  .create-group-btn {
    width: 100%;
    justify-content: center;
  }
  
  .groups-grid {
    grid-template-columns: 1fr;
    gap: 20px;
  }
  
  .modal-content {
    margin: 10px;
    padding: 20px;
    max-height: 90vh;
    width: 95%;
  }
  
  .modal-actions {
    flex-direction: column;
  }
  
  .btn {
    width: 100%;
  }
  
  .upload-dropzone {
    padding: 15px 10px;
  }
  
  .upload-dropzone h4 {
    font-size: 1em;
  }
  
  .upload-dropzone p {
    font-size: 0.8em;
  }
  
  .preview-grid {
    grid-template-columns: repeat(auto-fill, minmax(60px, 1fr));
    gap: 6px;
  }
}

@media (max-width: 480px) {
  .page-header h1 {
    font-size: 1.5em;
  }
  
  .group-title {
    font-size: 1.2em;
  }
}
</style>