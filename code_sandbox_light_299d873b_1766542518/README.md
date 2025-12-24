# 豪大大雞霸 AI 寵物照片生成器 - 完整部署指南

## 🎉 Replicate API 已整合！

您的 AI 生成器現在已經連接到真實的 Replicate AI 服務，可以生成真正的擬人化寵物照片！

---

## 📦 項目文件結構

```
haodada-ai-generator/
├── api/
│   └── generate.js          # 後端 Serverless Function（Replicate API）
├── js/
│   └── main.js              # 前端主邏輯（已更新連接後端）
├── css/
│   └── style.css            # 樣式文件
├── index.html               # 主頁面
├── package.json             # Node.js 依賴配置
├── vercel.json              # Vercel 部署配置
├── .env.local               # 環境變數（包含您的 API Key）
├── .env.example             # 環境變數範本
├── .gitignore               # Git 忽略文件
└── README.md                # 本文件
```

---

## 🚀 快速部署到 Vercel

### **方法一：使用 Vercel CLI（推薦）**

#### **步驟 1：安裝 Vercel CLI**

```bash
npm install -g vercel
```

#### **步驟 2：安裝項目依賴**

```bash
npm install
```

#### **步驟 3：登入 Vercel**

```bash
vercel login
```

#### **步驟 4：部署**

```bash
vercel --prod
```

#### **步驟 5：設置環境變數**

部署後，在 Vercel Dashboard 中：

1. 進入您的項目
2. 點擊 **Settings** → **Environment Variables**
3. 添加以下變數：

```
REPLICATE_API_TOKEN = r8_8BwGjrCru8vNQex891LPHf6EbRVaBAx3ezu7V
NODE_ENV = production
```

4. 點擊 **Save**
5. 重新部署：`vercel --prod`

---

### **方法二：通過 Vercel Dashboard**

#### **步驟 1：推送到 GitHub**

```bash
git init
git add .
git commit -m "Initial commit"
git remote add origin YOUR_GITHUB_REPO_URL
git push -u origin main
```

⚠️ **重要**：確保 `.env.local` 已在 `.gitignore` 中被忽略！

#### **步驟 2：在 Vercel 導入項目**

