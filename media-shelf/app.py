from flask import Flask, request, jsonify
from flask_cors import CORS
from werkzeug.security import generate_password_hash, check_password_hash
import sqlite3
import requests

app = Flask(__name__)
# This allows React (port 3000) to talk to Python (port 5000) without getting blocked
CORS(app) 

DB_FILE = "shelf.db"
OMDB_API_KEY = "b44b03be" # Put your key back here!

def init_db():
    conn = sqlite3.connect(DB_FILE)
    cursor = conn.cursor()
    
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS users (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            username TEXT UNIQUE NOT NULL,
            password TEXT NOT NULL
        )
    ''')
    
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS media_shelf (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            user_id INTEGER NOT NULL,
            title TEXT NOT NULL,
            media_type TEXT NOT NULL,
            status TEXT DEFAULT 'pending',
            poster_url TEXT,
            FOREIGN KEY (user_id) REFERENCES users (id)
        )
    ''')
    
    conn.commit()
    conn.close()

init_db()

# =========================================
# AUTHENTICATION ROUTES
# =========================================

@app.route('/api/register', methods=['POST'])
def register():
    data = request.get_json()
    username = data.get('username')
    password = data.get('password')

    if not username or not password:
        return jsonify({"error": "Username and password are required"}), 400

    hashed_password = generate_password_hash(password)
    conn = sqlite3.connect(DB_FILE)
    cursor = conn.cursor()
    
    try:
        cursor.execute('INSERT INTO users (username, password) VALUES (?, ?)', (username, hashed_password))
        conn.commit()
        return jsonify({"message": "User registered successfully!"}), 201
    except sqlite3.IntegrityError:
        return jsonify({"error": "Username already taken"}), 400
    finally:
        conn.close()

@app.route('/api/login', methods=['POST'])
def login():
    data = request.get_json()
    username = data.get('username') # or email, depending on how you set it up
    password = data.get('password')

    conn = sqlite3.connect(DB_FILE)
    conn.row_factory = sqlite3.Row
    cursor = conn.cursor()
    
    # 1. First, check if the user even exists
    cursor.execute("SELECT * FROM users WHERE username = ?", (username,))
    user = cursor.fetchone()

    if not user:
        conn.close()
        # NEW: Tell them exactly what is wrong!
        return jsonify({"error": "Account not found. Please Sign Up first!"}), 404

    # 2. If the user exists, check the password
    if check_password_hash(user["password"], password):
        conn.close()
        return jsonify({"message": "Login successful", "user": dict(user)}), 200
    else:
        conn.close()
        # NEW: Specific password error
        return jsonify({"error": "Incorrect password. Please try again."}), 401
# 3. CHANGE PASSWORD ROUTE
@app.route('/api/change-password', methods=['PUT'])
def change_password():
    data = request.get_json()
    user_id = data.get('user_id')
    current_password = data.get('current_password')
    new_password = data.get('new_password')

    if not user_id or not current_password or not new_password:
        return jsonify({"error": "Missing fields"}), 400

    conn = sqlite3.connect(DB_FILE)
    conn.row_factory = sqlite3.Row
    cursor = conn.cursor()
    
    # Find the user
    cursor.execute("SELECT * FROM users WHERE id = ?", (user_id,))
    user = cursor.fetchone()

    # Verify old password matches
    if user and check_password_hash(user["password"], current_password):
        # Hash the new password and save it
        hashed_new_password = generate_password_hash(new_password)
        cursor.execute("UPDATE users SET password = ? WHERE id = ?", (hashed_new_password, user_id))
        conn.commit()
        conn.close()
        return jsonify({"message": "Password updated successfully!"}), 200
    else:
        conn.close()
        return jsonify({"error": "Incorrect current password"}), 401

# =========================================
# MEDIA SHELF ROUTES
# =========================================

@app.route('/api/items', methods=['GET'])
def get_items():
    # 1. Catch the specific user_id React is asking for
    user_id = request.args.get('user_id') 
    
    conn = sqlite3.connect(DB_FILE)
    conn.row_factory = sqlite3.Row 
    cursor = conn.cursor()
    # 2. ONLY select items that belong to this user
    cursor.execute("SELECT * FROM media_shelf WHERE user_id = ? ORDER BY id DESC", (user_id,))
    rows = cursor.fetchall()
    conn.close()

    items = [{"id": r["id"], "title": r["title"], "media_type": r["media_type"], "status": r["status"], "poster_url": r["poster_url"]} for r in rows]
    return jsonify(items)

@app.route('/api/items', methods=['POST'])
def add_item():
    data = request.get_json()
    title = data.get('title')
    media_type = data.get('media_type')
    user_id = data.get('user_id') # 3. Catch the real user_id from React!

    if not title or not media_type or not user_id:
        return jsonify({"error": "Missing fields"}), 400

    poster_url = None 
    try:
        if media_type == 'Movie':
            omdb_response = requests.get(f"http://www.omdbapi.com/?t={title}&apikey={OMDB_API_KEY}")
            omdb_data = omdb_response.json()
            if omdb_data.get("Response") == "True" and omdb_data.get("Poster") != "N/A":
                poster_url = omdb_data.get("Poster")
        elif media_type == 'Book':
            safe_title = title.replace(" ", "+")
            ol_response = requests.get(f"https://openlibrary.org/search.json?title={safe_title}")
            ol_data = ol_response.json()
            if "docs" in ol_data:
                for doc in ol_data["docs"]:
                    if "cover_i" in doc: 
                        cover_id = doc["cover_i"]
                        poster_url = f"https://covers.openlibrary.org/b/id/{cover_id}-M.jpg"
                        break 
    except Exception as e:
        print("Error fetching poster:", e)

    conn = sqlite3.connect(DB_FILE)
    cursor = conn.cursor()
    # 4. Save the item strictly to this user's ID
    cursor.execute('''
        INSERT INTO media_shelf (user_id, title, media_type, status, poster_url) 
        VALUES (?, ?, ?, 'pending', ?)
    ''', (user_id, title, media_type, poster_url))
    conn.commit()
    conn.close()

    return jsonify({"message": "Successfully added"}), 201

@app.route('/api/items/<int:item_id>', methods=['PUT'])
def complete_item(item_id):
    conn = sqlite3.connect(DB_FILE)
    cursor = conn.cursor()
    cursor.execute("UPDATE media_shelf SET status = 'completed' WHERE id = ?", (item_id,))
    conn.commit()
    conn.close()
    return jsonify({"message": "Status updated"}), 200

@app.route('/api/items/<int:item_id>', methods=['DELETE'])
def delete_item(item_id):
    conn = sqlite3.connect(DB_FILE)
    cursor = conn.cursor()
    cursor.execute("DELETE FROM media_shelf WHERE id = ?", (item_id,))
    conn.commit()
    conn.close()
    return jsonify({"message": "Item deleted"}), 200

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000, debug=True)