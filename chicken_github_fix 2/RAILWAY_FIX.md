# 🚀 Railway 部署完整指南

## 問題：Script start.sh not found

**原因：** Railway 無法自動偵測啟動方式

**解決方案：** 已新增 `railway.toml` 和優化 `Procfile`

---

## ✅ 修正後的部署步驟

### 步驟 1：更新您的 Repository

請將這些檔案上傳到您的 GitHub Repository：

#### 📄 必要檔案清單：
- ✅ `railway.toml` （新增）
- ✅ `Procfile` （已優化）
- ✅ `requirements.txt` （已優化，新增 gunicorn）
- ✅ `runtime.txt`
- ✅ `app.py`
- ✅ `templates/index.html`

---

### 步驟 2：在 Railway 重新部署

1. **前往您的 Railway 專案**
   - 進入專案設定頁面

2. **設定環境變數**（Settings → Variables）
   ```
   REPLICATE_API_TOKEN=你的Replicate API金鑰
   PORT=8080
   ```

3. **觸發重新部署**
   - 在 GitHub 更新檔案後
   - Railway 會自動偵測並重新部署
   - 或手動點擊 "Redeploy"

---

### 步驟 3：驗證部署成功

部署日誌應該顯示：
```
✓ Build completed
✓ Starting deployment
✓ Running: gunicorn app:app
✓ Deployment successful
```

---

## 🔧 三個關鍵檔案說明

### 1️⃣ `railway.toml`
```toml
[build]
builder = "NIXPACKS"

[deploy]
startCommand = "gunicorn app:app"
```
**作用：** 告訴 Railway 使用什麼指令啟動應用

### 2️⃣ `Procfile`
```
web: gunicorn app:app --bind 0.0.0.0:$PORT --workers 2 --timeout 120
```
**作用：** 定義 web 服務啟動方式

### 3️⃣ `requirements.txt`（已新增 gunicorn）
```
Flask==3.0.0
gunicorn==21.2.0
replicate==0.20.0
...
```
**作用：** 告訴 Railway 需要安裝哪些 Python 套件

---

## 🐛 如果還是失敗？

### 檢查清單：

**1. 檢查環境變數是否設定**
```
REPLICATE_API_TOKEN=rxxxxx（必須設定）
PORT=8080（可選，預設8080）
```

**2. 檢查 runtime.txt 內容**
```
python-3.11
```

**3. 檢查部署日誌（Logs）**
- 在 Railway 點擊 "View Logs"
- 找到錯誤訊息

**4. 常見錯誤解決**

| 錯誤訊息 | 解決方法 |
|---------|---------|
| `start.sh not found` | 確認已上傳 `railway.toml` |
| `gunicorn not found` | 確認 `requirements.txt` 包含 gunicorn |
| `Module not found` | 檢查 `requirements.txt` 是否完整 |
| `Port already in use` | Railway 自動處理，無需擔心 |

---

## 📦 完整檔案結構

```
your-repo/
├── railway.toml          ← 新增！
├── Procfile              ← 已優化
├── requirements.txt      ← 已優化（含gunicorn）
├── runtime.txt
├── app.py
├── README.md
├── .gitignore
├── templates/
│   └── index.html
├── static/
├── uploads/
│   └── .gitkeep
└── results/
    └── .gitkeep
```

---

## 🆘 還是不行？

提供這些資訊給我：
1. Railway 部署日誌截圖
2. 您的 GitHub Repository 檔案清單截圖
3. 環境變數設定截圖（遮蔽敏感資訊）

---

## ✅ 部署成功後

您應該能：
1. 🌐 訪問 Railway 提供的網址
2. 📱 點擊「加 LINE 好友」按鈕
3. 📸 上傳寵物照片
4. 🎨 選擇風格並生成AI照片

預期生成時間：10-20秒

---

**祝您部署順利！** 🚀
