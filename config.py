import os
from datetime import timedelta

class Config:
    SECRET_KEY = os.environ.get('SECRET_KEY') or 'your-secret-key-change-this-in-production'
    UPLOAD_FOLDER = 'uploads'
    MAX_CONTENT_LENGTH = 16 * 1024 * 1024  # 16MB max file size
    ALLOWED_EXTENSIONS = {'txt', 'pdf', 'png', 'jpg', 'jpeg', 'gif', 'doc', 'docx', 'zip', 'rar', 'py', 'js', 'html', 'css'}
    PERMANENT_SESSION_LIFETIME = timedelta(hours=2)
    
    # AES Encryption key (16 bytes for AES-128)
    ENCRYPTION_KEY = b'sixteen byte key'  # 16 bytes for AES-128
    
    # Database configuration
    DATABASE = 'file_system.db'
    
    # Ensure upload directory exists
    @staticmethod
    def init_app(app):
        if not os.path.exists(Config.UPLOAD_FOLDER):
            os.makedirs(Config.UPLOAD_FOLDER)
        
        # Create subdirectories for different user types
        for folder in ['admin', 'user', 'public']:
            folder_path = os.path.join(Config.UPLOAD_FOLDER, folder)
            if not os.path.exists(folder_path):
                os.makedirs(folder_path)
