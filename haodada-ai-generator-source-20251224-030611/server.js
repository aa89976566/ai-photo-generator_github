/**
 * Railway 部署 Express 伺服器
 * 豪大大雞霸 AI 寵物照片生成器 - 後端伺服器
 * 
 * 整合 Replicate API 進行 AI 圖片生成
 */

// 載入環境變數（本地開發用）
if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config();
}

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

// 場景對應的 AI 提示詞模板
const SCENE_PROMPTS = {
  selfie: "A cute {animal} taking a selfie with a smartphone, holding a piece of golden crispy fried chicken in the other paw, looking happy and excited at the camera, anthropomorphic pose sitting upright like a human, cozy home background with warm lighting, the fried chicken is clearly visible with appetizing crispy texture, photorealistic style, Instagram-worthy composition, shallow depth of field, professional pet photography",
  
  sofa: "A {animal} relaxing comfortably on a cozy sofa or pet bed, enjoying a piece of golden crispy fried chicken, sitting in an anthropomorphic casual pose like a human watching TV, warm living room background with bookshelves and ambient lighting, the pet looks content and happy, the fried chicken has crispy golden texture and looks delicious, photorealistic style, cinematic composition, lifestyle photography",
  
  night_market: "A {animal} walking upright on two legs like a human through a bustling Taiwan night market, holding and eating a piece of golden crispy fried chicken, colorful food stalls and neon signs with Chinese characters in background, crowded lively atmosphere, the pet looks happy and enjoying the street food, warm evening lighting, photorealistic style, dynamic street food photography, vibrant colors",
  
  party: "A joyful scene with a {animal} at a pet party celebration, sitting upright like a human, holding a piece of golden crispy fried chicken, surrounded by colorful party decorations and balloons, festive atmosphere with warm indoor lighting, the pet looks cheerful and happy sharing food with friends, the fried chicken is prominently displayed with appetizing texture, photorealistic style, group celebration photography",
  
  cafe: "A {animal} sitting elegantly at a café table like a sophisticated human customer, with a piece of golden crispy fried chicken on a plate in front, cozy café interior with wooden furniture and plants, soft natural lighting from windows, the pet looks relaxed and classy, anthropomorphic sitting pose, the fried chicken has perfect crispy texture, photorealistic style, lifestyle café photography, Instagram aesthetic",
  
  park: "A {animal} having a picnic in a beautiful outdoor park, sitting on grass like a human, enjoying a piece of golden crispy fried chicken, sunny day with green trees and blue sky, natural daylight, the pet looks playful and energetic, anthropomorphic pose, the fried chicken is clearly visible with delicious crispy texture, photorealistic style, outdoor lifestyle photography, bokeh background"
};

// 動物類型映射（中文到英文）
const ANIMAL_TYPES = {
  'dog': 'dog',
  'cat': 'cat',
  'puppy': 'cute puppy',
  'kitten': 'adorable kitten',
  '狗': 'dog',
  '貓': 'cat',
  '小狗': 'cute puppy',
  '小貓': 'adorable kitten'
};

/**
 * 生成 AI 提示詞
 * @param {string} scene - 場景類型
 * @param {string} animalType - 動物類型（可選）
 * @returns {string} 完整的 AI 提示詞
 */
function generatePrompt(scene, animalType = 'pet') {
  const promptTemplate = SCENE_PROMPTS[scene] || SCENE_PROMPTS.selfie;
  const animal = ANIMAL_TYPES[animalType.toLowerCase()] || 'cute pet';
  
  return promptTemplate.replace('{animal}', animal);
}

// 中介軟體
app.use(cors());
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

// 提供靜態文件
app.use(express.static('public'));

// 健康檢查端點
app.get('/health', (req, res) => {
  res.json({ 
    status: 'ok', 
    timestamp: new Date().toISOString(),
    replicateConfigured: !!process.env.REPLICATE_API_TOKEN
  });
});

// AI 生成 API 端點
app.post('/api/generate', async (req, res) => {
  try {
    // 檢查環境變數
    const apiKey = process.env.REPLICATE_API_TOKEN;
    if (!apiKey) {
      console.error('REPLICATE_API_TOKEN not found in environment variables');
      return res.status(500).json({ 
        success: false, 
        error: 'Server configuration error. Please contact administrator.' 
      });
    }

    // 解析請求數據
    const { scene, animalType = 'pet' } = req.body;
    
    if (!scene) {
      return res.status(400).json({ 
        success: false, 
        error: 'Scene parameter is required' 
      });
    }

    // 驗證場景類型
    const validScenes = ['selfie', 'sofa', 'night_market', 'party', 'cafe', 'park'];
    if (!validScenes.includes(scene)) {
      return res.status(400).json({ 
        success: false, 
        error: `Invalid scene. Valid scenes are: ${validScenes.join(', ')}` 
      });
    }

    console.log(`[${new Date().toISOString()}] 開始生成 - 場景: ${scene}, 動物: ${animalType}`);

    // 生成提示詞
    const prompt = generatePrompt(scene, animalType);
    console.log(`[${new Date().toISOString()}] 生成提示詞: ${prompt.substring(0, 100)}...`);

    // 調用 Replicate API 生成圖片
    // 使用 FLUX.1 [schnell] 模型（快速版本，適合實時生成）
    console.log(`[${new Date().toISOString()}] 調用 Replicate API...`);
    
    const output = await replicate.run(
      "black-forest-labs/flux-schnell",
      {
        input: {
          prompt: prompt,
          num_outputs: 1,
          aspect_ratio: "4:3",
          output_format: "jpg",
          output_quality: 90,
          disable_safety_checker: false
        }
      }
    );

    console.log(`[${new Date().toISOString()}] Replicate API 回應:`, output);

    // 檢查輸出
    if (!output || (Array.isArray(output) && output.length === 0)) {
      throw new Error('No image generated from Replicate API');
    }

    // 獲取圖片 URL（output 可能是數組或字符串）
    const imageUrl = Array.isArray(output) ? output[0] : output;

    if (!imageUrl) {
      throw new Error('Invalid image URL from Replicate API');
    }

    console.log(`[${new Date().toISOString()}] 生成成功: ${imageUrl}`);

    // 返回成功響應
    res.json({
      success: true,
      imageUrl: imageUrl,
      scene: scene,
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error(`[${new Date().toISOString()}] 生成錯誤:`, error);
    
    // 根據錯誤類型返回不同的響應
    if (error.message.includes('API key') || error.message.includes('authentication')) {
      return res.status(401).json({
        success: false,
        error: 'API authentication failed. Please check your API key.'
      });
    }
    
    if (error.message.includes('rate limit')) {
      return res.status(429).json({
        success: false,
        error: 'Too many requests. Please try again later.'
      });
    }

    // 通用錯誤響應
    res.status(500).json({
      success: false,
      error: 'Failed to generate image. Please try again.',
      details: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

// 處理所有其他路由，返回 index.html（用於前端路由）
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
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

