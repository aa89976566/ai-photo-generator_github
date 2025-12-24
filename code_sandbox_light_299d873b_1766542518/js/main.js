/**
 * 豪大大雞霸 AI 寵物照片生成器 - 前端主邏輯
 * Main JavaScript for Haodada AI Pet Photo Generator
 */

// ==================== 全局變數 ====================
let uploadedImage = null;
let selectedScene = null;
let isGenerating = false;

// API 配置 - 根據環境自動選擇
const API_BASE_URL = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1'
  ? 'http://localhost:3000'  // 本地開發
  : '';  // 生產環境（同域名）

// ==================== 初始化 ====================
document.addEventListener('DOMContentLoaded', function() {
  console.log('豪大大雞霸 AI 生成器已啟動');
  
  // 檢查是否已驗證 LINE 好友
  checkLineVerification();
  
  // 初始化事件監聽器
  initializeEventListeners();
  
  // 初始化場景選擇
  initializeSceneSelection();
});

// ==================== LINE 驗證邏輯 ====================
function checkLineVerification() {
  // 檢查 URL 參數
  const urlParams = new URLSearchParams(window.location.search);
  const isVerified = urlParams.get('verified') === 'true';
  
  // 檢查 Cookie
  const hasVerifiedCookie = getCookie('line_verified') === 'true';
  
  if (isVerified || hasVerifiedCookie) {
    // 已驗證，顯示生成器
    setVerificationCookie();
    showGenerator();
  } else {
    // 未驗證，顯示引導頁
    showWelcomePage();
  }
}

function setVerificationCookie() {
  // 設置 7 天有效期的 Cookie
  const expires = new Date();
  expires.setDate(expires.getDate() + 7);
  document.cookie = `line_verified=true; expires=${expires.toUTCString()}; path=/`;
}

function getCookie(name) {
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop().split(';').shift();
  return null;
}

function showWelcomePage() {
  document.getElementById('welcome-page').classList.add('active');
  document.getElementById('generator-page').classList.remove('active');
}

function showGenerator() {
  document.getElementById('welcome-page').classList.remove('active');
  document.getElementById('generator-page').classList.add('active');
}

// ==================== 事件監聽器初始化 ====================
function initializeEventListeners() {
  // LINE 加好友按鈕
  const addLineBtn = document.getElementById('add-line-btn');
  if (addLineBtn) {
    addLineBtn.addEventListener('click', function() {
      window.open('https://line.me/R/ti/p/@902rkfzv', '_blank');
    });
  }
  
  // 已加入按鈕
  const verifiedBtn = document.getElementById('verified-btn');
  if (verifiedBtn) {
    verifiedBtn.addEventListener('click', function() {
      setVerificationCookie();
      showGenerator();
    });
  }
  
  // 照片上傳
  const uploadArea = document.getElementById('upload-area');
  const fileInput = document.getElementById('file-input');
  
  if (uploadArea && fileInput) {
    uploadArea.addEventListener('click', () => fileInput.click());
    
    // 拖放上傳
    uploadArea.addEventListener('dragover', handleDragOver);
    uploadArea.addEventListener('dragleave', handleDragLeave);
    uploadArea.addEventListener('drop', handleDrop);
    
    // 文件選擇
    fileInput.addEventListener('change', handleFileSelect);
  }
  
  // 重新上傳按鈕
  const reuploadBtn = document.getElementById('reupload-btn');
  if (reuploadBtn) {
    reuploadBtn.addEventListener('click', resetUpload);
  }
  
  // 生成按鈕
  const generateBtn = document.getElementById('generate-btn');
  if (generateBtn) {
    generateBtn.addEventListener('click', startGeneration);
  }
  
  // 結果頁面按鈕
  const downloadBtn = document.getElementById('download-btn');
  const shareInstagramBtn = document.getElementById('share-instagram-btn');
  const shareThreadsBtn = document.getElementById('share-threads-btn');
  const shareLineBtn = document.getElementById('share-line-btn');
  const regenerateBtn = document.getElementById('regenerate-btn');
  
  if (downloadBtn) downloadBtn.addEventListener('click', downloadImage);
  if (shareInstagramBtn) shareInstagramBtn.addEventListener('click', () => shareToSocial('instagram'));
  if (shareThreadsBtn) shareThreadsBtn.addEventListener('click', () => shareToSocial('threads'));
  if (shareLineBtn) shareLineBtn.addEventListener('click', () => shareToSocial('line'));
  if (regenerateBtn) regenerateBtn.addEventListener('click', resetGenerator);
}

// ==================== 場景選擇邏輯 ====================
function initializeSceneSelection() {
  const sceneCards = document.querySelectorAll('.scene-card');
  
  sceneCards.forEach(card => {
    card.addEventListener('click', function() {
      // 移除所有選中狀態
      sceneCards.forEach(c => c.classList.remove('selected'));
      
      // 設置當前選中
      this.classList.add('selected');
      selectedScene = this.dataset.scene;
      
      console.log('選擇場景:', selectedScene);
      updateGenerateButton();
    });
  });
}

