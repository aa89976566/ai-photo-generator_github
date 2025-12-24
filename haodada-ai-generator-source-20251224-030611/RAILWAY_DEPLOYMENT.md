# 🚂 Railway 部署完整指南

## ✅ 確認事項

**AI 生成照片只使用 Replicate API** ✅
- 使用模型：`black-forest-labs/flux-schnell`
- 每張照片成本：約 $0.003 USD
- 生成時間：30-60 秒

---

## 📋 項目結構

您的專案現在有以下結構：

```
haodada-ai-generator/
├── server.js              ← Express 伺服器（後端）
├── package.json           ← Node.js 依賴配置
├── .env.example           ← 環境變數範本
├── .gitignore             ← Git 忽略規則
├── public/                ← 靜態文件目錄
│   ├── index.html         ← 主頁面
│   ├── css/
│   │   └── style.css      ← 樣式文件
│   └── js/
│       └── main.js        ← 前端邏輯
└── api/                   ← 舊的 Vercel 函數（可保留）
    └── generate.js
```

---

## 🚀 快速部署到 Railway

### **方法 A：使用 Railway CLI（推薦）**

#### **步驟 1：安裝 Railway CLI**

```bash
npm install -g @railway/cli
```

#### **步驟 2：登入 Railway**

```bash
railway login
```

#### **步驟 3：初始化專案**

```bash
railway init
```

#### **步驟 4：部署**

```bash
railway up
```

---

### **方法 B：使用 GitHub（推薦）**

#### **步驟 1：推送代碼到 GitHub**

```bash
git init
git add .
git commit -m "Initial commit - Railway deployment"
git remote add origin https://github.com/yourusername/your-repo.git
git push -u origin main
```

⚠️ **重要**：確保 `.env` 文件已在 `.gitignore` 中！

#### **步驟 2：在 Railway 連接 GitHub**

1. 登入 https://railway.app
2. 點擊 **New Project**
3. 選擇 **Deploy from GitHub repo**
4. 選擇您的儲存庫
5. Railway 會自動偵測並部署

---

## 🔧 設定環境變數

在 Railway Dashboard 中：

1. 進入您的專案
2. 點擊 **Variables** 標籤
3. 添加以下環境變數：

```
REPLICATE_API_TOKEN=r8_8BwGjrCru8vNQex891LPHf6EbRVaBAx3ezu7V
NODE_ENV=production
PORT=3000
```

4. 點擊 **Save**
5. Railway 會自動重新部署

---

## 🧪 本地測試

### **步驟 1：安裝依賴**

```bash
npm install
```

### **步驟 2：創建環境變數文件**

創建 `.env` 文件：

```env
REPLICATE_API_TOKEN=r8_8BwGjrCru8vNQex891LPHf6EbRVaBAx3ezu7V
NODE_ENV=development
PORT=3000
```

### **步驟 3：啟動伺服器**

```bash
npm start
```

或使用開發模式（自動重啟）：

```bash
npm run dev
```

### **步驟 4：測試功能**

訪問 `http://localhost:3000` 測試：
- ✅ LINE 加好友頁面
- ✅ 照片上傳
- ✅ 場景選擇
- ✅ **AI 生成照片**（確認使用 Replicate）

---

## 🔍 驗證部署

### **步驟 1：檢查健康狀態**

訪問：
```
https://your-app.up.railway.app/health
```

應該返回：
```json
{
  "status": "ok",
  "timestamp": "2024-12-24T...",
  "replicateConfigured": true
}
```

### **步驟 2：測試完整流程**

1. 訪問您的 Railway 網址
2. 點擊「我已加入，開始使用」
3. 上傳寵物照片
4. 選擇場景
5. 點擊「開始生成」
6. **等待 30-60 秒**
7. **確認真實照片生成成功** ✨

---

## 🐛 故障排除

### **問題 1：Railway 無法識別專案類型**

**錯誤訊息**：
```
⚠ Script start.sh not found
✖ Railpack could not determine how to build the app.
```

**解決方案**：
確保 `package.json` 包含 `start` 腳本：
```json
{
  "scripts": {
    "start": "node server.js"
  }
}
```

---

### **問題 2：環境變數未生效**

**症狀**：生成失敗，顯示 "API Token 未配置"

**解決方案**：
1. 檢查 Railway Dashboard → Variables
2. 確認 `REPLICATE_API_TOKEN` 已正確設定
3. 重新部署：`railway up` 或推送新 commit

---

### **問題 3：靜態文件 404**

**症狀**：CSS/JS 文件無法載入

**解決方案**：
確保文件在 `public/` 目錄下：
```
public/
├── index.html
├── css/style.css
└── js/main.js
```

