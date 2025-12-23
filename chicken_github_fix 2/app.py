from flask import Flask, render_template, request, jsonify, send_from_directory
import os
from datetime import datetime
import json
import replicate
import requests
from io import BytesIO

app = Flask(__name__)
app.config['UPLOAD_FOLDER'] = 'uploads'
app.config['RESULT_FOLDER'] = 'results'
app.config['MAX_CONTENT_LENGTH'] = 16 * 1024 * 1024

os.makedirs(app.config['UPLOAD_FOLDER'], exist_ok=True)
os.makedirs(app.config['RESULT_FOLDER'], exist_ok=True)

STATS_FILE = 'stats.json'

# Replicate API Token
REPLICATE_API_TOKEN = os.environ.get('REPLICATE_API_TOKEN')
if REPLICATE_API_TOKEN:
    os.environ["REPLICATE_API_TOKEN"] = REPLICATE_API_TOKEN

def get_stats():
    if os.path.exists(STATS_FILE):
        with open(STATS_FILE, 'r', encoding='utf-8') as f:
            return json.load(f)
    return {'total_generations': 347, 'total_likes': 12847, 'line_friends': 523}

def update_stats(field, increment=1):
    stats = get_stats()
    stats[field] = stats.get(field, 0) + increment
    with open(STATS_FILE, 'w', encoding='utf-8') as f:
        json.dump(stats, f, ensure_ascii=False, indent=2)
    return stats

def generate_ai_image(image_path, style, pet_name):
    """使用 Replicate AI 生成真實照片風格的圖片"""
    
    # 根據您的真實產品定義 Prompt
    # 產品：匠寵 擔大大雞霸 - 薄薄的手撕雞肉片
    
    style_prompts = {
        'exaggerated': f'''Professional photograph of a real {pet_name} dog with exaggerated excited expression, 
        mouth wide open biting a thin golden crispy chicken strip from red-yellow packaging with "匠寵 擔大大雞霸" branding and cartoon chicken logo, 
        drool dripping, eyes bulging with excitement, tongue out, comic expression, 
        studio lighting, orange gradient background, humorous pet photography, realistic photo style, 
        high quality DSLR photo, shallow depth of field''',
        
        'elegant': f'''Professional pet photography of an elegant real {pet_name} dog sitting gracefully, 
        delicately holding a thin golden chicken strip in red-yellow "匠寵 擔大大雞霸" packaging with cartoon chicken mascot, 
        "Thank you very much" sticker visible on wrapper,
        soft pastel pink and cream background, Instagram aesthetic, bokeh effect, 
        natural soft lighting, professional studio setup, elegant pose, 
        high-end pet photography style, realistic photo''',
        
        'kungfu': f'''Cinematic photograph of a real {pet_name} dog dressed in traditional Chinese kung fu outfit, 
        holding a thin crispy chicken strip from "匠寵 擔大大雞霸" red-yellow packaging like a martial arts weapon, 
        heroic action pose, vintage film look with sepia tones, 
        ancient Chinese temple background with stone steps, 
        dramatic side lighting, retro photography style, realistic photo with film grain''',
        
        'surprise': f'''Dynamic professional photograph of a real {pet_name} dog with surprised joyful expression, 
        multiple thin golden chicken strips from "匠寵 擔大大雞霸" red-yellow packages floating and flying around in mid-air, 
        rainbow light effects, neon glow particles, vibrant colors, 
        energetic composition, celebration mood, 
        high-speed photography, realistic photo with creative lighting effects'''
    }
    
    prompt = style_prompts.get(style, style_prompts['exaggerated'])
    
    # 增強真實感的 negative prompt
    negative_prompt = "cartoon, anime, illustration, drawing, painting, 3D render, CGI, artificial, fake, unrealistic, low quality, blurry"
    
    try:
        print(f"🎨 生成風格: {style}")
        print(f"📝 Prompt: {prompt[:100]}...")
        
        # 使用 Replicate SDXL - 真實照片風格
        output = replicate.run(
            "stability-ai/sdxl:39ed52f2a78e934b3ba6e2a89f5b1c712de7dfea535525255b1aa35c5565e08b",
            input={
                "prompt": prompt,
                "negative_prompt": negative_prompt,
                "image": open(image_path, "rb"),
                "strength": 0.65,  # 保留更多原圖狗狗特徵
                "num_outputs": 1,
                "scheduler": "K_EULER_ANCESTRAL",
                "num_inference_steps": 40,  # 提高品質
                "guidance_scale": 8.0,  # 更準確遵循 prompt
                "seed": None  # 隨機種子
            }
        )
        
        # 下載生成的圖片
        if output and len(output) > 0:
            image_url = output[0]
            print(f"✅ 圖片 URL: {image_url}")
            response = requests.get(image_url)
            if response.status_code == 200:
                return BytesIO(response.content)
            else:
                print(f"❌ 下載失敗: {response.status_code}")
        
        return None
        
    except Exception as e:
        print(f"❌ AI Generation Error: {str(e)}")
        import traceback
        traceback.print_exc()
        return None

