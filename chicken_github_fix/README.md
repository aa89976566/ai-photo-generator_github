# 🐔 進擊的手撕雞 - AI搞笑照片生成器

讓您的毛孩秒變搞笑網紅！

## ✨ 功能特色

- 🎨 4種AI搞笑風格（浮誇吃相王、優雅貴族版、武林雞霸、雞排爆炸王）
- 📱 LINE官方帳號整合 (@902rkfzv)
- 🚀 一鍵分享到社群媒體
- 💾 聰明記憶系統（加過好友自動跳過驗證）

## 🚀 Railway 快速部署

### 步驟 1：準備 Replicate API Key
1. 前往 https://replicate.com
2. 註冊帳號 → API Tokens
3. 複製您的 API Token

### 步驟 2：在 Railway 部署
1. 前往 https://railway.app
2. New Project → Deploy from GitHub repo
3. 選擇此 Repository

### 步驟 3：設定環境變數
在 Railway 專案設定中新增：
```
REPLICATE_API_TOKEN=你的API金鑰
PORT=8080
```

### 步驟 4：等待部署完成
Railway 會自動：
- 偵測 `railway.toml` 設定
- 安裝 `requirements.txt` 套件
- 使用 `Procfile` 啟動應用

## 📁 專案結構

```
├── app.py                 # Flask 後端主程式
├── requirements.txt       # Python 套件依賴
├── Procfile              # Railway 啟動指令
├── railway.toml          # Railway 部署設定
├── runtime.txt           # Python 版本
├── templates/
│   └── index.html        # 前端頁面
├── static/               # 靜態資源
├── uploads/              # 上傳圖片暫存
└── results/              # AI生成結果暫存
```

## 💰 費用說明

- Railway 託管：免費（每月 $5 美金額度）
- Replicate AI：$0.015/張
- 100人參加成本：約 $1.5美金

## 🔧 本地測試

```bash
# 安裝套件
pip install -r requirements.txt

# 設定環境變數
export REPLICATE_API_TOKEN=你的API金鑰

# 啟動應用
python app.py
```

## 📞 LINE 官方帳號

已整合 LINE ID: @902rkfzv

## 🎯 推廣建議

- 前100名送「手撕雞體驗包」
- 分享到限動再送「$50購物金」
- 預期轉換率：80%+ LINE好友

---

Made with ❤️ for 進擊的手撕雞