---

### **問題 4：CORS 錯誤**

**症狀**：前端無法調用 API

**解決方案**：
確認 `server.js` 包含 CORS 中介軟體：
```javascript
const cors = require('cors');
app.use(cors());
```

---

### **問題 5：照片生成失敗**

**症狀**：API 返回錯誤

**檢查清單**：
- [ ] `REPLICATE_API_TOKEN` 環境變數已設定
- [ ] API Token 有效（可在 Replicate Dashboard 檢查）
- [ ] 查看 Railway Logs 確認錯誤訊息
- [ ] 確認 Replicate 帳戶有足夠餘額

---

## 📊 監控和日誌

### **使用 Railway CLI**

```bash
# 查看日誌
railway logs

# 查看專案資訊
railway status

# 打開專案網址
railway open
```

### **使用 Railway Dashboard**

1. 登入 https://railway.app
2. 進入您的專案
3. 點擊 **Deployments** 查看部署歷史
4. 點擊 **Logs** 查看即時日誌

---

## 💰 成本估算

### **Railway 主機**

- **免費方案**：每月 $5 免費額度
- **預估用量**：
  - 輕量級應用約 $0-5/月
  - 中等流量約 $5-20/月

### **Replicate API**

- **每張照片**：$0.003 USD
- **1,000 張**：$3 USD
- **10,000 張**：$30 USD

### **總成本**

- 低流量（100 張/月）：約 $5-10/月
- 中流量（1,000 張/月）：約 $8-25/月

---

## 🎯 部署後測試清單

部署完成後，請測試以下功能：

- [ ] 訪問網站首頁
- [ ] LINE 加好友頁面正常顯示
- [ ] 點擊「加入 LINE 好友」按鈕
- [ ] 點擊「我已加入，開始使用」進入生成器
- [ ] 上傳寵物照片（點擊或拖放）
- [ ] 照片預覽正常
- [ ] 選擇場景（6 種場景）
- [ ] 點擊「開始生成」
- [ ] **觀察載入動畫（30-60 秒）**
- [ ] **確認真實照片生成成功** ✨
- [ ] 下載功能正常
- [ ] 分享功能正常
- [ ] 重新生成功能正常

---

## 📱 LINE 官方帳號設定

### **步驟 1：生成 QR Code**

使用您的 Railway 網址生成 QR Code：
```
https://your-app.up.railway.app
```

推薦工具：
- https://www.qr-code-generator.com/
- https://www.qrcode-monkey.com/

### **步驟 2：設定歡迎訊息**

登入 LINE Official Account Manager：
https://manager.line.biz/

設定自動回覆訊息：
```
🎉 歡迎加入豪大大雞霸官方帳號！

立即使用 AI 寵物照片生成器：
[您的 Railway 網址]

只需 3 步驟：
1️⃣ 上傳寵物照片
2️⃣ 選擇場景
3️⃣ 生成專屬照片

快來試試吧！🐕🐈🍗
```

### **步驟 3：設定 Rich Menu（可選）**

創建圖文選單：
- 按鈕 1：「🎨 生成照片」→ 連結到您的網址
- 按鈕 2：「📸 查看範例」→ 顯示範例照片
- 按鈕 3：「💬 聯絡我們」→ 客服訊息

---

## 🔒 安全性檢查

部署前請確認：

- [ ] `.env` 文件已加入 `.gitignore`
- [ ] API Key 只存在於 Railway 環境變數中
- [ ] GitHub 儲存庫中沒有暴露敏感資訊
- [ ] 前端代碼不包含 API Token
- [ ] CORS 設定正確

---

## 📞 需要幫助？

### **Railway 官方文件**
- https://docs.railway.app/

### **Replicate 文件**
- https://replicate.com/docs

### **常見問題**
- 部署失敗？查看 Railway Logs
- API 錯誤？檢查環境變數
- 照片無法生成？確認 API Token 正確

---

## 🎊 恭喜！

如果所有測試通過，您的**豪大大雞霸 AI 生成器**已經成功部署到 Railway！

**接下來**：
1. ✅ 生成 QR Code
2. ✅ 設定 LINE 官方帳號
3. ✅ 開始推廣！

**祝您的行銷活動大獲成功！** 🚀🐾🍗

---

## 📝 重要提醒

**AI 生成確認**：
- ✅ 只使用 **Replicate API**
- ✅ 模型：`black-forest-labs/flux-schnell`
- ✅ 每張照片成本：$0.003 USD
- ✅ 生成時間：30-60 秒

**沒有使用其他 AI 服務**，所有圖片生成都通過 Replicate 完成。

