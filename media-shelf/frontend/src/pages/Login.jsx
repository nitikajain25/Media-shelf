import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isRegistering, setIsRegistering] = useState(false); // Toggles between Login and Signup
  const navigate = useNavigate();

  const handleAuth = async (e) => {
    e.preventDefault();
    
    // 1. Choose the right Python route based on what the user is doing
    const endpoint = isRegistering ? '/api/register' : '/api/login';
    
    try {
      const response = await fetch(`http://127.0.0.1:5000${endpoint}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username: email, password: password })
      });

      const data = await response.json();

      if (response.ok) {
        if (isRegistering) {
          alert("Account created successfully! You can now log in.");
          setIsRegistering(false); // Switch back to login mode
          setPassword(''); // Clear password for safety
        } else {
          // LOGIN SUCCESS! Save the user info to the browser's memory
          localStorage.setItem('user', JSON.stringify(data.user));
          navigate('/dashboard'); 
        }
      } else {
        // Show the error from Python (e.g., "Invalid password" or "Username taken")
        alert(data.error || "Something went wrong!");
      }
    } catch (error) {
      alert("Could not connect to the server. Is Python running?");
    }
  };

  return (
    <div className="login-wrapper">
      <img 
        src="/logo.png" 
        alt="Media Shelf" 
        className="login-logo" 
        onClick={() => navigate('/')} 
      />

      <div className="login-card">
        {/* Dynamic Title based on mode */}
        <h2>{isRegistering ? "Create Account" : "Sign In"}</h2>
        <p className="login-subtitle">
          {isRegistering ? "Start curating your digital library" : "Access your media shelf dashboard"}
        </p>

       <button className="google-btn" type="button">
          {/* Replaced the broken img tag with a bulletproof inline SVG */}
          <svg width="18" height="18" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
            <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
            <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
            <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
          </svg>
          Continue with Google
        </button>

        <div className="divider">
          <span>Or continue with email</span>
        </div>

        <form onSubmit={handleAuth}>
          <div className="input-group">
            <label>Email / Username</label>
            <div className="input-with-icon">
              <span className="icon">✉️</span>
              <input 
                type="text" 
                placeholder="hello@example.com" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required 
              />
            </div>
          </div>

          <div className="input-group">
            <label>Password</label>
            <div className="input-with-icon">
              <span className="icon">🔒</span>
              <input 
                type="password" 
                placeholder="••••••••" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required 
              />
            </div>
          </div>

          <button type="submit" className="login-submit-btn">
            {isRegistering ? "Sign Up ➔" : "Sign In ➔"}
          </button>
        </form>
        
        <p className="signup-link">
          {isRegistering ? "Already have an account? " : "Don't have an account? "}
          <span onClick={() => setIsRegistering(!isRegistering)}>
            {isRegistering ? "Log in" : "Sign up"}
          </span>
        </p>
      </div>
    </div>
  );
}

export default Login;