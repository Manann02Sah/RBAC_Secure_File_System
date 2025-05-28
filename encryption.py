from cryptography.hazmat.primitives.ciphers import Cipher, algorithms, modes
from cryptography.hazmat.backends import default_backend
from cryptography.hazmat.primitives import padding
import os
from config import Config

def encrypt_file(file_path):
    """Encrypt a file using AES-128 encryption"""
    try:
        # Read the original file
        with open(file_path, 'rb') as f:
            plaintext = f.read()
        
        # Encrypt the data
        encrypted_data = encrypt_data(plaintext)
        
        # Write encrypted file (IV + ciphertext)
        encrypted_path = file_path + '.enc'
        with open(encrypted_path, 'wb') as f:
            f.write(encrypted_data)
        
        return encrypted_path
    
    except Exception as e:
        print(f"Encryption error: {e}")
        return file_path  # Return original path if encryption fails

def encrypt_data(plaintext):
    """Encrypt data using AES-128 encryption"""
    try:
        # Generate a random IV
        iv = os.urandom(16)  # 16 bytes for AES
        
        # Create cipher
        cipher = Cipher(algorithms.AES(Config.ENCRYPTION_KEY), modes.CBC(iv), backend=default_backend())
        encryptor = cipher.encryptor()
        
        # Pad the plaintext
        padder = padding.PKCS7(128).padder()
        padded_data = padder.update(plaintext)
        padded_data += padder.finalize()
        
        # Encrypt
        ciphertext = encryptor.update(padded_data) + encryptor.finalize()
        
        # Return IV + ciphertext
        return iv + ciphertext
    
    except Exception as e:
        print(f"Data encryption error: {e}")
        return plaintext

def decrypt_file(encrypted_file_path):
    """Decrypt a file and return path to decrypted file"""
    try:
        if not encrypted_file_path.endswith('.enc'):
            return encrypted_file_path  # File is not encrypted
        
        # Read the encrypted file
        with open(encrypted_file_path, 'rb') as f:
            encrypted_data = f.read()
        
        # Decrypt the data
        decrypted_data = decrypt_data(encrypted_data)
        
        # Write decrypted file
        decrypted_path = encrypted_file_path.replace('.enc', '.tmp')
        with open(decrypted_path, 'wb') as f:
            f.write(decrypted_data)
        
        return decrypted_path
    
    except Exception as e:
        print(f"Decryption error: {e}")
        return encrypted_file_path  # Return original path if decryption fails

def decrypt_data(encrypted_data):
    """Decrypt data using AES-128 decryption"""
    try:
        # Extract IV and ciphertext
        iv = encrypted_data[:16]
        ciphertext = encrypted_data[16:]
        
        # Create cipher
        cipher = Cipher(algorithms.AES(Config.ENCRYPTION_KEY), modes.CBC(iv), backend=default_backend())
        decryptor = cipher.decryptor()
        
        # Decrypt
        padded_plaintext = decryptor.update(ciphertext) + decryptor.finalize()
        
        # Unpad
        unpadder = padding.PKCS7(128).unpadder()
        plaintext = unpadder.update(padded_plaintext)
        plaintext += unpadder.finalize()
        
        return plaintext
    
    except Exception as e:
        print(f"Data decryption error: {e}")
        return encrypted_data
