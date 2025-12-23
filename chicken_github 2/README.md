# 🐔 進擊的手撕雞 - AI 照片生成器

[![Deploy on Railway](https://railway.app/button.svg)](https://railway.app/new)

讓你的毛孩一秒變身雞排網紅！加入 LINE 好友 **@902rkfzv** 即可免費使用。

## ✨ 功能特點

- 📱 **LINE 好友解鎖**：加好友即可使用
- 🎨 **4 種搞笑風格**：浮誇吃相王、優雅貴族版、武林雞霸、雞排爆炸王
- 📸 **簡單操作**：上傳照片 → 選風格 → 生成
- 🚀 **快速生成**：5-10 秒完成
- 💯 **完全免費**：無需付費

## 🚀 快速部署

### 方法 1：Railway（推薦）

1. 點擊上方 "Deploy on Railway" 按鈕
2. 連接您的 GitHub 帳號
3. 選擇這個 repository
4. 等待自動部署（約 3-5 分鐘）
5. 獲得公開網址！

### 方法 2：本地運行

```bash
# 克隆專案
git clone https://github.com/你的用戶名/chicken-ai-generator.git
cd chicken-ai-generator

# 安裝依賴
pip install -r requirements.txt

# 啟動服務
python app.py

# 瀏覽器開啟
http://localhost:5000
```

## 📋 專案結構

```
chicken-ai-generator/
├── app.py                 # Flask 主程式
├── templates/
│   └── index.html        # 前端頁面（已整合 LINE @902rkfzv）
├── uploads/              # 用戶上傳照片
├── results/              # 生成結果
├── requirements.txt      # Python 套件
├── Procfile             # Railway 部署設定
├── runtime.txt          # Python 版本
└── README.md            # 說明文件
```

## 🎯 LINE 官方帳號

**LINE ID: @902rkfzv**

已整合在網站中，用戶點擊加好友按鈕會自動跳轉。

## 🎨 4 種風格說明

### 🤪 浮誇吃相王
- 高對比度 + 高飽和度
- 橘色粗邊框
- 最搞笑的風格

### 👑 優雅貴族版
- 柔和粉色調
- IG 網美風格
- 適合女性用戶

### 🥋 武林雞霸
- 復古懷舊濾鏡
- 棕褐色調
- 武俠片氛圍

### 🎉 雞排爆炸王
- 超高飽和度
- 彩虹漸層邊框
- 驚喜盲盒感

## 💰 成本估算

### Railway 免費額度
- 每月 $5 美金免費額度
- 可支援約 500-1000 次生成
- 足夠初期測試使用

### 超出免費額度
- 按用量計費
- 預計每 1000 次生成約 $2-5 美金

## 🔧 環境變數

不需要設定任何環境變數，開箱即用！

## 📊 數據追蹤

系統會自動追蹤：
- 總生成次數
- 累積按讚數
- LINE 好友數

數據存儲在 `stats.json` 和 `users.json`

## 🛠️ 技術棧

- **後端**: Python 3.11 / Flask 3.0
- **圖像處理**: Pillow 10.1
- **前端**: HTML5 / CSS3 / JavaScript
- **部署**: Railway / Gunicorn

## 📱 推廣文案

### Threads
```
🎉【免費玩】進擊的手撕雞 AI 照片生成器

加 LINE 好友 @902rkfzv 就能玩 👇
📸 上傳毛孩照片
🤖 4 種搞笑風格
✨ 完全免費

👉 [你的網址]

#進擊的手撕雞 #LINE好友 #寵物AI
```

### LINE 歡迎訊息
```
🎉 歡迎加入「進擊的手撕雞」！

立即使用 AI 生成器：
👉 [你的網址]

📸 上傳照片 → 🎨 選風格 → ⚡ 3秒生成
完全免費！
```

## 🐛 常見問題

### Q: 照片上傳後沒反應？
A: 檢查檔案格式（支援 JPG/PNG）和大小（最大 16MB）

### Q: 生成速度慢？
A: 圖片越大處理越慢，建議上傳前先壓縮

### Q: 如何修改 LINE ID？
A: 編輯 `templates/index.html`，搜尋 `@902rkfzv` 並替換

### Q: 可以新增風格嗎？
A: 可以！編輯 `app.py` 的 `generate_effect_image` 函數

## 📄 授權

MIT License - 可自由使用、修改、商用

## 🤝 貢獻

歡迎提交 Issue 和 Pull Request！

## 📞 聯絡方式

- LINE 官方帳號: @902rkfzv
- 專案 Issues: [GitHub Issues](https://github.com/你的用戶名/chicken-ai-generator/issues)

## 🎉 開始使用

立即部署，讓你的毛孩變網紅！🚀
