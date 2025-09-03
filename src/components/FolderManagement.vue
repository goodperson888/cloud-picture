<template>
  <div class="folder-management">
    <h2>文件夹管理</h2>

    <div class="folder-actions">
      <input
        type="text"
        v-model="newFolderName"
        placeholder="新文件夹名称"
        @keyup.enter="createFolder"
      />
      <button @click="createFolder">创建文件夹</button>
    </div>

    <ul class="folder-list">
      <li v-for="folder in folders" :key="folder.id" class="folder-item">
        <span v-if="editingFolderId !== folder.id">{{ folder.name }}</span>
        <input
          v-else
          type="text"
          v-model="editingFolderName"
          @keyup.enter="saveFolderName(folder.id)"
          @blur="saveFolderName(folder.id)"
        />
        <div class="folder-item-actions">
          <button @click="editFolder(folder)">重命名</button>
          <button @click="deleteFolder(folder.id)" class="delete-button">删除</button>
        </div>
      </li>
    </ul>
  </div>
</template>

<script setup>
import { ref } from 'vue';

const folders = ref([
  { id: 1, name: '风景' },
  { id: 2, name: '人物' },
  { id: 3, name: '建筑' },
]);

const newFolderName = ref('');
const editingFolderId = ref(null);
const editingFolderName = ref('');

const createFolder = () => {
  if (newFolderName.value.trim() !== '') {
    folders.value.push({
      id: folders.value.length + 1,
      name: newFolderName.value.trim(),
    });
    newFolderName.value = '';
  }
};

const editFolder = (folder) => {
  editingFolderId.value = folder.id;
  editingFolderName.value = folder.name;
};

const saveFolderName = (id) => {
  const folder = folders.value.find((f) => f.id === id);
  if (folder && editingFolderName.value.trim() !== '') {
    folder.name = editingFolderName.value.trim();
  }
  editingFolderId.value = null;
  editingFolderName.value = '';
};

const deleteFolder = (id) => {
  folders.value = folders.value.filter((f) => f.id !== id);
};
</script>

<style scoped>
.folder-management {
  padding: 20px;
  background-color: #f9f9f9;
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
}

h2 {
  font-size: 1.8em;
  color: #333;
  margin-bottom: 20px;
  text-align: center;
}

.folder-actions {
  display: flex;
  gap: 10px;
  margin-bottom: 20px;
}

.folder-actions input {
  flex-grow: 1;
  padding: 10px;
  border: 1px solid #ddd;
  border-radius: 5px;
  font-size: 1em;
}

.folder-actions button {
  padding: 10px 15px;
  background-color: #007bff;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  font-size: 1em;
  transition: background-color 0.3s ease;
}

.folder-actions button:hover {
  background-color: #0056b3;
}

.folder-list {
  list-style: none;
  padding: 0;
}

.folder-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px 15px;
  border: 1px solid #eee;
  border-radius: 5px;
  margin-bottom: 10px;
  background-color: #fff;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.03);
}

.folder-item span {
  font-size: 1.1em;
  color: #555;
}

.folder-item input {
  flex-grow: 1;
  padding: 8px;
  border: 1px solid #007bff;
  border-radius: 4px;
  font-size: 1em;
}

.folder-item-actions button {
  margin-left: 10px;
  padding: 8px 12px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 0.9em;
  transition: background-color 0.3s ease;
}

.folder-item-actions button:first-child {
  background-color: #28a745;
  color: white;
}

.folder-item-actions button:first-child:hover {
  background-color: #218838;
}

.folder-item-actions .delete-button {
  background-color: #dc3545;
  color: white;
}

.folder-item-actions .delete-button:hover {
  background-color: #c82333;
}
</style>