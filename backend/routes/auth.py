# backend/routes/auth.py

from flask import Blueprint, request, jsonify
from werkzeug.security import generate_password_hash, check_password_hash
from flask_jwt_extended import create_access_token
from models.database import connect_db

auth_bp = Blueprint('auth', __name__)

@auth_bp.route('/register', methods=['POST'])
def register():
    data = request.get_json()
    name     = data.get('name')
    email    = data.get('email')
    password = data.get('password')

    # 1) Validate input
    if not name or not email or not password:
        return jsonify({"error": "Missing name, email, or password"}), 400

    # 2) Connect to DB
    conn = connect_db()
    if conn is None:
        return jsonify({"error": "Database connection failed"}), 500
    cursor = conn.cursor(dictionary=True)

    # 3) Check for existing email
    cursor.execute("SELECT id FROM users WHERE email = %s", (email,))
    if cursor.fetchone():
        cursor.close()
        conn.close()
        return jsonify({"error": "Email already registered"}), 409

    # 4) Insert new user
    hashed = generate_password_hash(password)
    cursor.execute(
        "INSERT INTO users (name, email, password) VALUES (%s, %s, %s)",
        (name, email, hashed)
    )
    conn.commit()

    # 5) Clean up and respond
    cursor.close()
    conn.close()
    return jsonify({"message": "User registered successfully"}), 201


@auth_bp.route('/login', methods=['POST'])
def login():
    data = request.get_json() or {}
    email    = data.get('email')
    password = data.get('password')

    if not email or not password:
        return jsonify({"error": "Missing email or password"}), 400

    conn = connect_db()
    if conn is None:
        return jsonify({"error": "Database connection failed"}), 500
    cursor = conn.cursor(dictionary=True)

    cursor.execute("SELECT id, password FROM users WHERE email = %s", (email,))
    user = cursor.fetchone()

    # If we found a user, check the hash
    if user and check_password_hash(user['password'], password):
        access_token = create_access_token(identity=user['id'])
        cursor.close()
        conn.close()
        return jsonify({"access_token": access_token, "message": "Login successful"}), 200

    # No match
    cursor.close()
    conn.close()
    return jsonify({"error": "Invalid email or password"}), 401
