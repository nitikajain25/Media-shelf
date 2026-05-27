import sqlite3
from flask import Flask, render_template, request, jsonify

app = Flask(__name__)
DB_FILE = "shelf.db"

# ==========================================
# DATABASE SETUP
# ==========================================
def init_db():
    """Connects to SQLite and creates the data table if it doesn't exist."""
    conn = sqlite3.connect(DB_FILE)
    cursor = conn.cursor()
    cursor.execute("""
        CREATE TABLE IF NOT EXISTS media_shelf (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            title TEXT NOT NULL,
            media_type TEXT NOT NULL,
            status TEXT DEFAULT 'pending'
        )
    """)
    conn.commit()
    conn.close()

# Initialize the database file automatically when the script loads
init_db()


# ==========================================
# BACKEND API ROUTING ENGINE
# ==========================================

@app.route('/')
def home():
    """Serves the frontend HTML file."""
    return render_template('index.html')


@app.route('/api/items', methods=['GET'])
def get_items():
    """Fetches all items from the database and returns them to the frontend."""
    conn = sqlite3.connect(DB_FILE)
    cursor = conn.cursor()
    
    # ORDER BY id ASC ensures older items stay at the top
    cursor.execute("SELECT id, title, media_type, status FROM media_shelf ORDER BY id ASC")
    rows = cursor.fetchall()
    conn.close()

    items = [{"id": r[0], "title": r[1], "media_type": r[2], "status": r[3]} for r in rows]
    return jsonify(items)


@app.route('/api/items', methods=['POST'])
def add_item():
    """Takes form data from the frontend and saves it to the database."""
    data = request.get_json()
    title = data.get('title')
    media_type = data.get('media_type')

    if not title or not media_type:
        return jsonify({"error": "Missing fields"}), 400

    conn = sqlite3.connect(DB_FILE)
    cursor = conn.cursor()
    cursor.execute("INSERT INTO media_shelf (title, media_type) VALUES (?, ?)", (title, media_type))
    conn.commit()
    conn.close()

    return jsonify({"message": "Successfully added"}), 201


@app.route('/api/items/<int:item_id>', methods=['PUT'])
def complete_item(item_id):
    """Updates an item's status to 'completed'."""
    conn = sqlite3.connect(DB_FILE)
    cursor = conn.cursor()
    cursor.execute("UPDATE media_shelf SET status = 'completed' WHERE id = ?", (item_id,))
    conn.commit()
    conn.close()

    return jsonify({"message": "Status updated"}), 200


@app.route('/api/items/<int:item_id>', methods=['DELETE'])
def delete_item(item_id):
    """Removes an item from the database permanently."""
    conn = sqlite3.connect(DB_FILE)
    cursor = conn.cursor()
    cursor.execute("DELETE FROM media_shelf WHERE id = ?", (item_id,))
    conn.commit()
    conn.close()

    return jsonify({"message": "Item deleted"}), 200


# ==========================================
# LOCAL HOSTING
# ==========================================
if __name__ == '__main__':
    # host='0.0.0.0' allows access across your local home network!
    app.run(host='0.0.0.0', port=5000, debug=True)