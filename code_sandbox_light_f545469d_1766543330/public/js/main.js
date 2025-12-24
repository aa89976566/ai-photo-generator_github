// Railway 部署前端主邏輯（更新版）

// ========================================
// 全域變數
// ========================================
let uploadedImage = null;
let selectedScene = null;

// API 端點配置
const API_BASE_URL = window.location.origin; // Railway 自動使用當前網域

// ========================================
// 頁面載入初始化
// ========================================
document.addEventListener('DOMContentLoaded', () => {
  console.log('🚀 豪大大雞霸 AI 生成器已載入');
  console.log('🌐 API 端點:', API_BASE_URL);
  
  checkLINEVerification();
  initializeEventListeners();
});

// ========================================
// LINE 驗證邏輯
// ========================================
function checkLINEVerification() {
  const urlParams = new URLSearchParams(window.location.search);
  const isVerified = urlParams.get('verified') === 'true';
  const hasVerifiedCookie = getCookie('line_verified') === 'true';

  if (isVerified || hasVerifiedCookie) {
    // 已驗證，顯示生成器
    showPage('generator-page');
    if (isVerified && !hasVerifiedCookie) {
      setCookie('line_verified', 'true', 7); // 7 天有效
    }
  } else {
    // 未驗證，顯示引導頁
    showPage('line-gate-page');
  }
}

function handleLINEVerified() {
  setCookie('line_verified', 'true', 7);
  showPage('generator-page');
  showToast('歡迎使用 AI 照片生成器！', 'success');
}

function skipLINEVerification() {
  showPage('generator-page');
  showToast('您可以開始使用生成器了！', 'info');
}

// ========================================
// 照片上傳邏輯
// ========================================
function initializeEventListeners() {
  const uploadArea = document.getElementById('upload-area');
  const fileInput = document.getElementById('file-input');

  // 點擊上傳
  uploadArea?.addEventListener('click', () => {
    fileInput?.click();
  });

  // 檔案選擇
  fileInput?.addEventListener('change', (e) => {
    const file = e.target.files[0];
    if (file) {
      handleFileUpload(file);
    }
  });

  // 拖放上傳
  uploadArea?.addEventListener('dragover', (e) => {
    e.preventDefault();
    uploadArea.classList.add('dragover');
  });

  uploadArea?.addEventListener('dragleave', () => {
    uploadArea.classList.remove('dragover');
  });

  uploadArea?.addEventListener('drop', (e) => {
    e.preventDefault();
    uploadArea.classList.remove('dragover');
    const file = e.dataTransfer.files[0];
    if (file) {
      handleFileUpload(file);
    }
  });

  // 場景選擇
  document.querySelectorAll('.scene-card').forEach(card => {
    card.addEventListener('click', () => {
      selectScene(card.dataset.scene);
    });
  });

  // 生成按鈕
  document.getElementById('generate-btn')?.addEventListener('click', startGeneration);

  // 操作按鈕
  document.getElementById('download-btn')?.addEventListener('click', downloadImage);
  document.getElementById('share-instagram')?.addEventListener('click', () => shareToSocial('instagram'));
  document.getElementById('share-threads')?.addEventListener('click', () => shareToSocial('threads'));
  document.getElementById('share-line')?.addEventListener('click', () => shareToLINE());
  document.getElementById('regenerate-btn')?.addEventListener('click', resetGenerator);
}

function handleFileUpload(file) {
  // 驗證檔案類型
  if (!file.type.match('image.*')) {
    showToast('請上傳圖片檔案（JPG、PNG）', 'error');
    return;
  }

  // 驗證檔案大小（最大 10MB）
  if (file.size > 10 * 1024 * 1024) {
    showToast('圖片檔案過大，請選擇小於 10MB 的圖片', 'error');
    return;
  }

  // 讀取並預覽圖片
  const reader = new FileReader();
  reader.onload = (e) => {
    uploadedImage = e.target.result;
    displayImagePreview(e.target.result);
    updateStepIndicator(2);
  };
  reader.readAsDataURL(file);
}

function displayImagePreview(imageUrl) {
  const uploadArea = document.getElementById('upload-area');
  const previewSection = document.getElementById('preview-section');
  const previewImg = document.getElementById('preview-img');

  uploadArea.style.display = 'none';
  previewSection.style.display = 'block';
  previewImg.src = imageUrl;
}

function changePhoto() {
  const uploadArea = document.getElementById('upload-area');
  const previewSection = document.getElementById('preview-section');
  
  uploadArea.style.display = 'flex';
  previewSection.style.display = 'none';
  uploadedImage = null;
  document.getElementById('file-input').value = '';
}

// ========================================
// 場景選擇邏輯
// ========================================
function selectScene(scene) {
  selectedScene = scene;
  
  // 更新視覺效果
  document.querySelectorAll('.scene-card').forEach(card => {
    card.classList.remove('selected');
  });
  document.querySelector(`[data-scene="${scene}"]`)?.classList.add('selected');
  
  // 啟用生成按鈕
  const generateBtn = document.getElementById('generate-btn');
  if (uploadedImage && selectedScene) {
    generateBtn.disabled = false;
    generateBtn.textContent = '🎨 開始生成照片';
  }
}

