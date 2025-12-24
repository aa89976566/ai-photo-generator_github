/**
 * Serverless Function for Replicate AI Image Generation
 * 豪大大雞霸 AI 寵物照片生成器 - 後端 API
 * 
 * 此函數處理：
 * 1. 接收用戶上傳的寵物照片
 * 2. 根據選擇的場景生成 AI 提示詞
 * 3. 調用 Replicate API 生成圖片
 * 4. 返回生成的圖片 URL
 */

const Replicate = require('replicate');

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

/**
 * 主函數 - Vercel Serverless Function Handler
 */
module.exports = async (req, res) => {
  // 設置 CORS 頭
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
  );

  // 處理 OPTIONS 請求（CORS preflight）
  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  // 只接受 POST 請求
  if (req.method !== 'POST') {
    return res.status(405).json({ 
      success: false, 
      error: 'Method not allowed. Please use POST.' 
    });
  }

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

    console.log(`Generating image for scene: ${scene}, animal: ${animalType}`);

    // 初始化 Replicate 客戶端
    const replicate = new Replicate({
      auth: apiKey,
    });

    // 生成提示詞
    const prompt = generatePrompt(scene, animalType);
    console.log(`Generated prompt: ${prompt.substring(0, 100)}...`);

    // 調用 Replicate API 生成圖片
    // 使用 FLUX.1 [schnell] 模型（快速版本，適合實時生成）
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

    console.log('Replicate API response:', output);

    // 檢查輸出
    if (!output || (Array.isArray(output) && output.length === 0)) {
      throw new Error('No image generated from Replicate API');
    }

    // 獲取圖片 URL（output 可能是數組或字符串）
    const imageUrl = Array.isArray(output) ? output[0] : output;

    if (!imageUrl) {
      throw new Error('Invalid image URL from Replicate API');
    }

    console.log(`Successfully generated image: ${imageUrl}`);

    // 返回成功響應
    return res.status(200).json({
      success: true,
      imageUrl: imageUrl,
      scene: scene,
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('Error generating image:', error);
    
    // 根據錯誤類型返回不同的響應
    if (error.message.includes('API key')) {
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
    return res.status(500).json({
      success: false,
      error: 'Failed to generate image. Please try again.',
      details: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};
