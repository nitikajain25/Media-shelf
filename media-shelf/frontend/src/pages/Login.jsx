import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function Login() {
  const [isLogin, setIsLogin] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleAuth = async (e) => {
    e.preventDefault();
    const endpoint = isLogin ? '/api/login' : '/api/signup';
    
    try {
      // 🛑 STOP! Replace the link below with YOUR actual Render URL!
      const renderURL = 'https://media-shelf.onrender.com'; 
      
      const response = await fetch(`${renderURL}${endpoint}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password })
      });

      const data = await response.json();

      if (response.ok) {
        if (isLogin) {
          localStorage.setItem('user', JSON.stringify(data.user));
          navigate('/dashboard');
        } else {
          // NEW: Now we save the full data.user so React has the ID!
          localStorage.setItem('user', JSON.stringify(data.user)); 
          navigate('/dashboard');
        }
      } else {
        alert(data.error);
      }
    } catch (error) {
      alert("Server error. The server might be waking up, please wait 30 seconds and try again!");
    }
  };

  return (
    <div className="dashboard-wrapper">
      {/* Your original, beautiful card layout is restored here! */}
      <div className="dashboard-card profile-card" style={{ maxWidth: '400px', margin: '80px auto', padding: '40px' }}>
        
        <div style={{ textAlign: 'center', marginBottom: '30px' }}>
          <h2 style={{ fontSize: '28px', color: '#111827', marginBottom: '10px' }}>
            {isLogin ? 'Sign In' : 'Create Account'}
          </h2>
          <p style={{ color: '#6b7280', fontSize: '15px' }}>
            {isLogin ? 'Access your media shelf dashboard' : 'Start curating your digital library'}
          </p>
        </div>

        {/* The Google Button Placeholder */}
        <button style={{ width: '100%', padding: '12px', borderRadius: '12px', border: '1px solid #e5e7eb', background: '#fff', color: '#374151', fontWeight: '600', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px', marginBottom: '20px', cursor: 'not-allowed', opacity: '0.7' }}>
          <span style={{ color: '#ea4335', fontWeight: 'bold' }}>G</span> Continue with Google
        </button>

        <div style={{ display: 'flex', alignItems: 'center', gap: '15px', margin: '20px 0', color: '#9ca3af', fontSize: '14px' }}>
          <div style={{ flex: 1, height: '1px', background: '#e5e7eb' }}></div>
          <span>Or continue with email</span>
          <div style={{ flex: 1, height: '1px', background: '#e5e7eb' }}></div>
        </div>
        
        <form onSubmit={handleAuth} className="password-form">
          <div style={{ textAlign: 'left', marginBottom: '5px', fontSize: '14px', fontWeight: '600', color: '#374151' }}>Email / Username</div>
          <input 
            type="text" 
            placeholder="nitikaj582@gmail.com" 
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
            style={{ width: '100%', padding: '12px', borderRadius: '12px', border: '1px solid #e5e7eb', background: '#f9fafb', marginBottom: '15px' }}
          />

          <div style={{ textAlign: 'left', marginBottom: '5px', fontSize: '14px', fontWeight: '600', color: '#374151' }}>Password</div>
          <input 
            type="password" 
            placeholder="••••••••" 
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            style={{ width: '100%', padding: '12px', borderRadius: '12px', border: '1px solid #e5e7eb', background: '#f9fafb', marginBottom: '25px' }}
          />
          
          <button type="submit" className="add-btn" style={{ width: '100%', padding: '14px', fontSize: '16px' }}>
            {isLogin ? 'Sign In ➔' : 'Sign Up ➔'}
          </button>
        </form>

        <div 
          style={{ textAlign: 'center', marginTop: '25px', color: '#6b7280', fontSize: '14px' }} 
        >
          {isLogin ? "Don't have an account? " : "Already have an account? "}
          <span 
            onClick={() => setIsLogin(!isLogin)}
            style={{ color: '#111827', fontWeight: 'bold', cursor: 'pointer' }}
          >
            {isLogin ? "Sign up" : "Log in"}
          </span>
        </div>

      </div>
    </div>
  );
}

export default Login;