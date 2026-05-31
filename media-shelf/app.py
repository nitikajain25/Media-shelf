import sqlite3
import requests
from flask import Flask, render_template, request, jsonify

app = Flask(__name__)
DB_FILE = "shelf.db"

# Your specific OMDb API Key
OMDB_API_KEY = "b44b03be" 

# ==========================================
# DATABASE SETUP
# ==========================================
def init_db():
    conn = sqlite3.connect(DB_FILE)
    cursor = conn.cursor()
    cursor.execute("""
        CREATE TABLE IF NOT EXISTS media_shelf (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            title TEXT NOT NULL,
            media_type TEXT NOT NULL,
            status TEXT DEFAULT 'pending',
            poster_url TEXT 
        )
    """)
    conn.commit()
    conn.close()

init_db()


# ==========================================
# BACKEND API ROUTING ENGINE
# ==========================================

@app.route('/')
def home():
    return render_template('index.html')


@app.route('/api/items', methods=['GET'])
def get_items():
    conn = sqlite3.connect(DB_FILE)
    cursor = conn.cursor()
    cursor.execute("SELECT id, title, media_type, status, poster_url FROM media_shelf ORDER BY id ASC")
    rows = cursor.fetchall()
    conn.close()

    items = [{"id": r[0], "title": r[1], "media_type": r[2], "status": r[3], "poster_url": r[4]} for r in rows]
    return jsonify(items)


@app.route('/api/items', methods=['POST'])
def add_item():
    data = request.get_json()
    title = data.get('title')
    media_type = data.get('media_type')

    if not title or not media_type:
        return jsonify({"error": "Missing fields"}), 400

    poster_url = None 
    print(f"--- Searching for {media_type}: {title} ---") # Terminal feedback!
    
    try:
        if media_type == 'Movie':
            omdb_response = requests.get(f"http://www.omdbapi.com/?t={title}&apikey={OMDB_API_KEY}")
            omdb_data = omdb_response.json()
            if omdb_data.get("Response") == "True" and omdb_data.get("Poster") != "N/A":
                poster_url = omdb_data.get("Poster")
                
        elif media_type == 'Book':
            safe_title = title.replace(" ", "+")
            # Switching to OpenLibrary API (Friendly to Python!)
            ol_response = requests.get(f"https://openlibrary.org/search.json?title={safe_title}")
            ol_data = ol_response.json()
            
            if "docs" in ol_data:
                for doc in ol_data["docs"]:
                    if "cover_i" in doc: # Look for a valid cover ID
                        cover_id = doc["cover_i"]
                        poster_url = f"https://covers.openlibrary.org/b/id/{cover_id}-M.jpg"
                        break 
                        
        # Print the result to the terminal so we can see what happened
        if poster_url:
            print(f"Success! Found image link: {poster_url}")
        else:
            print("Failed: Could not find an image for this title.")
                        
    except Exception as e:
        print(f"Error fetching {media_type} poster:", e)

    # Save to SQLite
    conn = sqlite3.connect(DB_FILE)
    cursor = conn.cursor()
    cursor.execute("INSERT INTO media_shelf (title, media_type, poster_url) VALUES (?, ?, ?)", (title, media_type, poster_url))
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


# ==========================================
# LOCAL HOSTING
# ==========================================
if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000, debug=True)