function updateGenerateButton() {
  const generateBtn = document.getElementById('generate-btn');
  if (generateBtn) {
    generateBtn.disabled = !(uploadedImage && selectedScene);
  }
}

// ==================== 照片上傳邏輯 ====================
function handleDragOver(e) {
  e.preventDefault();
  e.stopPropagation();
  this.classList.add('dragover');
}

function handleDragLeave(e) {
  e.preventDefault();
  e.stopPropagation();
  this.classList.remove('dragover');
}

function handleDrop(e) {
  e.preventDefault();
  e.stopPropagation();
  this.classList.remove('dragover');
  
  const files = e.dataTransfer.files;
  if (files.length > 0) {
    processFile(files[0]);
  }
}

function handleFileSelect(e) {
  const files = e.target.files;
  if (files.length > 0) {
    processFile(files[0]);
  }
}

function processFile(file) {
  // 驗證文件類型
  const validTypes = ['image/jpeg', 'image/jpg', 'image/png'];
  if (!validTypes.includes(file.type)) {
    showToast('請上傳 JPG 或 PNG 格式的圖片', 'error');
    return;
  }
  
  // 驗證文件大小（最大 10MB）
  const maxSize = 10 * 1024 * 1024;
  if (file.size > maxSize) {
    showToast('圖片大小不能超過 10MB', 'error');
    return;
  }
  
  // 讀取並預覽圖片
  const reader = new FileReader();
  reader.onload = function(e) {
    uploadedImage = {
      file: file,
      dataUrl: e.target.result
    };
    
    displayImagePreview(e.target.result);
    updateGenerateButton();
  };
  reader.readAsDataURL(file);
}

function displayImagePreview(dataUrl) {
  const uploadArea = document.getElementById('upload-area');
  const previewArea = document.getElementById('preview-area');
  const previewImage = document.getElementById('preview-image');
  
  if (uploadArea && previewArea && previewImage) {
    previewImage.src = dataUrl;
    uploadArea.style.display = 'none';
    previewArea.style.display = 'block';
  }
}

function resetUpload() {
  uploadedImage = null;
  
  const uploadArea = document.getElementById('upload-area');
  const previewArea = document.getElementById('preview-area');
  const fileInput = document.getElementById('file-input');
  
  if (uploadArea && previewArea) {
    uploadArea.style.display = 'flex';
    previewArea.style.display = 'none';
  }
  
  if (fileInput) {
    fileInput.value = '';
  }
  
  updateGenerateButton();
}

// ==================== AI 生成邏輯 ====================
async function startGeneration() {
  if (!uploadedImage || !selectedScene || isGenerating) {
    return;
  }
  
  isGenerating = true;
  
  // 顯示載入頁面
  showLoadingPage();
  
  try {
    // 調用後端 API 生成圖片
    const imageUrl = await generateWithAI(uploadedImage, selectedScene);
    
    // 顯示結果
    showResult(imageUrl);
    
  } catch (error) {
    console.error('生成失敗:', error);
    showToast('生成失敗，請稍後再試', 'error');
    hideLoadingPage();
  } finally {
    isGenerating = false;
  }
}

/**
 * 調用後端 API 生成圖片
 * @param {Object} imageData - 上傳的圖片數據
 * @param {string} scene - 選擇的場景
 * @returns {Promise<string>} 生成的圖片 URL
 */
async function generateWithAI(imageData, scene) {
  console.log('開始生成 AI 圖片...', { scene });
  
  // 準備請求數據
  const requestData = {
    scene: scene,
    animalType: 'pet'  // 可以後續擴展為自動識別動物類型
  };
  
  try {
    // 調用後端 API
    const response = await fetch(`${API_BASE_URL}/api/generate`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(requestData)
    });
    
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
    }
    
    const result = await response.json();
    
    if (!result.success || !result.imageUrl) {
      throw new Error('API 返回的數據無效');
    }
    
    console.log('圖片生成成功:', result.imageUrl);
    return result.imageUrl;
    
  } catch (error) {
    console.error('API 調用失敗:', error);
    throw error;
  }
}

// ==================== 頁面切換邏輯 ====================
function showLoadingPage() {
  document.getElementById('upload-section').style.display = 'none';
  document.getElementById('scene-section').style.display = 'none';
  document.getElementById('loading-section').classList.add('active');
  
  // 啟動進度條動畫
  startProgressAnimation();
  
  // 啟動提示文字輪播
  startTipCarousel();
}

function hideLoadingPage() {
  document.getElementById('loading-section').classList.remove('active');
  document.getElementById('upload-section').style.display = 'block';
  document.getElementById('scene-section').style.display = 'block';
}

