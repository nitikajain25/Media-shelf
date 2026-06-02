import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

function Dashboard() {
  const [items, setItems] = useState([]);
  const [title, setTitle] = useState('');
  const [type, setType] = useState('Movie');
  const navigate = useNavigate();
  
  // 1. Pull the logged-in user from the browser's memory
  const user = JSON.parse(localStorage.getItem('user'));

  useEffect(() => {
    // 2. If no user is found, kick them back to the login screen!
    if (!user) {
      navigate('/login');
    } else {
      fetchItems();
    }
  }, []);

  const fetchItems = async () => {
    try {
      // 3. Attach the user.id to the URL so Python knows whose shelf to load
      const response = await fetch(`https://media-shelf.onrender.com/api/items?user_id=${user.id}`);
      const data = await response.json();
      setItems(data);
    } catch (error) {
      console.error("Make sure Python server is running!", error);
    }
  };

  const addItem = async (e) => {
    e.preventDefault();
    await fetch('https://media-shelf.onrender.com/api/items', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      // 4. Package the real user.id along with the movie title
      body: JSON.stringify({ title, media_type: type, user_id: user.id })
    });
    setTitle('');
    fetchItems();
  };

  // ... keep the rest of your functions (completeItem, deleteItem) the exact same!
  
  const completeItem = async (id) => {
    await fetch(`https://media-shelf.onrender.com/api/items/${id}`, { method: 'PUT' });
    fetchItems(); // Refresh the list to instantly move it!
  };

  const deleteItem = async (id) => {
    if (window.confirm("Remove this from your board?")) {
      await fetch(`https://media-shelf.onrender.com/api/items/${id}`, { method: 'DELETE' });
      fetchItems();
    }
  };

  const pendingItems = items.filter(i => i.status === 'pending');
  const completedItems = items.filter(i => i.status === 'completed');

  return (
    <div className="dashboard-wrapper">
      <div className="dashboard-card">
        
       {/* Header Section */}
        <div className="dashboard-header">
          <img src="/logo.png" alt="Media Shelf" className="dashboard-logo" />
          <div className="header-actions">
            {/* NEW: Profile Button */}
            <button className="add-btn" onClick={() => navigate('/profile')} style={{marginRight: '10px'}}>Profile</button>
            <button className="sign-out-btn" onClick={() => navigate('/')}>Sign Out</button>
          </div>
        </div>

        {/* Input Form */}
        <form onSubmit={addItem} className="dashboard-form">
          <input 
            type="text" 
            value={title} 
            onChange={(e) => setTitle(e.target.value)} 
            placeholder="Add a new movie or book..." 
            required
          />
          <select value={type} onChange={(e) => setType(e.target.value)}>
            <option value="Movie">🎬 Movie</option>
            <option value="Book">📚 Book</option>
          </select>
          <button type="submit" className="add-btn">Add to Shelf</button>
        </form>

        {/* Columns */}
        <div className="dashboard-columns">
          
          <div className="column pending-col">
            <h3>Up Next <span className="count-badge">{pendingItems.length}</span></h3>
            {pendingItems.map(item => (
              <div key={item.id} className="item-card">
                <div className="item-title">
                  {item.poster_url && <img src={item.poster_url} alt="cover"/>}
                  {item.title} {item.media_type === 'Book' ? '📚' : '🎬'}
                </div>
                
                {/* Action buttons wrapped together! */}
                <div className="item-actions">
                  <button className="complete-icon" onClick={() => completeItem(item.id)}>✓</button>
                  <button className="delete-icon" onClick={() => deleteItem(item.id)}>✕</button>
                </div>

              </div>
            ))}
          </div>

          <div className="column completed-col">
            <h3>Completed <span className="count-badge">{completedItems.length}</span></h3>
            {completedItems.map(item => (
              <div key={item.id} className="item-card completed-card">
                 <div className="item-title">
                  {item.poster_url && <img src={item.poster_url} alt="cover"/>}
                  <span>{item.title} {item.media_type === 'Book' ? '📚' : '🎬'}</span>
                </div>
                <button className="delete-icon" onClick={() => deleteItem(item.id)}>✕</button>
              </div>
            ))}
          </div>

        </div>
      </div>
    </div>
  );
}

export default Dashboard;