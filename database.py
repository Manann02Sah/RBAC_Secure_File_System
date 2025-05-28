import sqlite3
from werkzeug.security import generate_password_hash
from config import Config

def get_db_connection():
    conn = sqlite3.connect(Config.DATABASE)
    conn.row_factory = sqlite3.Row
    return conn

def init_db():
    conn = get_db_connection()
    
    # Create users table
    conn.execute('''
        CREATE TABLE IF NOT EXISTS users (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            username TEXT UNIQUE NOT NULL,
            email TEXT UNIQUE NOT NULL,
            password_hash TEXT NOT NULL,
            role TEXT NOT NULL DEFAULT 'user',
            status TEXT NOT NULL DEFAULT 'pending',
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
    ''')
    
    # Create files table
    conn.execute('''
        CREATE TABLE IF NOT EXISTS files (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            filename TEXT NOT NULL,
            original_filename TEXT NOT NULL,
            file_path TEXT NOT NULL,
            file_size INTEGER NOT NULL,
            file_type TEXT NOT NULL,
            uploaded_by INTEGER NOT NULL,
            folder TEXT NOT NULL DEFAULT 'user',
            visibility TEXT NOT NULL DEFAULT 'private',
            is_encrypted BOOLEAN DEFAULT 1,
            upload_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (uploaded_by) REFERENCES users (id)
        )
    ''')
    
    # Create default admin user if not exists
    admin_exists = conn.execute(
        'SELECT id FROM users WHERE username = "admin"'
    ).fetchone()
    
    if not admin_exists:
        admin_password = generate_password_hash('admin123')
        conn.execute(
            'INSERT INTO users (username, email, password_hash, role, status) VALUES (?, ?, ?, ?, ?)',
            ('admin', 'admin@example.com', admin_password, 'admin', 'approved')
        )
    
    conn.commit()
    conn.close()
