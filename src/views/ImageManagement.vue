<template>
  <div class="image-management">
    <!-- 页面头部 -->
    <div class="page-header">
      <div class="header-left">
        <button class="back-btn" @click="goBack">
          <span>←</span>
          返回首页
        </button>
        <h1>图片管理</h1>
      </div>
      <button class="create-folder-btn" @click="showCreateFolder = true">
        <span>+</span>
        新建文件夹
      </button>
    </div>

    <!-- 加载状态 -->
    <div v-if="loading" class="loading-state">
      <div class="loading-spinner"></div>
      <p>正在加载分类...</p>
    </div>

    <!-- 错误状态 -->
    <div v-else-if="error" class="error-state">
      <div class="error-icon">⚠️</div>
      <h3>加载失败</h3>
      <p>{{ error }}</p>
      <button class="retry-btn" @click="loadCategories">重试</button>
    </div>

    <!-- 文件夹网格 -->
    <div v-else class="folders-grid">
      <div 
        v-for="folder in folders" 
        :key="folder.id" 
        class="folder-card"
        @click="openFolder(folder)"
      >
        <div class="folder-icon">
          <span>📁</span>
        </div>
        <div class="folder-info">
          <h3 class="folder-name">{{ folder.name }}</h3>
          <p class="folder-count">{{ folder.imageCount }} 个图集</p>
          <p class="folder-date">{{ folder.createdAt }}</p>
        </div>
        <div class="folder-actions" @click.stop>
          <button class="action-btn rename" @click="renameFolder(folder)">✏️</button>
          <button class="action-btn delete" @click="deleteFolder(folder)">🗑️</button>
        </div>
      </div>

      <!-- 空状态 -->
      <div v-if="folders.length === 0" class="empty-state">
        <div class="empty-icon">📂</div>
        <h3>暂无分类</h3>
        <p>点击右上角"新建文件夹"开始管理您的图片</p>
      </div>
    </div>

    <!-- 创建文件夹弹窗 -->
    <div v-if="showCreateFolder" class="modal-overlay" @click="closeModal">
      <div class="modal-content" @click.stop>
        <h2>新建文件夹</h2>
        <input 
          v-model="newFolderName" 
          placeholder="请输入文件夹名称" 
          class="folder-input"
          @keyup.enter="createFolder"
        />
        <div class="modal-actions">
          <button class="btn cancel" @click="closeModal">取消</button>
          <button class="btn confirm" @click="createFolder">创建</button>
        </div>
      </div>
    </div>

    <!-- 重命名文件夹弹窗 -->
    <div v-if="showRenameFolder" class="modal-overlay" @click="closeModal">
      <div class="modal-content" @click.stop>
        <h2>重命名文件夹</h2>
        <input 
          v-model="renameFolderName" 
          placeholder="请输入新名称" 
          class="folder-input"
          @keyup.enter="confirmRename"
        />
        <div class="modal-actions">
          <button class="btn cancel" @click="closeModal">取消</button>
          <button class="btn confirm" @click="confirmRename">保存</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { categoryApi } from '@/services/api.js';

const router = useRouter();

// 文件夹数据（分类数据）
const folders = ref([]);
const loading = ref(false);
const error = ref(null);

// 弹窗状态
const showCreateFolder = ref(false);
const showRenameFolder = ref(false);
const newFolderName = ref('');
const renameFolderName = ref('');
const currentFolder = ref(null);

// 获取分类列表
const loadCategories = async () => {
  loading.value = true;
  error.value = null;
  try {
    const response = await categoryApi.getCategories({ media_type: 'image' });
    if (response.code === 200 && response.data) {
      // 将分类数据映射为文件夹格式
      folders.value = response.data.map(category => ({
        id: category.id,
        name: category.name,
        imageCount: category.albums?.length || 0, // 使用albums数量作为图片数量
        createdAt: category.created_at ? category.created_at.split('T')[0] : new Date().toISOString().split('T')[0],
        description: category.description,
        mediaType: category.media_type
      }));
    } else {
      throw new Error('获取分类数据失败');
    }
  } catch (err) {
    console.error('加载分类失败:', err);
    error.value = err.message || '加载分类失败';
    // 如果接口失败，使用空数组
    folders.value = [];
  } finally {
    loading.value = false;
  }
};

// 创建文件夹（创建分类）
const createFolder = async () => {
  if (newFolderName.value.trim()) {
    try {
      const response = await categoryApi.createCategory({
        name: newFolderName.value.trim(),
        media_type: 'image',
        description: ''
      });
      
      if (response.code === 200||response.code === 201) {
        // 重新加载分类列表
        await loadCategories();
        newFolderName.value = '';
        closeModal();
      } else {
        throw new Error(response.message || '创建分类失败');
      }
    } catch (err) {
      console.error('创建分类失败:', err);
      alert('创建分类失败: ' + (err.message || '未知错误'));
    }
  }
};

const renameFolder = (folder) => {
  currentFolder.value = folder;
  renameFolderName.value = folder.name;
  showRenameFolder.value = true;
};

const confirmRename = async () => {
  if (currentFolder.value && renameFolderName.value.trim()) {
    try {
      const response = await categoryApi.updateCategory(currentFolder.value.id, {
        name: renameFolderName.value.trim()
      });
      
      if (response.code === 200) {
        await loadCategories();
        closeModal();
      } else {
        throw new Error(response.message || '更新分类失败');
      }
    } catch (err) {
      console.error('更新分类失败:', err);
      alert('更新分类失败: ' + (err.message || '未知错误'));
    }
  }
};

