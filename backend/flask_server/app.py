from flask import Flask, request, jsonify, send_file
from flask_cors import CORS
from googletrans import Translator
import os
import uuid
import logging
import hashlib
import json
from datetime import datetime
import gtts
from flask_caching import Cache

app = Flask(__name__)
CORS(app)

# Configure caching
cache_config = {
    "DEBUG": True,
    "CACHE_TYPE": "SimpleCache",  # Uses in-memory caching
    "CACHE_DEFAULT_TIMEOUT": 86400  # 24 hours (in seconds)
}
app.config.from_mapping(cache_config)
cache = Cache(app)

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s',
    handlers=[
        logging.StreamHandler(),
        logging.FileHandler('app.log')
    ]
)
logger = logging.getLogger(__name__)

# Create static directory if it doesn't exist
os.makedirs('static', exist_ok=True)
os.makedirs('static/cache', exist_ok=True)

# Initialize translator
translator = Translator()

def generate_cache_key(text, target_language='en'):
    """Generate a cache key based on text content and target language"""
    # Create a hash of the text and language to use as a cache key
    if isinstance(text, dict):
        # Convert dict to sorted string to ensure consistent hashing
        text_str = json.dumps(text, sort_keys=True)
    else:
        text_str = str(text)
    
    key = f"{text_str}_{target_language}"
    return hashlib.md5(key.encode()).hexdigest()

@app.route('/')
def home():
    return 'Welcome to the API!'

@app.route('/translate', methods=['POST'])
def translate_text():
    try:
        data = request.json
        text = data.get('text')
        target_language = data.get('target_language', 'en')
        
        if not text:
            return jsonify({'error': 'No text provided'}), 400
        
        # Generate cache key
        cache_key = generate_cache_key(text, target_language)
        
        # Check if result is in cache
        cached_result = cache.get(cache_key)
        if cached_result:
            logger.info(f"Cache hit for translation to {target_language}")
            return jsonify({'translatedText': cached_result})
        
        logger.info(f"Cache miss - Translating content to {target_language}")
        
        translated_result = {}
        
        if isinstance(text, dict):
            # Text is an object with multiple fields
            for key, value in text.items():
                if isinstance(value, list):
                    # Translate each item inside the list
                    translated_result[key] = [
                        translator.translate(item, dest=target_language).text 
                        for item in value
                    ]
                else:
                    # Translate normal string field
                    translated_result[key] = translator.translate(value, dest=target_language).text
        else:
            # Text is a single string
            translated = translator.translate(text, dest=target_language)
            translated_result = translated.text
        
        # Store in cache
        cache.set(cache_key, translated_result)
        
        return jsonify({'translatedText': translated_result})
    except Exception as e:
        logger.error(f'Translation error: {str(e)}', exc_info=True)
        return jsonify({'error': str(e)}), 500

@app.route('/speak', methods=['POST'])
def speak_text():
    try:
        data = request.json
        text = data.get('text')
        lang = data.get('language', 'en')
        
        if not text:
            return jsonify({'error': 'No text provided'}), 400
        
        # Generate cache key for audio
        cache_key = generate_cache_key(text, lang)
        audio_filename = f"{cache_key}.mp3"
        filepath = os.path.join('static/cache', audio_filename)
        
        # Check if the audio file already exists in cache
        if os.path.exists(filepath):
            logger.info(f"Cache hit for audio in language {lang}")
            audio_url = f'http://127.0.0.1:5000/static/cache/{audio_filename}'
            return jsonify({'audioUrl': audio_url})
        
        logger.info(f"Cache miss - Generating speech for text (length: {len(text)})")
        
        # Generate audio with gTTS
        tts = gtts.gTTS(text=text, lang=lang)
        tts.save(filepath)
        
        # Return the URL to the generated audio file
        audio_url = f'http://127.0.0.1:5000/static/cache/{audio_filename}'
        
        return jsonify({'audioUrl': audio_url})
    except Exception as e:
        logger.error(f'Speech generation error: {str(e)}', exc_info=True)
        return jsonify({'error': str(e)}), 500

@app.route('/static/cache/<filename>', methods=['GET'])
def serve_cached_file(filename):
    """Serve cached audio files"""
    try:
        return send_file(os.path.join('static/cache', filename))
    except Exception as e:
        logger.error(f'File serving error: {str(e)}', exc_info=True)
        return jsonify({'error': str(e)}), 404

# Cleanup old files periodically (optional)
@app.before_request
def cleanup_old_files():
    try:
        # Run cleanup only occasionally (e.g., 1% of requests)
        if uuid.uuid4().int % 100 == 0:
            logger.info("Running periodic cleanup of old audio files")
            now = datetime.now().timestamp()
            # Don't clean the cache directory as often
            for filename in os.listdir('static'):
                if filename != 'cache':  # Skip the cache directory
                    filepath = os.path.join('static', filename)
                    # Remove files older than 1 hour
                    if os.path.isfile(filepath) and now - os.path.getmtime(filepath) > 3600:
                        os.remove(filepath)
                        logger.info(f"Deleted old file: {filename}")
    except Exception as e:
        logger.error(f'Cleanup error: {str(e)}')

if __name__ == '__main__':
    app.run(debug=True, port=5000)