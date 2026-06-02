import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

function Profile() {
  const [items, setItems] = useState([]);
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const navigate = useNavigate();
  
  const user = JSON.parse(localStorage.getItem('user'));

  useEffect(() => {
    if (!user) {
      navigate('/login');
    } else {
      fetchUserItems();
    }
  }, []);

  const fetchUserItems = async () => {
    try {
      const response = await fetch(`http://127.0.0.1:5000/api/items?user_id=${user.id}`);
      const data = await response.json();
      setItems(data);
    } catch (error) {
      console.error("Error fetching items", error);
    }
  };

  const handlePasswordChange = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('http://127.0.0.1:5000/api/change-password', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          user_id: user.id, 
          current_password: currentPassword, 
          new_password: newPassword 
        })
      });

      const data = await response.json();
      
      if (response.ok) {
        alert("Password updated successfully!");
        setCurrentPassword('');
        setNewPassword('');
      } else {
        alert(data.error);
      }
    } catch (error) {
      alert("Server error. Please try again.");
    }
  };

  // Calculate Stats
  const totalMovies = items.filter(i => i.media_type === 'Movie').length;
  const totalBooks = items.filter(i => i.media_type === 'Book').length;

  return (
    <div className="dashboard-wrapper">
      <div className="dashboard-card profile-card">
        
        {/* Header */}
        <div className="dashboard-header">
          <h2>Hello, {user?.username}! 👋</h2>
          <button className="add-btn" onClick={() => navigate('/dashboard')}>
            ➔ Back to Dashboard
          </button>
        </div>

        {/* Stats Section */}
        <div className="profile-stats">
          <div className="stat-box">
            <span className="stat-icon">🎬</span>
            <h3>{totalMovies}</h3>
            <p>Movies Saved</p>
          </div>
          <div className="stat-box">
            <span className="stat-icon">📚</span>
            <h3>{totalBooks}</h3>
            <p>Books Saved</p>
          </div>
        </div>

        <div className="divider"></div>

        {/* Password Change Section */}
        <div className="password-section">
          <h3>Security Settings</h3>
          <form onSubmit={handlePasswordChange} className="password-form">
            <input 
              type="password" 
              placeholder="Current Password" 
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              required
            />
            <input 
              type="password" 
              placeholder="New Password" 
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              required
            />
            <button type="submit" className="add-btn">Update Password</button>
          </form>
        </div>

      </div>
    </div>
  );
}

export default Profile;