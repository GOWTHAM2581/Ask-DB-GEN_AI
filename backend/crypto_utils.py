from cryptography.fernet import Fernet
import json
import base64
import os

# Generate a key or load from env. In production this must be consistent using a fixed secret.
# For this implementation, we derive a key from the SECRET_KEY if possible, or generate one.

import hashlib

# Derive a consistent 32-byte key from SECRET_KEY for Fernet
SECRET_KEY_STR = os.getenv("SECRET_KEY", "fallback_secret_key_for_dev_only")
key_hash = hashlib.sha256(SECRET_KEY_STR.encode()).digest()
fernet_key = base64.urlsafe_b64encode(key_hash)
cipher_suite = Fernet(fernet_key)

def encrypt_data(data: dict) -> str:
    json_bytes = json.dumps(data).encode('utf-8')
    encrypted = cipher_suite.encrypt(json_bytes)
    # Fernet is already base64, so we just return it as string
    return encrypted.decode('utf-8')

def decrypt_data(token: str) -> dict:
    try:
        # Fernet handles base64 decoding internally
        decrypted_bytes = cipher_suite.decrypt(token.encode('utf-8'))
        return json.loads(decrypted_bytes.decode('utf-8'))
    except Exception as e:
        print(f"Decryption Error: {str(e)}")
        raise ValueError("Invalid token")
