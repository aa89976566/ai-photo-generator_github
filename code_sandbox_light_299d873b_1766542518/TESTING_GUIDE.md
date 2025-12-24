# 🧪 本地測試指南

快速測試您的 AI 生成器是否正常運作！

---

## 📋 準備工作

### **1. 確認文件結構**

```
haodada-ai-generator/
├── api/generate.js          ✅ 後端 API
├── js/main.js               ✅ 前端邏輯
├── index.html               ✅ 主頁面
├── css/style.css            ✅ 樣式
├── package.json             ✅ 依賴配置
├── .env.local               ✅ 環境變數（含 API Key）
└── README.md                ✅ 說明文件
```

### **2. 檢查環境變數**

打開 `.env.local` 確認內容：

```env
REPLICATE_API_TOKEN=r8_8BwGjrCru8vNQex891LPHf6EbRVaBAx3ezu7V
NODE_ENV=development
```

✅ API Key 已正確設置！

---

## 🚀 啟動本地測試

### **步驟 1：安裝依賴**

```bash
npm install
```

這會安裝：
- `replicate`: Replicate API SDK
- `vercel`: Vercel 開發工具

### **步驟 2：啟動開發伺服器**

```bash
npm run dev
```

或

```bash
vercel dev
```

### **步驟 3：等待啟動**

您應該看到類似的輸出：

```
Vercel CLI 33.0.0
> Ready! Available at http://localhost:3000
```

### **步驟 4：打開瀏覽器**

訪問：`http://localhost:3000`

---

## ✅ 測試清單

### **測試 1：LINE 驗證頁面**

- [ ] 看到精美的歡迎頁面
- [ ] 看到 4 張範例照片
- [ ] 「加入 LINE 好友」按鈕正常顯示
- [ ] 點擊「我已加入，開始使用」可進入生成器

### **測試 2：照片上傳**

- [ ] 點擊上傳區域可選擇文件
- [ ] 拖放照片到上傳區域有效
- [ ] 上傳後顯示照片預覽
- [ ] 「重新上傳」按鈕可重置

### **測試 3：場景選擇**

- [ ] 看到 6 種場景選項
- [ ] 點擊場景卡片會顯示選中效果（藍色邊框）
- [ ] 只能選擇一個場景
- [ ] 選擇場景後「開始生成」按鈕啟用

### **測試 4：AI 生成（核心功能）**

**準備工作**：
1. 上傳一張測試照片（任何寵物照片）
2. 選擇場景（如「自拍風格」）
3. 點擊「開始生成」

**預期結果**：
- [ ] 顯示載入動畫（旋轉圖標）
- [ ] 顯示進度條（0% → 100%）
- [ ] 顯示提示文字輪播
- [ ] 等待 30-60 秒
- [ ] **顯示生成的 AI 照片**
- [ ] 照片符合選擇的場景風格
- [ ] 照片包含擬人化效果

### **測試 5：結果操作**

- [ ] 「下載照片」按鈕可下載圖片
- [ ] 「分享」按鈕正常顯示
- [ ] 「重新生成」按鈕可返回開始

---

## 🐛 常見問題

### **問題 1：`npm install` 失敗**

**錯誤訊息**：`ENOENT: no such file or directory`

**解決方案**：
```bash
# 確認在正確的目錄
pwd

# 確認 package.json 存在
ls -la package.json

# 刪除舊的 node_modules
rm -rf node_modules package-lock.json

# 重新安裝
npm install
```

---

### **問題 2：`vercel dev` 提示未安裝**

**解決方案**：
```bash
npm install -g vercel
```

---

### **問題 3：API 返回 500 錯誤**

**檢查步驟**：

1. **確認 .env.local 存在**
   ```bash
   cat .env.local
   ```

2. **重啟開發伺服器**
   ```bash
   # Ctrl+C 停止
   npm run dev  # 重新啟動
   ```