function updateStepIndicator(step) {
  document.querySelectorAll('.step').forEach((el, index) => {
    if (index < step) {
      el.classList.add('active');
    }
  });
}

// ========================================
// AI 生成邏輯
// ========================================
async function startGeneration() {
  if (!uploadedImage || !selectedScene) {
    showToast('請先上傳照片並選擇場景', 'error');
    return;
  }

  showPage('loading-page');
  updateStepIndicator(3);
  startLoadingAnimation();

  try {
    console.log(`[${new Date().toISOString()}] 開始生成 - 場景: ${selectedScene}`);
    
    // 調用後端 API
    const response = await fetch(`${API_BASE_URL}/api/generate`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        scene: selectedScene
      })
    });

    const data = await response.json();
    console.log(`[${new Date().toISOString()}] API 回應:`, data);

    if (data.success && data.imageUrl) {
      displayResult(data.imageUrl);
    } else {
      throw new Error(data.error || '生成失敗');
    }

  } catch (error) {
    console.error('生成錯誤:', error);
    stopLoadingAnimation();
    showPage('generator-page');
    showToast('生成失敗：' + error.message, 'error');
  }
}

function startLoadingAnimation() {
  let progress = 0;
  const progressBar = document.getElementById('progress-bar');
  const progressText = document.getElementById('progress-text');
  const loadingTips = document.querySelectorAll('.loading-tip');
  let currentTip = 0;

  // 進度條動畫
  const progressInterval = setInterval(() => {
    if (progress < 90) {
      progress += Math.random() * 10;
      progress = Math.min(progress, 90);
      progressBar.style.width = progress + '%';
      progressText.textContent = Math.floor(progress) + '%';
    }
  }, 1000);

  // 提示文字輪播
  const tipInterval = setInterval(() => {
    loadingTips[currentTip].classList.remove('active');
    currentTip = (currentTip + 1) % loadingTips.length;
    loadingTips[currentTip].classList.add('active');
  }, 3000);

  window.loadingIntervals = { progressInterval, tipInterval };
}

function stopLoadingAnimation() {
  if (window.loadingIntervals) {
    clearInterval(window.loadingIntervals.progressInterval);
    clearInterval(window.loadingIntervals.tipInterval);
  }
}

function displayResult(imageUrl) {
  stopLoadingAnimation();
  
  // 完成進度條
  document.getElementById('progress-bar').style.width = '100%';
  document.getElementById('progress-text').textContent = '100%';

  setTimeout(() => {
    const resultImg = document.getElementById('result-img');
    resultImg.src = imageUrl;
    resultImg.dataset.url = imageUrl;
    showPage('result-page');
    showToast('照片生成成功！', 'success');
  }, 500);
}

// ========================================
// 結果操作
// ========================================
function downloadImage() {
  const resultImg = document.getElementById('result-img');
  const imageUrl = resultImg.dataset.url || resultImg.src;
  
  const link = document.createElement('a');
  link.href = imageUrl;
  link.download = `豪大大雞霸_${new Date().getTime()}.jpg`;
  link.click();
  
  showToast('照片下載中...', 'success');
}

function shareToSocial(platform) {
  const messages = {
    instagram: 'Instagram 不支援直接分享，請先下載照片後再上傳到 Instagram',
    threads: 'Threads 不支援直接分享，請先下載照片後再上傳到 Threads'
  };
  
  showToast(messages[platform], 'info');
}

function shareToLINE() {
  const resultImg = document.getElementById('result-img');
  const imageUrl = resultImg.dataset.url || resultImg.src;
  const text = '看看我的毛孩和豪大大雞霸的超萌照片！🐕🐈🍗';
  const shareUrl = `https://line.me/R/msg/text/?${encodeURIComponent(text + ' ' + imageUrl)}`;
  
  window.open(shareUrl, '_blank');
}

function resetGenerator() {
  uploadedImage = null;
  selectedScene = null;
  
  // 重置 UI
  document.getElementById('file-input').value = '';
  document.getElementById('upload-area').style.display = 'flex';
  document.getElementById('preview-section').style.display = 'none';
  document.querySelectorAll('.scene-card').forEach(card => {
    card.classList.remove('selected');
  });
  document.getElementById('generate-btn').disabled = true;
  document.querySelectorAll('.step').forEach(el => {
    el.classList.remove('active');
  });
  
  showPage('generator-page');
  updateStepIndicator(1);
}

// ========================================
// 工具函數
// ========================================
function showPage(pageId) {
  document.querySelectorAll('.page').forEach(page => {
    page.classList.remove('active');
  });
  document.getElementById(pageId)?.classList.add('active');
}

function showToast(message, type = 'info') {
  const toast = document.createElement('div');
  toast.className = `toast toast-${type}`;
  toast.textContent = message;
  
  document.body.appendChild(toast);
  
  setTimeout(() => {
    toast.classList.add('show');
  }, 100);
  
  setTimeout(() => {
    toast.classList.remove('show');
    setTimeout(() => toast.remove(), 300);
  }, 3000);
}

function setCookie(name, value, days) {
  const expires = new Date();
  expires.setTime(expires.getTime() + days * 24 * 60 * 60 * 1000);
  document.cookie = `${name}=${value};expires=${expires.toUTCString()};path=/`;
}

function getCookie(name) {
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop().split(';').shift();
  return null;
}
