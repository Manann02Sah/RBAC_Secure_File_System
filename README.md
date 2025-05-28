# Flask Role-Based File Access System

A comprehensive Flask-based file management system with role-based access control, AES-128 encryption, and modern UI with light/dark mode.

## Features

### 🔐 Security
- **AES-128 File Encryption**: All uploaded files are encrypted
- **Password Hashing**: Secure user authentication with Werkzeug
- **Role-Based Access Control**: Admin, User, and Guest roles
- **Session Management**: Secure session handling

### 👥 User Management
- **Admin Approval System**: New users require admin approval
- **Role Management**: Different permissions for different user types
- **User Dashboard**: Personalized file management interface

### 📁 File Operations
- **Upload Files**: Support for multiple file types
- **Download Files**: Encrypted files are decrypted on download
- **View Files**: Text files can be viewed directly in browser
- **Delete Files**: Users can delete their own files, admins can delete any

### 🎨 Modern UI
- **Light/Dark Mode**: Toggle between themes with smooth transitions
- **Interactive Buttons**: Hover effects, ripple animations
- **Responsive Design**: Works on all device sizes
- **Bootstrap 5**: Modern, clean interface
- **Font Awesome Icons**: Beautiful iconography

### 🔧 Technical
- **Python 3.12 Compatible**: Latest Python features
- **XAMPP Ready**: Easy deployment with XAMPP
- **SQLite Database**: Lightweight, file-based database
- **Flask Blueprints**: Modular application structure

## Installation

### Prerequisites
- Python 3.12
- XAMPP (optional)

### Setup
1. Extract all files to your project directory
2. Install dependencies:
   \`\`\`bash
   pip install -r requirements.txt
   \`\`\`
3. Run the application:
   \`\`\`bash
   python app.py
   \`\`\`
4. Access at: `http://localhost:5000`

### Default Credentials
- **Username**: admin
- **Password**: admin123

## File Structure
\`\`\`
flask-file-system/
├── app.py                 # Main Flask application
├── config.py             # Configuration settings
├── database.py           # Database operations
├── auth.py               # Authentication blueprint
├── file_manager.py       # File management blueprint
├── encryption.py         # AES encryption/decryption
├── requirements.txt      # Python dependencies
├── templates/            # HTML templates
│   ├── base.html         # Base template with themes
│   ├── index.html        # Landing page
│   ├── login.html        # Login form
│   ├── register.html     # Registration form
│   ├── user_dashboard.html
│   ├── admin_dashboard.html
│   ├── upload.html
│   ├── file_list.html
│   ├── view_file.html
│   └── manage_users.html
└── uploads/              # File storage (auto-created)
    ├── admin/
    ├── user/
    └── public/
\`\`\`

## Usage

### For Guests
- Browse public files without registration
- View text files directly in browser
- No download permissions

### For Users
- Register and wait for admin approval
- Upload files to personal folder
- Download own files and public files
- View and manage personal file collection

### For Admins
- Approve/reject user registrations
- Upload files to any folder (admin, user, public)
- Download and delete any files
- Manage all users and system settings
- Full access to all features

## Configuration

Edit `config.py` to customize:
- Upload folder location
- Maximum file size (default: 16MB)
- Allowed file extensions
- Encryption key (IMPORTANT: Change in production!)
- Session timeout

## Security Notes

1. **Change the encryption key** in `config.py` for production use
2. **Change default admin password** after first login
3. **Use HTTPS** in production environment
4. **Regular backups** of the database and uploaded files

## Troubleshooting

### Common Issues
1. **Import Errors**: Ensure all dependencies are installed
2. **Database Issues**: Delete `file_system.db` to reset
3. **File Upload Issues**: Check folder permissions
4. **Encryption Errors**: Verify cryptography library installation

### Support
For issues or questions, check the code comments or create an issue in the repository.

## License
This project is open source and available under the MIT License.
