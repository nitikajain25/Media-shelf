# 📚🎬 Media Shelf

**Live Demo:** https://media-shelf-lrtj.vercel.app/

Media Shelf is a full-stack, mobile-responsive web application designed to help users beautifully curate and track their digital library. Whether it is keeping track of the movies you want to watch or the books you have finished reading, Media Shelf organizes your media in one clean, intuitive space.

---

## ✨ Features

* **Secure Authentication:** Full user signup and login system with encrypted password hashing.
* **Personalized Dashboard:** Add, track, and manage your "Up Next" and "Completed" movies and books.
* **Profile & Stats:** A dedicated user profile page that automatically calculates and displays your reading vs. watching statistics.
* **Secure Account Management:** Users can securely update and change their passwords.
* **Fully Responsive:** Custom CSS ensures the UI snaps perfectly to mobile screens, tablets, and desktop displays.

---

## 🛠️ Tech Stack

**Frontend (The UI)**
* React.js
* Custom CSS (Mobile-First approach)
* Hosted on **Vercel**

**Backend (The API)**
* Python / Flask
* Hosted on **Render**

**Database**
* SQLite (Stores users, passwords, and media items)

---

## 🚀 Running the Project Locally

If you would like to run this project on your local machine, follow these steps:

### 1. Clone the Repository
```bash
git clone [https://github.com/nitikajain25/media-shelf.git](https://github.com/nitikajain25/media-shelf.git)
cd media-shelf
```

### 2. Set Up the Python Backend
Open a terminal in the main `media-shelf` folder:
```bash
# Install the required Python libraries
pip install -r requirements.txt

# Start the Flask server
python app.py
```
*The backend will now be running on `http://127.0.0.1:5000`*

### 3. Set Up the React Frontend
Open a *second* terminal, navigate to the frontend folder, and start React:
```bash
cd frontend
npm install
npm start
```
*The frontend will automatically open in your browser at `http://localhost:3000`*

---

## 🔮 Future Roadmap

* **OAuth Integration:** Add "Sign in with Google" functionality.
* **API Fetching:** Integrate the OMDB or Google Books API to automatically pull in cover art and summaries when a user types a title.
* **Social Sharing:** Allow users to share their "Completed" shelf with friends.

---
*Designed and built by Nitika Jain*