@app.route('/')
def index():
    stats = get_stats()
    return render_template('index.html', stats=stats)

@app.route('/upload', methods=['POST'])
def upload():
    try:
        pet_name = request.form.get('pet_name', '狗狗')
        pet_breed = request.form.get('pet_breed', '')
        style = request.form.get('style', 'exaggerated')
        
        if 'photo' not in request.files:
            return jsonify({'error': '沒有上傳照片'}), 400
        
        file = request.files['photo']
        if file.filename == '':
            return jsonify({'error': '檔案名稱為空'}), 400
        
        # 儲存上傳的照片
        timestamp = datetime.now().strftime('%Y%m%d_%H%M%S')
        filename = f"{timestamp}_{pet_name}.jpg"
        filepath = os.path.join(app.config['UPLOAD_FOLDER'], filename)
        file.save(filepath)
        
        print(f"📸 照片已儲存: {filepath}")
        
        # 檢查 API Token
        if not REPLICATE_API_TOKEN:
            return jsonify({
                'error': '請先設定 REPLICATE_API_TOKEN 環境變數',
                'message': '請在 Railway Variables 中新增 API Token'
            }), 500
        
        # 定義 4 種風格
        styles = ['exaggerated', 'elegant', 'kungfu', 'surprise']
        style_names = {
            'exaggerated': '🤪 浮誇吃相王',
            'elegant': '👑 優雅貴族版',
            'kungfu': '🥋 武林雞霸',
            'surprise': '🎉 雞排爆炸王'
        }
        
        result_images = []
        failed_styles = []
        
        # 生成 4 種風格的 AI 圖片
        for s in styles:
            print(f"\n{'='*50}")
            print(f"🎨 正在生成風格: {style_names[s]}")
            print(f"{'='*50}")
            
            ai_image = generate_ai_image(filepath, s, pet_name)
            
            if ai_image:
                # 儲存 AI 生成的圖片
                result_filename = f"{timestamp}_{pet_name}_{s}.jpg"
                result_path = os.path.join(app.config['RESULT_FOLDER'], result_filename)
                
                with open(result_path, 'wb') as f:
                    f.write(ai_image.getvalue())
                
                result_images.append({
                    'style': s,
                    'style_name': style_names[s],
                    'url': f'/results/{result_filename}'
                })
                
                print(f"✅ 成功生成: {style_names[s]}")
            else:
                print(f"❌ 生成失敗: {style_names[s]}")
                failed_styles.append(style_names[s])
        
        # 如果有成功生成的圖片，就回傳
        if result_images:
            # 儲存用戶資料
            user_data = {
                'timestamp': timestamp,
                'pet_name': pet_name,
                'pet_breed': pet_breed,
                'selected_style': style_names[style],
                'success_count': len(result_images)
            }
            save_user_data(user_data)
            
            # 更新統計
            update_stats('total_generations', len(result_images))
            
            message = f'🎉 成功生成 {pet_name} 的 {len(result_images)} 種 AI 搞笑照片！'
            if failed_styles:
                message += f' (部分風格生成失敗: {", ".join(failed_styles)})'
            
            return jsonify({
                'success': True,
                'result_images': result_images,
                'message': message
            })
        else:
            # 全部失敗
            return jsonify({
                'error': 'AI 生成全部失敗',
                'message': '請檢查 Replicate API Token 是否正確，或稍後再試'
            }), 500
        
    except Exception as e:
        print(f"❌ Error: {str(e)}")
        import traceback
        traceback.print_exc()
        return jsonify({'error': f'處理失敗：{str(e)}'}), 500

def save_user_data(data):
    users_file = 'users.json'
    users = []
    
    if os.path.exists(users_file):
        with open(users_file, 'r', encoding='utf-8') as f:
            users = json.load(f)
    
    users.append(data)
    
    with open(users_file, 'w', encoding='utf-8') as f:
        json.dump(users, f, ensure_ascii=False, indent=2)

@app.route('/stats')
def stats():
    return jsonify(get_stats())

@app.route('/results/<filename>')
def result_file(filename):
    return send_from_directory(app.config['RESULT_FOLDER'], filename)

if __name__ == '__main__':
    port = int(os.environ.get('PORT', 5000))
    app.run(host='0.0.0.0', port=port, debug=False)