const deleteFolder = async (folder) => {
  if (confirm(`确定要删除文件夹 "${folder.name}" 吗？此操作不可恢复。`)) {
    try {
      const response = await categoryApi.deleteCategory(folder.id);
      
      if (response.code === 200) {
        await loadCategories();
      } else {
        throw new Error(response.message || '删除分类失败');
      }
    } catch (err) {
      console.error('删除分类失败:', err);
      alert('删除分类失败: ' + (err.message || '未知错误'));
    }
  }
};

const openFolder = (folder) => {
  router.push(`/folder-management/${folder.id}`);
};

const closeModal = () => {
  showCreateFolder.value = false;
  showRenameFolder.value = false;
  newFolderName.value = '';
  renameFolderName.value = '';
  currentFolder.value = null;
};

const goBack = () => {
  router.push('/');
};

// 页面加载时获取分类数据
onMounted(() => {
  loadCategories();
});
</script>

<style scoped>
.image-management {
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

.header-left {
  display: flex;
  align-items: center;
  gap: 20px;
}

.back-btn {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 10px 20px;
  background: #f8f9fa;
  color: #333;
  border: 2px solid #e0e0e0;
  border-radius: 25px;
  font-size: 1em;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
}

.back-btn:hover {
  background: #e9ecef;
  border-color: #adb5bd;
  transform: translateY(-2px);
}

.back-btn span {
  font-size: 1.2em;
}

.page-header h1 {
  font-size: 2.5em;
  font-weight: 700;
  color: #333;
  margin: 0;
}

.create-folder-btn {
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

.create-folder-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 25px rgba(102, 126, 234, 0.3);
}

.create-folder-btn span {
  font-size: 1.2em;
  font-weight: bold;
}

.folders-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 20px;
  max-width: 1200px;
  margin: 0 auto;
}

.folder-card {
  background: white;
  border-radius: 15px;
  padding: 25px;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
  position: relative;
  overflow: visible;
}

.folder-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 12px 32px rgba(0, 0, 0, 0.15);
}

.folder-icon {
  font-size: 3em;
  text-align: center;
  margin-bottom: 15px;
}

.folder-info h3 {
  font-size: 1.4em;
  font-weight: 600;
  color: #333;
  margin: 0 0 8px 0;
}

.folder-count {
  font-size: 1em;
  color: #667eea;
  font-weight: 500;
  margin: 0 0 5px 0;
}

.folder-date {
  font-size: 0.9em;
  color: #999;
  margin: 0;
}

.folder-actions {
  position: absolute;
  top: 15px;
  right: 15px;
  display: flex;
  gap: 8px;
  opacity: 1;
  transition: opacity 0.3s ease;
  z-index: 10;
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
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.action-btn.rename {
  background: #e3f2fd;
  color: #1976d2;
  border: 2px solid #1976d2;
}

.action-btn.rename:hover {
  background: #1976d2;
  color: white;
}

.action-btn.delete {
  background: #ffebee;
  color: #f44336;
  border: 2px solid #f44336;
}

.action-btn.delete:hover {
  background: #f44336;
  color: white;
}

.empty-state {
  grid-column: 1 / -1;
  text-align: center;
  padding: 60px 20px;
  color: #666;
}

.empty-icon {
  font-size: 4em;
  margin-bottom: 20px;
  opacity: 0.5;
}

.empty-state h3 {
  font-size: 1.5em;
  margin: 0 0 10px 0;
  color: #333;
}

.empty-state p {
  font-size: 1.1em;
  color: #666;
  margin: 0;
}

.loading-state,
.error-state {
  grid-column: 1 / -1;
  text-align: center;
  padding: 60px 20px;
  color: #666;
}

.loading-spinner {
  width: 50px;
  height: 50px;
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
  opacity: 0.5;
}

.error-state h3 {
  font-size: 1.5em;
  margin: 0 0 10px 0;
  color: #333;
}

.error-state p {
  font-size: 1.1em;
  color: #666;
  margin: 0 0 20px 0;
}

.retry-btn {
  padding: 12px 30px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border: none;
  border-radius: 25px;
  font-size: 1em;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
}

.retry-btn:hover {
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
  padding: 40px;
  width: 90%;
  max-width: 400px;
  text-align: center;
}

.modal-content h2 {
  font-size: 1.8em;
  font-weight: 600;
  color: #333;
  margin: 0 0 25px 0;
}

.folder-input {
  width: 100%;
  padding: 15px;
  font-size: 1.1em;
  border: 2px solid #e0e0e0;
  border-radius: 10px;
  margin-bottom: 25px;
  transition: border-color 0.3s ease;
}

.folder-input:focus {
  outline: none;
  border-color: #667eea;
}

.modal-actions {
  display: flex;
  gap: 15px;
  justify-content: center;
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

/* 响应式设计 */
@media (max-width: 768px) {
  .image-management {
    padding: 15px;
  }
  
  .page-header {
    flex-direction: column;
    gap: 20px;
    align-items: stretch;
  }

  .header-left {
    flex-direction: column;
    gap: 15px;
    align-items: stretch;
  }
  
  .back-btn {
    justify-content: center;
  }
  
  .page-header h1 {
    font-size: 2em;
    text-align: center;
  }
  
  .create-folder-btn {
    width: 100%;
    justify-content: center;
  }
  
  .folders-grid {
    grid-template-columns: 1fr;
  }
  
  .folder-card {
    padding: 20px;
  }
  
  .modal-content {
    margin: 20px;
    padding: 30px 20px;
  }
}

@media (max-width: 480px) {
  .page-header h1 {
    font-size: 1.8em;
  }
  
  .folder-info h3 {
    font-size: 1.2em;
  }
  
  .modal-actions {
    flex-direction: column;
  }
  
  .btn {
    width: 100%;
  }
}
</style>