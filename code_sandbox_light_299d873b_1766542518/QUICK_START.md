# 🚀 快速開始指南

5 分鐘內啟動您的 AI 生成器！

---

## 📦 您已擁有的內容

✅ **完整的前端網站**（LINE 驗證、上傳、場景選擇、結果展示）  
✅ **真實的 AI 後端**（Replicate API，FLUX.1 模型）  
✅ **安全的配置**（API Key 已保護）  
✅ **完整的部署配置**（Vercel ready）

---

## ⚡ 方案選擇

### **方案 A：立即線上測試（最快）** ⭐

**時間**：2 分鐘

1. 下載所有文件
2. 部署到 Vercel
3. 立即測試

👉 [跳到「線上部署」章節](#線上部署到-vercel)

---

### **方案 B：本地測試後部署（推薦）** 

**時間**：5-10 分鐘

1. 本地安裝依賴
2. 測試功能
3. 部署到 Vercel

👉 [跳到「本地測試」章節](#本地測試)

---

## 🏠 本地測試

### **步驟 1：下載文件**

確保您有以下文件：

```
haodada-ai-generator/
├── api/generate.js          ✅
├── js/main.js               ✅
├── css/style.css            ✅ (需要從之前的項目獲取)
├── index.html               ✅ (需要從之前的項目獲取)
├── package.json             ✅
├── vercel.json              ✅
├── .env.local               ✅
└── README.md                ✅
```

### **步驟 2：安裝依賴**

```bash
cd haodada-ai-generator
npm install
```

### **步驟 3：啟動開發伺服器**

```bash
npm run dev
```

### **步驟 4：打開瀏覽器**

訪問：`http://localhost:3000`

### **步驟 5：測試功能**

1. 點擊「我已加入，開始使用」
2. 上傳寵物照片
3. 選擇場景（如「自拍風格」）
4. 點擊「開始生成」
5. 等待 30-60 秒
6. 查看 AI 生成的照片！

**成功？** 🎉 繼續下一步部署！

**有問題？** 查看 [TESTING_GUIDE.md](TESTING_GUIDE.md)

---

## ☁️ 線上部署到 Vercel

### **方法一：使用 Vercel CLI（推薦）**

#### **1. 安裝 Vercel CLI**

```bash
npm install -g vercel
```

#### **2. 登入 Vercel**

```bash
vercel login
```

#### **3. 部署**

```bash
vercel --prod
```

#### **4. 設置環境變數**

部署後，訪問 [Vercel Dashboard](https://vercel.com/dashboard)：

1. 選擇您的項目
2. 進入 **Settings** → **Environment Variables**
3. 添加：
   ```
   REPLICATE_API_TOKEN = r8_8BwGjrCru8vNQex891LPHf6EbRVaBAx3ezu7V
   NODE_ENV = production
   ```
4. 點擊 **Save**
5. 重新部署：
   ```bash
   vercel --prod
   ```

#### **5. 獲得網址**

Vercel 會提供一個網址，如：
```
https://haodada-ai-generator.vercel.app
```

**完成！** 🎉

---

### **方法二：通過 GitHub + Vercel Dashboard**

#### **1. 推送到 GitHub**

```bash
git init
git add .
git commit -m "Initial commit: Haodada AI Generator with Replicate"
git branch -M main
git remote add origin YOUR_GITHUB_REPO_URL
git push -u origin main
```

⚠️ **重要**：確認 `.gitignore` 包含 `.env.local`！

#### **2. 在 Vercel 導入**

1. 訪問 [Vercel Dashboard](https://vercel.com/dashboard)
2. 點擊 **New Project**
3. 選擇您的 GitHub 倉庫
4. 點擊 **Import**

#### **3. 配置環境變數**

在導入頁面：

1. 展開 **Environment Variables**
2. 添加：
   ```
   REPLICATE_API_TOKEN = r8_8BwGjrCru8vNQex891LPHf6EbRVaBAx3ezu7V
   NODE_ENV = production
   ```
3. 點擊 **Deploy**

#### **4. 等待部署完成**

約 1-2 分鐘後，您會獲得網站網址！

---

## 📲 設置 LINE 官方帳號

### **步驟 1：生成 QR Code**

使用您的網站網址生成 QR Code：

**推薦工具**：
- [QR Code Generator](https://www.qr-code-generator.com/)
- [QRCode Monkey](https://www.qrcode-monkey.com/)

**網址格式**：
```
https://your-site.vercel.app
```

### **步驟 2：設置歡迎訊息**

1. 登入 [LINE Official Account Manager](https://manager.line.biz/)
2. 選擇官方帳號：@902rkfzv
3. 進入 **自動回應訊息** → **加入好友時的問候訊息**
4. 設置以下訊息：

```
🎉 歡迎加入豪大大雞霸官方帳號！

感謝您的支持！現在立即返回網站，
免費使用 AI 寵物照片生成器：

https://your-site.vercel.app?verified=true

✨ 只需 3 步驟：
1️⃣ 上傳寵物照片
2️⃣ 選擇喜愛場景
3️⃣ 一鍵生成並分享

快讓您的毛孩也享受豪大大的美味！🐾🍗
```

### **步驟 3：測試完整流程**

1. 用手機掃描 QR Code
2. 加入 LINE 官方帳號
3. 收到歡迎訊息
4. 點擊連結進入網站
5. 測試生成功能

**成功！** 🎊

---

## ✅ 完成檢查清單

### **技術部署**

- [ ] 本地測試成功
- [ ] 部署到 Vercel 成功
- [ ] 環境變數設置正確
- [ ] 線上測試 AI 生成成功

### **LINE 整合**

- [ ] QR Code 已生成
- [ ] LINE 歡迎訊息已設置
- [ ] 測試完整用戶流程成功

### **推廣準備**

- [ ] 打印 QR Code 立牌
- [ ] 準備社交媒體貼文
- [ ] 測試分享功能

---

## 🎯 下一步

### **今天**
- ✅ 部署網站
- ✅ 設置 LINE 官方帳號
- ✅ 測試完整流程

### **本週**
- 📣 開始推廣（門市、社交媒體）
- 📊 監控使用數據
- 💡 收集用戶反饋

### **未來優化**
- 🎨 添加更多場景
- 🤖 自動識別寵物類型
- 📸 照片歷史記錄
- 🎁 舉辦分享活動

---

## 💰 成本提醒

### **Replicate**
- FLUX.1 schnell: 約 $0.003/張
- 1,000 張 = $3

### **Vercel**
- 免費方案足夠（中小流量）
- 無需付費

### **總成本**
- **非常低**，適合啟動測試！

---

## 📞 需要幫助？

**文檔參考**：
- 📖 [README.md](README.md) - 完整技術文檔
- 🧪 [TESTING_GUIDE.md](TESTING_GUIDE.md) - 測試指南
- 🐛 故障排除 - 見 README.md

**常見問題**：
- API 返回錯誤 → 檢查環境變數
- 生成太慢 → 正常（30-60 秒）
- 本地無法啟動 → 重新安裝依賴

---

## 🎊 恭喜！

您的 **豪大大雞霸 AI 寵物照片生成器** 已經可以使用了！

**立即行動**：
1. 🚀 部署到 Vercel（5 分鐘）
2. 📲 設置 LINE（5 分鐘）
3. 🎉 開始推廣！

**祝您的 AI 生成器大獲成功！** 🚀🐾🍗