1. 前往 [Vercel Dashboard](https://vercel.com/dashboard)
2. 點擊 **New Project**
3. 選擇您的 GitHub 倉庫
4. 點擊 **Import**

#### **步驟 3：設置環境變數**

在部署配置頁面：

1. 展開 **Environment Variables**
2. 添加：
   ```
   REPLICATE_API_TOKEN = r8_8BwGjrCru8vNQex891LPHf6EbRVaBAx3ezu7V
   NODE_ENV = production
   ```
3. 點擊 **Deploy**

---

## 🧪 本地測試

### **步驟 1：安裝依賴**

```bash
npm install
```

### **步驟 2：確認環境變數**

確保 `.env.local` 文件存在且包含：

```env
REPLICATE_API_TOKEN=r8_8BwGjrCru8vNQex891LPHf6EbRVaBAx3ezu7V
NODE_ENV=development
```

### **步驟 3：啟動本地開發伺服器**

```bash
npm run dev
```

這會啟動 Vercel Dev Server 在 `http://localhost:3000`

### **步驟 4：測試功能**

1. 打開瀏覽器訪問 `http://localhost:3000`
2. 點擊「我已加入，開始使用」（或實際加入 LINE）
3. 上傳寵物照片
4. 選擇場景
5. 點擊「開始生成」
6. 等待 30-60 秒
7. 查看生成的照片！

---

## 🔧 技術細節

### **後端 API（api/generate.js）**

- **框架**：Vercel Serverless Functions
- **AI 服務**：Replicate（FLUX.1 schnell 模型）
- **功能**：
  - 接收場景類型（selfie, sofa, night_market, party, cafe, park）
  - 生成場景特定的 AI 提示詞
  - 調用 Replicate API 生成圖片
  - 返回圖片 URL
- **安全性**：API Key 存儲在環境變數中，不暴露在前端

### **前端（js/main.js）**

- **功能更新**：
  - 照片上傳和預覽
  - 場景選擇
  - **調用後端 API** 進行 AI 生成（新增）
  - 結果展示和分享
- **API 調用**：`POST /api/generate`

### **使用的 AI 模型**

- **模型名稱**：`black-forest-labs/flux-schnell`
- **特點**：
  - 快速生成（30-60 秒）
  - 高品質圖像
  - 支援擬人化提示
  - 4:3 比例輸出
  - JPG 格式，90% 品質

---

## 💰 成本估算

### **Replicate 定價**

FLUX.1 schnell 模型：
- **價格**：約 $0.003/張（非常便宜！）
- **生成速度**：30-60 秒

### **預估成本**

| 月生成量 | 預估成本 |
|---------|---------|
| 100 張 | $0.30 |
| 1,000 張 | $3.00 |
| 10,000 張 | $30.00 |

### **Vercel 主機**

- **免費方案**：
  - 100 GB 帶寬/月
  - 100 次 Serverless Function 調用/天
  - 對於中小流量完全免費

---

## 🎨 場景說明

生成器支援 6 種場景，每種場景都有專門優化的 AI 提示詞：

1. **📸 自拍風格（selfie）**
   - 寵物拿著手機自拍，手持炸雞
   - 溫馨家庭背景，暖色調燈光

2. **🛋️ 沙發時光（sofa）**
   - 寵物在沙發上悠閒姿態
   - 客廳場景，書架和環境燈光

3. **🌃 夜市美食（night_market）**
   - 寵物在台灣夜市中行走
   - 霓虹燈、中文招牌、食物攤位

4. **🎉 派對同樂（party）**
   - 寵物參加派對慶祝
   - 彩色裝飾、氣球、歡樂氛圍

5. **☕ 咖啡廳（cafe）**
   - 寵物在咖啡廳優雅品嚐
   - 木質家具、植物、自然光

6. **🌳 戶外公園（park）**
   - 寵物在公園野餐
   - 綠草、樹木、陽光明媚

---

## 🔒 安全性說明

### **API Key 保護**

✅ **正確做法（已實現）**：
- API Key 存儲在 `.env.local`（本地）
- API Key 設置在 Vercel Environment Variables（生產環境）
- `.env.local` 在 `.gitignore` 中被忽略
- 前端只調用後端 API，不直接使用 API Key

❌ **錯誤做法（避免）**：
- 在前端代碼中直接寫入 API Key
- 將 `.env.local` 提交到 Git
- 在公開的 GitHub 倉庫中暴露 API Key

### **如果 API Key 洩露**

1. 立即前往 [Replicate Account Settings](https://replicate.com/account/api-tokens)
2. 刪除舊的 API Token
3. 生成新的 API Token
4. 更新 `.env.local` 和 Vercel Environment Variables

---

## 🐛 故障排除

### **問題 1：本地測試時提示「REPLICATE_API_TOKEN not found」**

**解決方案**：
1. 確認 `.env.local` 文件存在
2. 確認文件內容正確
3. 重啟開發伺服器：`npm run dev`

### **問題 2：部署後 API 返回 500 錯誤**

**解決方案**：
1. 檢查 Vercel Dashboard 中的 Environment Variables
2. 確認 `REPLICATE_API_TOKEN` 已設置
3. 重新部署項目

### **問題 3：生成速度很慢**

**原因**：AI 生成本身需要 30-60 秒

**改善方案**：
- 已實現載入動畫和進度條
- 添加提示文字讓用戶等待

### **問題 4：生成的圖片不符合預期**

**解決方案**：
1. 調整 `api/generate.js` 中的提示詞（`SCENE_PROMPTS`）
2. 嘗試不同的場景
3. 確保上傳的寵物照片清晰

---

## 📞 LINE 官方帳號設置

### **歡迎訊息範本**

當用戶加入 @902rkfzv 後，設置自動回覆：

```
🎉 歡迎加入豪大大雞霸官方帳號！

感謝您的支持！現在立即返回網站，
免費使用 AI 寵物照片生成器：

【您的網站網址】?verified=true

✨ 只需 3 步驟：
1️⃣ 上傳寵物照片
2️⃣ 選擇喜愛場景  
3️⃣ 一鍵生成並分享

快讓您的毛孩也享受豪大大的美味！🐾🍗
```

### **Rich Menu 設置**

可選：創建 LINE Rich Menu 引導用戶：

1. 登入 [LINE Official Account Manager](https://manager.line.biz/)
2. 選擇您的官方帳號
3. 進入 **Rich Menu** 設置
4. 添加按鈕連結到您的網站（帶 `?verified=true` 參數）

---

## 🎯 下一步優化建議

### **短期優化（1-2 週）**

1. **自動識別動物類型**
   - 使用圖像識別 API 自動判斷是狗還是貓
   - 更精準的 AI 提示詞

2. **照片歷史記錄**
   - 讓用戶查看之前生成的照片
   - 需要簡單的數據庫（如 Vercel KV）

3. **社交分享優化**
   - 生成帶水印的分享版本
   - 添加 QR Code 引導更多用戶

### **長期優化（1-3 月）**

1. **用戶系統**
   - LINE Login 整合
   - 自動驗證 LINE 好友身份

2. **高級功能**
   - 多寵物合照
   - 自訂場景
   - 照片編輯功能

3. **數據分析**
   - 追蹤生成數量
   - 最受歡迎的場景
   - 用戶留存率

---

## 📈 監控和維護

### **Vercel Analytics**

1. 前往 Vercel Dashboard
2. 選擇您的項目
3. 啟用 **Analytics**
4. 查看訪問量、API 調用次數等

### **Replicate 使用監控**

1. 前往 [Replicate Dashboard](https://replicate.com/account)
2. 查看 **Usage** 標籤
3. 監控每日/每月生成量
4. 設置成本警報

---

## 🎊 恭喜！

您的 **豪大大雞霸 AI 寵物照片生成器** 現在已經完全可運作了！

### **已完成的內容**：

✅ 完整的前端介面（LINE 驗證、上傳、選場景、結果展示）  
✅ 真實的 AI 生成後端（Replicate API）  
✅ 安全的 API Key 管理  
✅ Vercel 部署配置  
✅ 完整的文檔和故障排除指南

### **立即行動**：

1. 🚀 **部署到 Vercel**（5-10 分鐘）
2. 📲 **設置 LINE 官方帳號**（5 分鐘）
3. 🎨 **生成 QR Code**（1 分鐘）
4. 🎉 **開始推廣**！

---

## 📞 技術支援

如果遇到任何問題：

1. 查看本 README 的「故障排除」章節
2. 檢查 Vercel Deployment Logs
3. 檢查瀏覽器 Console 錯誤訊息
4. 檢查 API 返回的錯誤訊息

---

**祝您的 AI 生成器大獲成功！** 🚀🐾🍗

---

## 📝 版本資訊

- **版本**：1.0.0
- **更新日期**：2024-12-24
- **AI 模型**：FLUX.1 schnell by Black Forest Labs
- **AI 平台**：Replicate
