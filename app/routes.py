from flask import Blueprint, render_template, request, jsonify
import os
from utils.video_processing import extract_frames

main_bp = Blueprint('main_bp', __name__)

@main_bp.route('/')
def index():
    return render_template('index.html')

@main_bp.route('/upload', methods=['POST'])
def upload_video():
    if 'video' not in request.files:
        return jsonify({'error': 'No video file provided'}), 400

    video = request.files['video']
    if video.filename == '':
        return jsonify({'error': 'No selected file'}), 400

    video_path = os.path.join('uploads', video.filename)
    video.save(video_path)

    frames_folder = 'static/frames'
    if not os.path.exists(frames_folder):
        os.makedirs(frames_folder)

    extract_frames(video_path, frames_folder)

    frames = sorted([f for f in os.listdir(frames_folder) if f.endswith('.jpg')])
    return jsonify({'frames': frames})
