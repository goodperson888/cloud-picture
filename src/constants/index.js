/**
 * 项目常量定义
 */

// 路由名称
export const ROUTE_NAMES = {
  HOME: 'Home',
  IMAGE_DETAIL: 'ImageDetail',
  USER_PROFILE: 'UserProfile',
  FOLDER_MANAGEMENT: 'FolderManagement',
  GROUP_MANAGEMENT: 'GroupManagement',
};

// 本地存储键名
export const STORAGE_KEYS = {
  USER_INFO: 'user_info',
  TOKEN: 'token',
  SETTINGS: 'settings',
  RECENT_IMAGES: 'recent_images',
};

// 事件名称
export const EVENT_NAMES = {
  IMAGE_UPLOADED: 'image_uploaded',
  FOLDER_CREATED: 'folder_created',
  FOLDER_UPDATED: 'folder_updated',
  FOLDER_DELETED: 'folder_deleted',
  IMAGE_DELETED: 'image_deleted',
  USER_UPDATED: 'user_updated',
};

// 图片相关常量
export const IMAGE_CONFIG = {
  MAX_SIZE: 10 * 1024 * 1024, // 10MB
  ALLOWED_TYPES: ['image/jpeg', 'image/png', 'image/gif', 'image/webp'],
  MAX_WIDTH: 4000,
  MAX_HEIGHT: 4000,
  THUMBNAIL_SIZE: 200,
};

// 分页配置
export const PAGINATION = {
  DEFAULT_PAGE_SIZE: 20,
  PAGE_SIZES: [10, 20, 50, 100],
};

// 动画配置
export const ANIMATION_CONFIG = {
  DURATION: 300,
  EASING: 'ease-in-out',
};

// 响应式断点
export const BREAKPOINTS = {
  MOBILE: 768,
  TABLET: 1024,
  DESKTOP: 1200,
};

// 错误码
export const ERROR_CODES = {
  NETWORK_ERROR: 'NETWORK_ERROR',
  UNAUTHORIZED: 'UNAUTHORIZED',
  FORBIDDEN: 'FORBIDDEN',
  NOT_FOUND: 'NOT_FOUND',
  VALIDATION_ERROR: 'VALIDATION_ERROR',
  SERVER_ERROR: 'SERVER_ERROR',
};

// 默认配置
export const DEFAULT_CONFIG = {
  THEME: 'light',
  LANGUAGE: 'zh-CN',
  AUTO_SAVE: true,
  SHOW_THUMBNAILS: true,
  LAZY_LOAD: true,
};

// 分类选项
export const CATEGORIES = [
  { id: 'all', name: '全部', icon: '🏠' },
  { id: 'nature', name: '自然风景', icon: '🌲' },
  { id: 'city', name: '城市建筑', icon: '🏙️' },
  { id: 'people', name: '人物肖像', icon: '👥' },
  { id: 'food', name: '美食料理', icon: '🍔' },
  { id: 'travel', name: '旅行记录', icon: '✈️' },
  { id: 'art', name: '艺术创作', icon: '🎨' },
  { id: 'pets', name: '萌宠动物', icon: '🐱' },
];

// 排序选项
export const SORT_OPTIONS = [
  { value: 'newest', label: '最新上传' },
  { value: 'oldest', label: '最早上传' },
  { value: 'name', label: '名称排序' },
  { value: 'size', label: '大小排序' },
];

// 操作类型
export const ACTION_TYPES = {
  VIEW: 'view',
  EDIT: 'edit',
  DELETE: 'delete',
  DOWNLOAD: 'download',
  SHARE: 'share',
  MOVE: 'move',
};

// 文件状态
export const FILE_STATUS = {
  UPLOADING: 'uploading',
  PROCESSING: 'processing',
  COMPLETED: 'completed',
  FAILED: 'failed',
};

// 提示消息
export const MESSAGES = {
  SUCCESS: '操作成功',
  ERROR: '操作失败',
  UPLOAD_SUCCESS: '上传成功',
  UPLOAD_FAILED: '上传失败',
  DELETE_CONFIRM: '确定要删除吗？此操作不可恢复',
  SAVE_SUCCESS: '保存成功',
  NETWORK_ERROR: '网络连接错误，请稍后重试',
};

// 正则表达式
export const REGEX = {
  EMAIL: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  PHONE: /^1[3-9]\d{9}$/,
  URL: /^https?:\/\/.+\..+/,
  FILE_NAME: /^[\w\-]+(\.[\w\-]+)*$/,
};

// 缓存时间(毫秒)
export const CACHE_DURATION = {
  SHORT: 5 * 60 * 1000, // 5分钟
  MEDIUM: 30 * 60 * 1000, // 30分钟
  LONG: 24 * 60 * 60 * 1000, // 24小时
};

// 拖拽配置
export const DRAG_CONFIG = {
  GHOST_CLASS: 'sortable-ghost',
  CHOSEN_CLASS: 'sortable-chosen',
  DRAG_CLASS: 'sortable-drag',
  ANIMATION: 150,
  HANDLE: '.drag-handle',
};

// 水印配置
export const WATERMARK_CONFIG = {
  TEXT: 'CloudPicture',
  FONT_SIZE: 20,
  COLOR: 'rgba(255, 255, 255, 0.3)',
  POSITION: 'bottom-right',
  ROTATION: -45,
};

// 分享配置
export const SHARE_CONFIG = {
  EXPIRE_TIME: 7 * 24 * 60 * 60 * 1000, // 7天
  MAX_SHARES: 10,
  PASSWORD_LENGTH: 6,
};

// 搜索配置
export const SEARCH_CONFIG = {
  MIN_LENGTH: 2,
  MAX_RESULTS: 100,
  DEBOUNCE_DELAY: 300,
};

// 上传配置
export const UPLOAD_CONFIG = {
  CHUNK_SIZE: 2 * 1024 * 1024, // 2MB
  MAX_CONCURRENT: 3,
  RETRY_COUNT: 3,
  RETRY_DELAY: 1000,
};

// 预览配置
export const PREVIEW_CONFIG = {
  MAX_ZOOM: 5,
  MIN_ZOOM: 0.1,
  ZOOM_STEP: 0.1,
  ROTATION_STEP: 90,
};

// 主题配置
export const THEMES = [
  { value: 'light', label: '浅色主题', icon: '☀️' },
  { value: 'dark', label: '深色主题', icon: '🌙' },
  { value: 'auto', label: '跟随系统', icon: '🔄' },
];

// 语言配置
export const LANGUAGES = [
  { value: 'zh-CN', label: '简体中文', flag: '🇨🇳' },
  { value: 'en-US', label: 'English', flag: '🇺🇸' },
  { value: 'ja-JP', label: '日本語', flag: '🇯🇵' },
];