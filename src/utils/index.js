/**
 * 工具函数集合
 */

/**
 * 防抖函数
 * @param {Function} func - 要执行的函数
 * @param {number} wait - 延迟时间(ms)
 * @returns {Function} - 防抖后的函数
 */
export function debounce(func, wait) {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}

/**
 * 节流函数
 * @param {Function} func - 要执行的函数
 * @param {number} limit - 时间间隔(ms)
 * @returns {Function} - 节流后的函数
 */
export function throttle(func, limit) {
  let inThrottle;
  return function() {
    const args = arguments;
    const context = this;
    if (!inThrottle) {
      func.apply(context, args);
      inThrottle = true;
      setTimeout(() => inThrottle = false, limit);
    }
  };
}

/**
 * 格式化文件大小
 * @param {number} bytes - 字节数
 * @returns {string} - 格式化后的大小
 */
export function formatFileSize(bytes) {
  if (bytes === 0) return '0 B';
  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB', 'TB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

/**
 * 生成唯一ID
 * @returns {string} - 唯一ID
 */
export function generateId() {
  return Date.now().toString(36) + Math.random().toString(36).substr(2);
}

/**
 * 深拷贝对象
 * @param {Object} obj - 要拷贝的对象
 * @returns {Object} - 拷贝后的对象
 */
export function deepClone(obj) {
  if (obj === null || typeof obj !== 'object') return obj;
  if (obj instanceof Date) return new Date(obj.getTime());
  if (obj instanceof Array) return obj.map(item => deepClone(item));
  if (typeof obj === 'object') {
    const cloned = {};
    Object.keys(obj).forEach(key => {
      cloned[key] = deepClone(obj[key]);
    });
    return cloned;
  }
}

/**
 * 判断是否为图片文件
 * @param {string} filename - 文件名
 * @returns {boolean} - 是否为图片
 */
export function isImageFile(filename) {
  const imageExtensions = ['jpg', 'jpeg', 'png', 'gif', 'bmp', 'webp', 'svg'];
  const extension = filename.toLowerCase().split('.').pop();
  return imageExtensions.includes(extension);
}

/**
 * 获取图片的备用URL
 * @returns {string} - 随机备用图片URL
 */
export function getBackupImage() {
  const backupImages = [
    'https://via.placeholder.com/400x300/4CAF50/ffffff?text=Image+1',
    'https://via.placeholder.com/400x300/2196F3/ffffff?text=Image+2',
    'https://via.placeholder.com/400x300/FF9800/ffffff?text=Image+3',
    'https://via.placeholder.com/400x300/9C27B0/ffffff?text=Image+4',
    'https://via.placeholder.com/400x300/F44336/ffffff?text=Image+5',
  ];
  return backupImages[Math.floor(Math.random() * backupImages.length)];
}

/**
 * 延迟执行
 * @param {number} ms - 延迟时间(ms)
 * @returns {Promise} - Promise
 */
export function delay(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

/**
 * 验证邮箱格式
 * @param {string} email - 邮箱地址
 * @returns {boolean} - 是否有效
 */
export function validateEmail(email) {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(email);
}

/**
 * 验证手机号码
 * @param {string} phone - 手机号码
 * @returns {boolean} - 是否有效
 */
export function validatePhone(phone) {
  const re = /^1[3-9]\d{9}$/;
  return re.test(phone);
}