3. **查看 Console 錯誤**
   - 打開瀏覽器開發者工具（F12）
   - 查看 Console 標籤
   - 查看 Network 標籤

4. **測試 API 端點**
   ```bash
   curl -X POST http://localhost:3000/api/generate \
     -H "Content-Type: application/json" \
     -d '{"scene":"selfie","animalType":"dog"}'
   ```

---

### **問題 4：生成後沒有顯示照片**

**檢查步驟**：

1. **打開瀏覽器 Console**（F12）
2. 查看是否有錯誤訊息
3. 檢查 Network 標籤中 `/api/generate` 的響應
4. 確認響應中有 `imageUrl` 字段

**可能原因**：
- API Key 無效或過期
- Replicate 服務暫時不可用
- 網絡連接問題

---

### **問題 5：生成速度太慢**

**正常現象**：
- AI 生成需要 **30-60 秒**
- 這是 Replicate 服務的正常速度

**如果超過 2 分鐘**：
- 檢查網絡連接
- 查看 Console 是否有錯誤
- 重試生成

---

## 🔍 API 測試工具

### **使用 cURL 測試後端 API**

**基礎測試**：
```bash
curl http://localhost:3000/api/generate
```

**完整 POST 請求**：
```bash
curl -X POST http://localhost:3000/api/generate \
  -H "Content-Type: application/json" \
  -d '{
    "scene": "selfie",
    "animalType": "cute puppy"
  }'
```

**預期響應**：
```json
{
  "success": true,
  "imageUrl": "https://replicate.delivery/pbxt/...",
  "scene": "selfie",
  "timestamp": "2024-12-24T..."
}
```

---

### **使用 Postman 測試**

1. **打開 Postman**
2. **新建 POST 請求**
   - URL: `http://localhost:3000/api/generate`
   - Method: `POST`
   - Headers: `Content-Type: application/json`
   - Body (raw JSON):
     ```json
     {
       "scene": "selfie",
       "animalType": "dog"
     }
     ```
3. **發送請求**
4. **查看響應**

---

## 📊 檢查生成結果品質

### **好的生成結果應該包含**：

✅ 寵物特徵清晰可辨識  
✅ 擬人化姿態自然（坐立、拿東西）  
✅ 炸雞清晰可見  
✅ 場景符合選擇（夜市/沙發/公園等）  
✅ 光線和色彩自然  
✅ 構圖美觀

### **如果結果不理想**：

1. **嘗試不同場景**
   - 有些場景可能更適合特定動物

2. **調整提示詞**
   - 編輯 `api/generate.js` 中的 `SCENE_PROMPTS`
   - 添加更多描述細節

3. **使用更清晰的照片**
   - 光線充足
   - 寵物特徵明顯
   - 背景簡單

---

## 🎯 測試成功標準

完成以下所有測試即表示系統正常運作：

- [x] 本地伺服器成功啟動
- [x] LINE 驗證頁面顯示正常
- [x] 照片上傳功能正常
- [x] 場景選擇功能正常
- [x] **API 成功調用 Replicate**
- [x] **AI 成功生成照片**
- [x] 生成結果符合場景描述
- [x] 下載和分享功能正常

---

## 🚀 測試完成後的下一步

### **1. 部署到 Vercel**

```bash
vercel --prod
```

### **2. 設置生產環境變數**

在 Vercel Dashboard 中設置：
- `REPLICATE_API_TOKEN`
- `NODE_ENV=production`

### **3. 測試生產環境**

訪問 Vercel 提供的網址，重複上述測試

### **4. 設置 LINE 官方帳號**

添加網站連結和歡迎訊息

### **5. 開始推廣！** 🎉

---

## 📞 需要幫助？

**如果本地測試一切正常**：
✅ 恭喜！可以部署了

**如果遇到問題**：
1. 查看 README.md 的「故障排除」章節
2. 檢查瀏覽器 Console 錯誤
3. 檢查 `.env.local` 是否正確
4. 確認 API Key 有效

---

**祝測試順利！** 🎊
