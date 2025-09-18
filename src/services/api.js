/**
 * 网络请求模块
 * 提供统一的API请求封装
 */

class ApiService {
  constructor() {
    // 使用B端接口地址
    this.baseURL = import.meta.env.VITE_API_BASE_URL || 'http://152.136.110.121:8080';
    this.timeout = 10000;
  }

  /**
   * 统一请求方法
   * @param {string} url - 请求URL
   * @param {object} options - 请求配置
   * @returns {Promise} - 返回Promise
   */
  async request(url, options = {}) {
    const token = localStorage.getItem('token');
    const config = {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...(token && { 'Authorization': `Bearer ${token}` }),
        ...options.headers,
      },
      timeout: this.timeout,
    };

    try {
      const response = await fetch(`${this.baseURL}${url}`, config);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('API请求错误:', error);
      throw error;
    }
  }

  /**
   * GET请求
   * @param {string} url - 请求URL
   * @param {object} params - URL参数
   * @returns {Promise}
   */
  async get(url, params = {}) {
    const queryString = new URLSearchParams(params).toString();
    const fullUrl = queryString ? `${url}?${queryString}` : url;
    return this.request(fullUrl, { method: 'GET' });
  }

  /**
   * POST请求
   * @param {string} url - 请求URL
   * @param {object} data - 请求数据
   * @returns {Promise}
   */
  async post(url, data = {}) {
    return this.request(url, {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  /**
   * PUT请求
   * @param {string} url - 请求URL
   * @param {object} data - 请求数据
   * @returns {Promise}
   */
  async put(url, data = {}) {
    return this.request(url, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  /**
   * DELETE请求
   * @param {string} url - 请求URL
   * @returns {Promise}
   */
  async delete(url) {
    return this.request(url, { method: 'DELETE' });
  }

  /**
   * 文件上传
   * @param {string} url - 上传URL
   * @param {File} file - 文件对象
   * @param {object} additionalData - 额外数据
   * @returns {Promise}
   */
  async uploadFile(url, file, additionalData = {}) {
    const formData = new FormData();
    formData.append('file', file);
    
    Object.keys(additionalData).forEach(key => {
      formData.append(key, additionalData[key]);
    });

    return this.request(url, {
      method: 'POST',
      body: formData,
      headers: {
        'Content-Type': undefined, // 让浏览器自动设置
      },
    });
  }
}

// 创建API实例
export const apiService = new ApiService();

// 图片相关API
export const imageApi = {
  // 获取图片列表
  getImages: (params) => apiService.get('/images', params),
  
  // 获取图片详情
  getImageDetail: (id) => apiService.get(`/images/${id}`),
  
  // 上传图片
  uploadImage: (file, data) => apiService.uploadFile('/images/upload', file, data),
  
  // 更新图片信息
  updateImage: (id, data) => apiService.put(`/images/${id}`, data),
  
  // 删除图片
  deleteImage: (id) => apiService.delete(`/images/${id}`),
};

// 文件夹相关API
export const folderApi = {
  // 获取文件夹列表
  getFolders: () => apiService.get('/folders'),
  
  // 创建文件夹
  createFolder: (data) => apiService.post('/folders', data),
  
  // 更新文件夹
  updateFolder: (id, data) => apiService.put(`/folders/${id}`, data),
  
  // 删除文件夹
  deleteFolder: (id) => apiService.delete(`/folders/${id}`),
};

// 分类相关API
export const categoryApi = {
  // 获取分类列表
  getCategories: (params = {}) => apiService.get('/api/categories', params),
  
  // 创建分类
  createCategory: (data) => apiService.post('/api/categories', data),
  
  // 更新分类
  updateCategory: (id, data) => apiService.put(`/api/categories/${id}`, data),
  
  // 删除分类
  deleteCategory: (id) => apiService.delete(`/api/categories/${id}`),
};

// 用户相关API
export const userApi = {
  // 获取用户信息
  getUserInfo: () => apiService.get('/api/user/info'),
  
  // 更新用户信息
  updateUserInfo: (data) => apiService.put('/api/user/info', data),
  
  // B端用户登录
  login: (data) => apiService.post('/api/user/login', data),
  
  // 用户注册
  register: (data) => apiService.post('/api/auth/register', data),
  
  // 发送验证码
  sendCaptcha: (data) => apiService.post('/api/auth/send-captcha', data),
};

// 图集相关API
export const albumApi = {
  // 获取分类下的图集列表
  getAlbumsByCategory: (categoryId, params = {}) => 
    apiService.get(`/api/categories/${categoryId}/albums`, params),
  
  // 创建图集
  createAlbum: (data) => apiService.post('/api/albums', data),
  
  // 获取图集详情
  getAlbumDetail: (id) => apiService.get(`/api/albums/${id}`),
  
  // 更新图集
  updateAlbum: (id, data) => apiService.put(`/api/albums/${id}`, data),
  
  // 删除图集
  deleteAlbum: (id) => apiService.delete(`/api/albums/${id}`),
  
  // 批量上传媒体文件到图集
  uploadMediaToAlbum: (albumId, files, data = {}) => {
    const formData = new FormData();
    files.forEach(file => {
      formData.append('files', file);
    });
    formData.append('album_id', albumId);
    
    Object.keys(data).forEach(key => {
      formData.append(key, data[key]);
    });

    return apiService.request('/api/media/upload', {
      method: 'POST',
      body: formData,
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
  },
};

// 导出默认实例
export default apiService;