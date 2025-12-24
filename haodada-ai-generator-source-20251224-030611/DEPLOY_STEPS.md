# 🚀 快速部署指南 - 讓用戶使用您的生成器

## 📋 部署前檢查清單

- [x] ✅ 依賴已安裝 (`npm install`)
- [x] ✅ 代碼已準備好
- [ ] ⬜ 推送到 GitHub
- [ ] ⬜ 部署到 Railway
- [ ] ⬜ 設定環境變數
- [ ] ⬜ 測試功能

---

## 🎯 完整部署步驟

### **步驟 1：推送到 GitHub**

#### 1.1 初始化 Git（如果還沒有）

```bash
cd /Users/ming/Downloads/code_sandbox_light_299d873b_1766542518

# 初始化 Git
git init

# 添加所有文件
git add .

# 提交
git commit -m "Initial commit - Haodada AI Pet Generator"
```

#### 1.2 在 GitHub 創建新倉庫

1. 前往 https://github.com/new
2. 輸入倉庫名稱（例如：`haodada-ai-generator`）
3. 選擇 **Public** 或 **Private**
4. **不要**勾選 "Initialize with README"
5. 點擊 **Create repository**

#### 1.3 連接並推送

```bash
# 替換 YOUR_USERNAME 和 YOUR_REPO_NAME
git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO_NAME.git

# 推送到 GitHub
git branch -M main
git push -u origin main
```

⚠️ **重要**：確保 `.env` 文件已在 `.gitignore` 中（已經有了）！

---

### **步驟 2：部署到 Railway**

#### 2.1 登入 Railway

1. 前往 https://railway.app
2. 點擊 **Login** 或 **Sign Up**
3. 使用 GitHub 帳號登入（推薦）

#### 2.2 創建新專案

1. 點擊 **New Project**
2. 選擇 **Deploy from GitHub repo**
3. 選擇您剛才推送的倉庫
4. Railway 會自動偵測並開始部署

#### 2.3 等待首次部署完成

Railway 會自動：
- 偵測 Node.js 專案
- 安裝依賴
- 啟動伺服器

---

### **步驟 3：設定環境變數**

#### 3.1 在 Railway Dashboard

1. 進入您的專案
2. 點擊 **Variables** 標籤
3. 點擊 **+ New Variable**

#### 3.2 添加以下環境變數

**變數 1：**
- **Key**: `REPLICATE_API_TOKEN`
- **Value**: `r8_8BwGjrCru8vNQex891LPHf6EbRVaBAx3ezu7V`
- 點擊 **Add**

**變數 2：**
- **Key**: `NODE_ENV`
- **Value**: `production`
- 點擊 **Add**

**變數 3：**
- **Key**: `PORT`
- **Value**: `3000`
- 點擊 **Add**

#### 3.3 保存並重新部署

Railway 會自動重新部署（通常需要 1-2 分鐘）

---

### **步驟 4：獲取公開網址**

1. 在 Railway Dashboard，點擊您的服務
2. 點擊 **Settings** 標籤
3. 找到 **Domains** 區塊
4. 點擊 **Generate Domain** 或使用預設的網址

您會得到類似這樣的網址：
```
https://your-app-name.up.railway.app
```

---

### **步驟 5：測試功能**

#### 5.1 健康檢查

訪問：
```
https://your-app-name.up.railway.app/health
```

應該返回：
```json
{
  "status": "ok",
  "timestamp": "...",
  "replicateConfigured": true
}
```

#### 5.2 完整功能測試

1. 訪問您的網址：`https://your-app-name.up.railway.app`
2. 測試完整流程：
   - [ ] LINE 加好友頁面顯示正常
   - [ ] 點擊「我已加入，開始使用」
   - [ ] 上傳寵物照片
   - [ ] 選擇場景
   - [ ] 點擊「開始生成」
   - [ ] **等待 30-60 秒**
   - [ ] **確認照片生成成功** ✨
   - [ ] 下載功能正常
   - [ ] 分享功能正常

---

## 🎉 完成！

如果所有測試通過，您的生成器已經可以讓用戶使用了！

---

## 📱 分享給用戶

### **方法 1：直接分享網址**

將您的 Railway 網址分享給用戶：
```
https://your-app-name.up.railway.app
```

### **方法 2：生成 QR Code**

1. 使用 QR Code 生成器：
   - https://www.qr-code-generator.com/
   - https://www.qrcode-monkey.com/

2. 輸入您的網址
3. 下載 QR Code
4. 打印或分享給用戶

### **方法 3：LINE 官方帳號整合**

1. 登入 LINE Official Account Manager
2. 設定歡迎訊息，包含您的網址
3. 用戶加入 LINE 後自動收到連結

---

## 🔧 常見問題

### **問題 1：部署失敗**

**檢查**：
- Railway Logs 中的錯誤訊息
- 確認 `package.json` 有 `start` 腳本
- 確認環境變數已設定

### **問題 2：照片無法生成**

**檢查**：
- `REPLICATE_API_TOKEN` 是否正確
- Railway Logs 中的錯誤訊息
- Replicate 帳戶是否有餘額

### **問題 3：網站無法訪問**

**檢查**：
- Railway 服務是否運行中
- Domain 是否已生成
- 查看 Railway Logs

---

## 💰 成本提醒

- **Railway**：免費方案每月 $5 額度
- **Replicate**：每張照片 $0.003 USD
- **預估**：100 張/月 ≈ $5-10/月

---

## 📞 需要幫助？

查看詳細文檔：
- `RAILWAY_DEPLOYMENT.md` - 完整部署指南
- `README.md` - 技術文檔

---

**祝您部署順利！** 🚀🐾🍗