function showResult(imageUrl) {
  // 隱藏載入頁面
  hideLoadingPage();
  
  // 設置結果圖片
  const resultImage = document.getElementById('result-image');
  if (resultImage) {
    resultImage.src = imageUrl;
    resultImage.dataset.url = imageUrl;
  }
  
  // 顯示結果頁面
  const resultSection = document.getElementById('result-section');
  if (resultSection) {
    resultSection.classList.add('active');
  }
  
  // 隱藏生成器頁面的其他部分
  document.getElementById('upload-section').style.display = 'none';
  document.getElementById('scene-section').style.display = 'none';
}

// ==================== 進度條動畫 ====================
function startProgressAnimation() {
  const progressBar = document.getElementById('progress-bar');
  const progressText = document.getElementById('progress-text');
  
  let progress = 0;
  const interval = setInterval(() => {
    progress += Math.random() * 3;
    
    if (progress >= 100) {
      progress = 100;
      clearInterval(interval);
    }
    
    if (progressBar && progressText) {
      progressBar.style.width = progress + '%';
      progressText.textContent = Math.floor(progress) + '%';
    }
  }, 200);
}

// ==================== 提示文字輪播 ====================
function startTipCarousel() {
  const tips = [
    '正在分析您的寵物照片...',
    '準備豪大大雞霸美味...',
    '選擇最佳拍攝角度...',
    '調整光線和色彩...',
    '讓您的毛孩更可愛...',
    '添加擬人化效果...',
    '即將完成，請稍候...'
  ];
  
  const tipElement = document.querySelector('.loading-tip');
  let currentTip = 0;
  
  const interval = setInterval(() => {
    currentTip = (currentTip + 1) % tips.length;
    if (tipElement) {
      tipElement.style.opacity = '0';
      setTimeout(() => {
        tipElement.textContent = tips[currentTip];
        tipElement.style.opacity = '1';
      }, 300);
    }
  }, 3000);
}

// ==================== 結果操作邏輯 ====================
function downloadImage() {
  const resultImage = document.getElementById('result-image');
  if (!resultImage || !resultImage.dataset.url) {
    showToast('無法下載圖片', 'error');
    return;
  }
  
  const imageUrl = resultImage.dataset.url;
  const fileName = `haodada-pet-${Date.now()}.jpg`;
  
  // 創建下載鏈接
  const link = document.createElement('a');
  link.href = imageUrl;
  link.download = fileName;
  link.click();
  
  showToast('圖片已下載！', 'success');
}

function shareToSocial(platform) {
  const resultImage = document.getElementById('result-image');
  if (!resultImage || !resultImage.dataset.url) {
    showToast('無法分享圖片', 'error');
    return;
  }
  
  const imageUrl = resultImage.dataset.url;
  const shareText = '看看我用豪大大雞霸 AI 生成器做的超萌寵物照！🐾🍗';
  
  switch(platform) {
    case 'instagram':
      showToast('請先下載圖片，然後在 Instagram 分享', 'info');
      break;
      
    case 'threads':
      showToast('請先下載圖片，然後在 Threads 分享', 'info');
      break;
      
    case 'line':
      const lineUrl = `https://social-plugins.line.me/lineit/share?url=${encodeURIComponent(window.location.href)}`;
      window.open(lineUrl, '_blank');
      break;
      
    default:
      showToast('不支援的分享平台', 'error');
  }
}

function resetGenerator() {
  // 重置所有狀態
  uploadedImage = null;
  selectedScene = null;
  isGenerating = false;
  
  // 隱藏結果頁面
  const resultSection = document.getElementById('result-section');
  if (resultSection) {
    resultSection.classList.remove('active');
  }
  
  // 顯示上傳和場景選擇
  document.getElementById('upload-section').style.display = 'block';
  document.getElementById('scene-section').style.display = 'block';
  
  // 重置上傳區域
  resetUpload();
  
  // 重置場景選擇
  document.querySelectorAll('.scene-card').forEach(card => {
    card.classList.remove('selected');
  });
  
  // 重置生成按鈕
  updateGenerateButton();
  
  // 滾動到頂部
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

// ==================== Toast 通知 ====================
function showToast(message, type = 'info') {
  const toast = document.createElement('div');
  toast.className = `toast toast-${type}`;
  toast.textContent = message;
  
  document.body.appendChild(toast);
  
  // 顯示動畫
  setTimeout(() => toast.classList.add('show'), 100);
  
  // 自動隱藏
  setTimeout(() => {
    toast.classList.remove('show');
    setTimeout(() => toast.remove(), 300);
  }, 3000);
}

// ==================== 工具函數 ====================
console.log('豪大大雞霸 AI 生成器 v1.0 - Powered by Replicate API');
