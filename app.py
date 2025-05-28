from flask import Flask, render_template, request, redirect, url_for, session, flash, send_file, jsonify, abort
from werkzeug.security import generate_password_hash, check_password_hash
from werkzeug.utils import secure_filename
import os
import sqlite3
from datetime import datetime
import zipfile
import io
from functools import wraps
from auth import auth_bp, login_required, admin_required
from file_manager import file_bp
from database import init_db, get_db_connection
from encryption import encrypt_file, decrypt_file
from config import Config

app = Flask(__name__)
app.config.from_object(Config)

# Register blueprints
app.register_blueprint(auth_bp, url_prefix='/auth')
app.register_blueprint(file_bp, url_prefix='/files')

# Initialize database
init_db()

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/dashboard')
@login_required
def dashboard():
    conn = get_db_connection()
    
    if session.get('role') == 'admin':
        # Admin dashboard - show pending users and file stats
        pending_users = conn.execute(
            'SELECT id, username, email, created_at FROM users WHERE status = "pending"'
        ).fetchall()
        
        total_files = conn.execute('SELECT COUNT(*) FROM files').fetchone()[0]
        total_users = conn.execute('SELECT COUNT(*) FROM users WHERE status = "approved"').fetchone()[0]
        
        conn.close()
        return render_template('admin_dashboard.html', 
                             pending_users=pending_users,
                             total_files=total_files,
                             total_users=total_users)
    else:
        # User dashboard - show accessible files
        user_files = conn.execute(
            'SELECT * FROM files WHERE uploaded_by = ? OR visibility = "public"',
            (session['user_id'],)
        ).fetchall()
        
        conn.close()
        return render_template('user_dashboard.html', files=user_files)

@app.route('/admin/users')
@admin_required
def manage_users():
    conn = get_db_connection()
    users = conn.execute(
        'SELECT id, username, email, role, status, created_at FROM users ORDER BY created_at DESC'
    ).fetchall()
    conn.close()
    return render_template('manage_users.html', users=users)

@app.route('/admin/approve_user/<int:user_id>')
@admin_required
def approve_user(user_id):
    conn = get_db_connection()
    conn.execute('UPDATE users SET status = "approved" WHERE id = ?', (user_id,))
    conn.commit()
    conn.close()
    flash('User approved successfully!', 'success')
    return redirect(url_for('manage_users'))

@app.route('/admin/reject_user/<int:user_id>')
@admin_required
def reject_user(user_id):
    conn = get_db_connection()
    conn.execute('DELETE FROM users WHERE id = ?', (user_id,))
    conn.commit()
    conn.close()
    flash('User rejected and removed!', 'success')
    return redirect(url_for('manage_users'))

@app.route('/toggle_theme')
def toggle_theme():
    current_theme = session.get('theme', 'light')
    new_theme = 'dark' if current_theme == 'light' else 'light'
    session['theme'] = new_theme
    return redirect(request.referrer or url_for('index'))

if __name__ == '__main__':
    # Ensure upload directories exist
    Config.init_app(app)
    app.run(debug=True, host='0.0.0.0', port=5000)
