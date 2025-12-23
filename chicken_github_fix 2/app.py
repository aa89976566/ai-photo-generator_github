from flask import Flask, render_template, request, jsonify, send_from_directory
import os
from datetime import datetime
import json
from PIL import Image, ImageDraw, ImageEnhance
import io

app = Flask(__name__)
app.config['UPLOAD_FOLDER'] = 'uploads'
app.config['RESULT_FOLDER'] = 'results'
app.config['MAX_CONTENT_LENGTH'] = 16 * 1024 * 1024

os.makedirs(app.config['UPLOAD_FOLDER'], exist_ok=True)
os.makedirs(app.config['RESULT_FOLDER'], exist_ok=True)

STATS_FILE = 'stats.json'

def get_stats():
    if os.path.exists(STATS_FILE):
        with open(STATS_FILE, 'r', encoding='utf-8') as f:
            return json.load(f)
    return {'total_generations': 0, 'total_likes': 0, 'line_friends': 523}

def update_stats(field, increment=1):
    stats = get_stats()
    stats[field] = stats.get(field, 0) + increment
    with open(STATS_FILE, 'w', encoding='utf-8') as f:
        json.dump(stats, f, ensure_ascii=False, indent=2)
    return stats

def generate_effect_image(image_path, style):
    """生成特效圖片"""
    img = Image.open(image_path)
    
    if img.mode != 'RGB':
        img = img.convert('RGB')
    
    max_size = 1024
    img.thumbnail((max_size, max_size), Image.Resampling.LANCZOS)
    
    if style == 'exaggerated':
        # 浮誇吃相王：高對比度、高飽和度、橘色邊框
        enhancer = ImageEnhance.Contrast(img)
        img = enhancer.enhance(1.5)
        enhancer = ImageEnhance.Color(img)
        img = enhancer.enhance(1.8)
        enhancer = ImageEnhance.Brightness(img)
        img = enhancer.enhance(1.1)
        
        border_size = 20
        bordered = Image.new('RGB', (img.width + border_size*2, img.height + border_size*2), (255, 107, 53))
        bordered.paste(img, (border_size, border_size))
        img = bordered
        
    elif style == 'elegant':
        # 優雅貴族版：柔和、粉色調
        enhancer = ImageEnhance.Brightness(img)
        img = enhancer.enhance(1.2)
        enhancer = ImageEnhance.Color(img)
        img = enhancer.enhance(1.3)
        
        pink_overlay = Image.new('RGB', img.size, (255, 192, 203))
        img = Image.blend(img, pink_overlay, alpha=0.15)
        
        border_size = 20
        bordered = Image.new('RGB', (img.width + border_size*2, img.height + border_size*2), (255, 182, 193))
        bordered.paste(img, (border_size, border_size))
        img = bordered
        
    elif style == 'kungfu':
        # 武林雞霸：復古懷舊濾鏡
        img = img.convert('L')
        img = img.convert('RGB')
        
        sepia_overlay = Image.new('RGB', img.size, (112, 66, 20))
        img = Image.blend(img, sepia_overlay, alpha=0.4)
        
        enhancer = ImageEnhance.Contrast(img)
        img = enhancer.enhance(0.8)
        
        border_size = 20
        bordered = Image.new('RGB', (img.width + border_size*2, img.height + border_size*2), (139, 69, 19))
        bordered.paste(img, (border_size, border_size))
        img = bordered
        
    elif style == 'surprise':
        # 雞排爆炸王：高飽和度、彩虹邊框
        enhancer = ImageEnhance.Color(img)
        img = enhancer.enhance(2.0)
        enhancer = ImageEnhance.Sharpness(img)
        img = enhancer.enhance(2.0)
        enhancer = ImageEnhance.Brightness(img)
        img = enhancer.enhance(1.15)
        
        border_size = 25
        bordered = Image.new('RGB', (img.width + border_size*2, img.height + border_size*2))
        draw = ImageDraw.Draw(bordered)
        
        colors = [(255, 0, 0), (255, 127, 0), (255, 255, 0), (0, 255, 0), (0, 0, 255), (75, 0, 130), (148, 0, 211)]
        for i in range(border_size):
            color_idx = int((i / border_size) * len(colors))
            color_idx = min(color_idx, len(colors) - 1)
            color = colors[color_idx]
            draw.rectangle([i, i, bordered.width-i-1, bordered.height-i-1], outline=color)
        
        bordered.paste(img, (border_size, border_size))
        img = bordered
    
    return img

@app.route('/')
def index():
    stats = get_stats()
    return render_template('index.html', stats=stats)

@app.route('/upload', methods=['POST'])
def upload():
    try:
        pet_name = request.form.get('pet_name', '')
        pet_breed = request.form.get('pet_breed', '')
        style = request.form.get('style', 'exaggerated')
        
        if 'photo' not in request.files:
            return jsonify({'error': '沒有上傳照片'}), 400
        
        file = request.files['photo']
        if file.filename == '':
            return jsonify({'error': '檔案名稱為空'}), 400
        
        timestamp = datetime.now().strftime('%Y%m%d_%H%M%S')
        filename = f"{timestamp}_{pet_name}.jpg"
        filepath = os.path.join(app.config['UPLOAD_FOLDER'], filename)
        file.save(filepath)
        
        styles = ['exaggerated', 'elegant', 'kungfu', 'surprise']
        style_names = {
            'exaggerated': '浮誇吃相王',
            'elegant': '優雅貴族版',
            'kungfu': '武林雞霸',
            'surprise': '雞排爆炸王'
        }
        
        result_images = []
        for s in styles:
            result_img = generate_effect_image(filepath, s)
            result_filename = f"{timestamp}_{pet_name}_{s}.jpg"
            result_path = os.path.join(app.config['RESULT_FOLDER'], result_filename)
            result_img.save(result_path, 'JPEG', quality=90)
            result_images.append({
                'style': s,
                'style_name': style_names[s],
                'url': f'/results/{result_filename}'
            })
        
        user_data = {
            'timestamp': timestamp,
            'pet_name': pet_name,
            'pet_breed': pet_breed,
            'selected_style': style_names[style]
        }
        
        save_user_data(user_data)
        update_stats('total_generations', 4)
        
        return jsonify({
            'success': True,
            'result_images': result_images,
            'message': f'成功生成 {pet_name} 的 4 種搞笑風格照片！'
        })
        
    except Exception as e:
        print(f"Error: {str(e)}")
        return jsonify({'error': str(e)}), 500

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
