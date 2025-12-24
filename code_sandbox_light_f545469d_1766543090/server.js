// Railway 部署 Express 伺服器
const express = require('express');
const cors = require('cors');
const path = require('path');
const Replicate = require('replicate');

const app = express();
const PORT = process.env.PORT || 3000;

// 初始化 Replicate
const replicate = new Replicate({
  auth: process.env.REPLICATE_API_TOKEN,
});

// 中介軟體
app.use(cors());
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

// 提供靜態文件
app.use(express.static('public'));

// 健康檢查端點
app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// AI 生成 API 端點
app.post('/api/generate', async (req, res) => {
  try {
    const { scene } = req.body;

    if (!scene) {
      return res.status(400).json({
        success: false,
        error: '請提供場景參數'
      });
    }

    console.log(`[${new Date().toISOString()}] 開始生成 - 場景: ${scene}`);

    // 根據場景生成對應的 AI 提示詞
    const prompts = {
      selfie: 'A cute pet (dog or cat) taking a selfie while holding a piece of golden crispy fried chicken, anthropomorphic style with the pet sitting upright like a human, looking at camera with happy expression, cozy indoor background with warm lighting, the fried chicken is clearly visible with appetizing crispy texture, photorealistic style, Instagram-worthy composition, shallow depth of field',
      
      sofa: 'A cute pet (dog or cat) relaxing on a comfortable sofa, enjoying a piece of golden crispy fried chicken, anthropomorphic style with the pet sitting comfortably like a human, cozy living room with soft lighting and home decor, the pet looks content and happy, the fried chicken is prominently displayed with delicious crispy texture, photorealistic style, warm homey atmosphere, cinematic composition',
      
      night_market: 'A cute pet (dog or cat) walking through a bustling Taiwan night market, holding and eating a piece of golden crispy fried chicken, anthropomorphic style with the pet walking upright on two legs like a human, colorful food stalls and neon signs with Chinese characters in background, crowded night market atmosphere, the pet looks happy and enjoying the food, the fried chicken is clearly visible with crispy texture, warm evening lighting, photorealistic style, dynamic street food scene',
      
      party: 'A joyful pet party scene with dogs and cats celebrating together, all holding pieces of golden crispy fried chicken, anthropomorphic style with pets in upright poses like humans, colorful party decorations and balloons, festive atmosphere with warm lighting, the pets look happy and cheerful sharing food together, the fried chicken pieces are prominently displayed with appetizing texture, photorealistic style, group celebration photo composition',
      
      cafe: 'A cute pet (dog or cat) sitting at a cafe table, elegantly enjoying a piece of golden crispy fried chicken with a coffee cup nearby, anthropomorphic style with the pet sitting upright like a human at the table, modern cafe interior with plants and soft lighting, the pet looks sophisticated and content, the fried chicken is beautifully presented on a plate with crispy golden texture, photorealistic style, Instagram cafe aesthetic, bokeh background',
      
      park: 'A cute pet (dog or cat) having a picnic in a beautiful outdoor park, enjoying a piece of golden crispy fried chicken, anthropomorphic style with the pet sitting on grass like a human, sunny day with green trees and blue sky, the pet looks playful and happy, the fried chicken is clearly visible with delicious crispy texture on a picnic blanket, photorealistic style, bright natural lighting, outdoor lifestyle photography'
    };

    const prompt = prompts[scene] || prompts.selfie;

    // 調用 Replicate API 使用 FLUX.1 schnell 模型
    console.log(`[${new Date().toISOString()}] 調用 Replicate API...`);
    
    const output = await replicate.run(
      "black-forest-labs/flux-schnell",
      {
        input: {
          prompt: prompt,
          num_outputs: 1,
          aspect_ratio: "4:3",
          output_format: "jpg",
          output_quality: 90
        }
      }
    );

    console.log(`[${new Date().toISOString()}] 生成成功`);

    // output 是一個包含圖片 URL 的陣列
    const imageUrl = Array.isArray(output) ? output[0] : output;

    res.json({
      success: true,
      imageUrl: imageUrl,
      scene: scene
    });

  } catch (error) {
    console.error(`[${new Date().toISOString()}] 生成錯誤:`, error);
    
    res.status(500).json({
      success: false,
      error: error.message || '生成失敗，請稍後再試'
    });
  }
});

// 404 處理
app.use((req, res) => {
  res.status(404).sendFile(path.join(__dirname, 'public', 'index.html'));
});

// 啟動伺服器
app.listen(PORT, '0.0.0.0', () => {
  console.log(`
╔════════════════════════════════════════════════════════════════╗
║  🚂 Railway 部署成功！                                          ║
║  🌐 伺服器運行於 Port: ${PORT}                                  ║
║  🤖 Replicate API: ${process.env.REPLICATE_API_TOKEN ? '已配置 ✅' : '未配置 ❌'}  ║
║  📅 啟動時間: ${new Date().toLocaleString('zh-TW')}                     ║
╚════════════════════════════════════════════════════════════════╝
  `);
});

// 優雅關閉
process.on('SIGTERM', () => {
  console.log('收到 SIGTERM 信號，正在關閉伺服器...');
  process.exit(0);
});
