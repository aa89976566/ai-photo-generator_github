# 📦 上傳到 GitHub 完整指南

## 🎯 目標：將所有源代碼上傳到 GitHub

---

## 📋 步驟 1：在 GitHub 創建新倉庫

### 1.1 前往 GitHub

1. 登入 https://github.com
2. 點擊右上角 **+** → **New repository**

### 1.2 設定倉庫

- **Repository name**: `haodada-ai-generator`（或您喜歡的名稱）
- **Description**: `豪大大雞霸 AI 寵物照片生成器`
- **Visibility**: 
  - **Public**（公開，任何人都能看到）
  - **Private**（私有，只有您能看到）
- **不要**勾選以下選項：
  - ❌ Add a README file
  - ❌ Add .gitignore
  - ❌ Choose a license

### 1.3 創建倉庫

點擊 **Create repository**

---

## 📋 步驟 2：在終端機執行以下命令

### 2.1 切換到專案目錄

```bash
cd /Users/ming/Downloads/code_sandbox_light_299d873b_1766542518
```

### 2.2 初始化 Git（如果還沒有）

```bash
git init
```

### 2.3 添加所有文件

```bash
git add .
```

這會添加所有文件，但會自動排除 `.gitignore` 中列出的文件（如 `.env`、`node_modules` 等）

### 2.4 創建首次提交

```bash
git commit -m "Initial commit: 豪大大雞霸 AI 寵物照片生成器"
```

### 2.5 連接到 GitHub 倉庫

**替換 `YOUR_USERNAME` 和 `YOUR_REPO_NAME`**：

```bash
git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO_NAME.git
```

例如：
```bash
git remote add origin https://github.com/ming/haodada-ai-generator.git
```

### 2.6 設定主分支

```bash
git branch -M main
```

### 2.7 推送到 GitHub

```bash
git push -u origin main
```

如果這是第一次，GitHub 可能會要求您輸入：
- **Username**: 您的 GitHub 用戶名
- **Password**: 使用 Personal Access Token（不是密碼）

---

## 🔑 如果遇到認證問題

### 方法 1：使用 Personal Access Token

1. 前往 https://github.com/settings/tokens
2. 點擊 **Generate new token** → **Generate new token (classic)**
3. 設定：
   - **Note**: `Railway Deployment`
   - **Expiration**: 選擇期限（或 No expiration）
   - **Scopes**: 勾選 `repo`（完整倉庫權限）
4. 點擊 **Generate token**
5. **複製 token**（只會顯示一次！）
6. 在推送時，使用這個 token 作為密碼

### 方法 2：使用 SSH（推薦）

```bash
# 1. 生成 SSH key（如果還沒有）
ssh-keygen -t ed25519 -C "your_email@example.com"

# 2. 複製公鑰
cat ~/.ssh/id_ed25519.pub

# 3. 在 GitHub 添加 SSH key
# Settings → SSH and GPG keys → New SSH key

# 4. 使用 SSH URL 連接
git remote set-url origin git@github.com:YOUR_USERNAME/YOUR_REPO_NAME.git
```

---

## ✅ 上傳的文件清單

以下文件會被上傳：

### 核心文件
- ✅ `server.js` - Express 伺服器
- ✅ `package.json` - 依賴配置
- ✅ `package-lock.json` - 鎖定版本

### 前端文件
- ✅ `public/index.html` - 主頁面
- ✅ `public/css/style.css` - 樣式文件
- ✅ `public/js/main.js` - 前端邏輯

### 文檔文件
- ✅ `README.md` - 完整文檔
- ✅ `RAILWAY_DEPLOYMENT.md` - Railway 部署指南
- ✅ `DEPLOY_STEPS.md` - 快速部署步驟
- ✅ `QUICK_START.md` - 快速開始
- ✅ `TESTING_GUIDE.md` - 測試指南
- ✅ `PROJECT_SUMMARY.md` - 項目摘要
- ✅ `INDEX.md` - 文件索引

### 配置文件
- ✅ `.gitignore` - Git 忽略規則
- ✅ `vercel.json` - Vercel 配置（可選）

### 舊文件（可選保留）
- ✅ `api/generate.js` - 舊的 Vercel 函數

---

## ❌ 不會上傳的文件（已保護）

以下文件**不會**被上傳（在 `.gitignore` 中）：

- ❌ `.env` - 環境變數（包含 API Token）
- ❌ `node_modules/` - 依賴套件
- ❌ `.DS_Store` - 系統文件
- ❌ `*.log` - 日誌文件

---

## 🚀 完整命令（複製貼上）

**替換 `YOUR_USERNAME` 和 `YOUR_REPO_NAME`**：

```bash
cd /Users/ming/Downloads/code_sandbox_light_299d873b_1766542518

# 初始化 Git
git init

# 添加所有文件
git add .

# 提交
git commit -m "Initial commit: 豪大大雞霸 AI 寵物照片生成器"

# 連接 GitHub（替換 YOUR_USERNAME 和 YOUR_REPO_NAME）
git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO_NAME.git

# 設定主分支
git branch -M main

# 推送到 GitHub
git push -u origin main
```

---

## 🔍 驗證上傳成功

1. 前往您的 GitHub 倉庫頁面
2. 確認所有文件都已顯示
3. 確認 `.env` 文件**沒有**出現在列表中
4. 確認 `node_modules/` **沒有**出現在列表中

---

## 📝 後續操作

上傳成功後，您可以：

1. **部署到 Railway**：
   - 在 Railway 選擇 "Deploy from GitHub repo"
   - 選擇您的倉庫
   - 設定環境變數

2. **分享給團隊**：
   - 邀請協作者
   - 設定分支保護規則

3. **持續更新**：
   ```bash
   git add .
   git commit -m "更新描述"
   git push
   ```

---

## ⚠️ 重要提醒

1. **不要上傳 `.env` 文件** - 已自動保護
2. **不要上傳 `node_modules/`** - 已自動保護
3. **API Token 安全** - 只在 Railway 環境變數中設定
4. **公開倉庫** - 如果選擇 Public，任何人都能看到代碼

---

## 🎉 完成！

如果所有步驟都成功，您的代碼已經在 GitHub 上了！

**下一步**：部署到 Railway（參考 `DEPLOY_STEPS.md`）

---

## 📞 遇到問題？

### 問題 1：`fatal: remote origin already exists`

**解決方案**：
```bash
git remote remove origin
git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO_NAME.git
```

### 問題 2：`error: failed to push some refs`

**解決方案**：
```bash
git pull origin main --allow-unrelated-histories
git push -u origin main
```

### 問題 3：認證失敗

**解決方案**：
- 使用 Personal Access Token
- 或設定 SSH key

---

**祝您上傳順利！** 🚀

