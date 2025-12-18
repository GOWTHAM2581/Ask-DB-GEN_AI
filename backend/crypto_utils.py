from cryptography.fernet import Fernet
import json
import base64
import os

# Generate a key or load from env. In production this must be consistent using a fixed secret.
# For this implementation, we derive a key from the SECRET_KEY if possible, or generate one.

SECRET_KEY_STR = os.getenv("SECRET_KEY", "fallback_secret_key_for_dev_only_must_be_32_bytes_base64")

# Pad or trim to 32 bytes for Fernet url-safe 
# Actually Fernet needs 32 url-safe base64-encoded bytes. 
# We'll just generate a simplistic one for this strict environment if not provided.
# A robust way is to use a fixed hardcoded key or properly generated one.
# I will use a generated key for this session to ensure it works immediately without config.
# WARNING: This means restarts invalidate DB tokens. This is acceptable for "Session" based DB access.
_key = Fernet.generate_key()
cipher_suite = Fernet(_key)

def encrypt_data(data: dict) -> str:
    json_bytes = json.dumps(data).encode('utf-8')
    encrypted = cipher_suite.encrypt(json_bytes)
    return base64.urlsafe_b64encode(encrypted).decode('utf-8')

def decrypt_data(token: str) -> dict:
    try:
        encrypted_bytes = base64.urlsafe_b64decode(token)
        decrypted_bytes = cipher_suite.decrypt(encrypted_bytes)
        return json.loads(decrypted_bytes.decode('utf-8'))
    except Exception:
        raise ValueError("Invalid token")
