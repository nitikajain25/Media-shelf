import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function Login() {
  // Changed to false so "Sign Up" is the default screen for new users
  const [isLogin, setIsLogin] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleAuth = async (e) => {
    e.preventDefault();
    const endpoint = isLogin ? '/api/login' : '/api/signup';
    
    try {
      // REPLACE THIS URL WITH YOUR ACTUAL RENDER URL
      const response = await fetch(`https://media-shelf.onrender.com${endpoint}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password })
      });

      const data = await response.json();

      if (response.ok) {
        if (isLogin) {
          // Standard Sign In Success
          localStorage.setItem('user', JSON.stringify(data.user));
          navigate('/dashboard');
        } else {
          // Sign Up Success -> Auto-Login Fix
          // Automatically log them in by saving their session without making them type it again
          localStorage.setItem('user', JSON.stringify({ username: username })); 
          navigate('/dashboard');
        }
      } else {
        // Show the specific smart error from our Python backend
        alert(data.error);
      }
    } catch (error) {
      alert("Server error. Please try again later.");
    }
  };

  return (
    <div className="dashboard-wrapper">
      <div className="dashboard-card profile-card" style={{ maxWidth: '400px', margin: '100px auto' }}>
        <div className="dashboard-header" style={{ justifyContent: 'center' }}>
          <h2>{isLogin ? 'Sign In' : 'Create Account'}</h2>
        </div>
        
        <form onSubmit={handleAuth} className="password-form">
          <input 
            type="text" 
            placeholder="Email / Username" 
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
          <input 
            type="password" 
            placeholder="Password" 
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <button type="submit" className="add-btn">
            {isLogin ? 'Sign In ➔' : 'Sign Up ➔'}
          </button>
        </form>

        <div 
          style={{ textAlign: 'center', marginTop: '20px', cursor: 'pointer', color: '#6b7280', fontWeight: '600' }} 
          onClick={() => setIsLogin(!isLogin)}
        >
          {isLogin ? "Don't have an account? Sign up" : "Already have an account? Log in"}
        </div>
      </div>
    </div>
  );
}

export default Login;