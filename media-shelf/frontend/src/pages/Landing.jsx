import React from 'react';
import { useNavigate } from 'react-router-dom';

function Landing() {
  const navigate = useNavigate();

  return (
    <div className="landing-wrapper">
      {/* Floating Navbar */}
      {/* Floating Navbar */}
      <nav className="top-nav">
        <div className="nav-brand">
          <img src="/logo.png" alt="Media Shelf" className="nav-logo-img" />
          {/* NEW: The text heading next to the logo */}
          <span className="brand-text">Media Shelf</span>
        </div>
        <div className="nav-links">
          <a href="#features">Features</a>
          <a href="#about">About</a>
        </div>
        <button className="nav-sign-in" onClick={() => navigate('/login')}>
          Sign In
        </button>
      </nav>

      {/* Hero Section */}
      <section className="hero-section">
        <div className="hero-glass-panel">
          <h1 className="hero-title">Curate Your <br/>Digital Library</h1>
          <p className="hero-subtitle">
            Experience the most aesthetic way to track your media. Seamlessly log the movies you watch and the books you read in one beautifully organized space.
          </p>
          <button className="btn-primary" onClick={() => navigate('/login')}>
            Start Your Shelf ➔
          </button>
        </div>
      </section>

      {/* NEW: Features Section */}
      <section id="features" className="features-section">
        <h2 className="section-title">Why Media Shelf?</h2>
        <div className="features-grid">
          <div className="feature-card">
            <span className="feature-icon">📚</span>
            <h3>All in One Place</h3>
            <p>Keep track of every movie you watch and every book you read in a single, unified dashboard.</p>
          </div>
          <div className="feature-card">
            <span className="feature-icon">✨</span>
            <h3>Auto-Fetch Posters</h3>
            <p>Just type the title, and we automatically fetch high-quality covers for your digital shelf.</p>
          </div>
          <div className="feature-card">
            <span className="feature-icon">🔒</span>
            <h3>Private & Secure</h3>
            <p>Your library is tied exclusively to your account, ensuring your curated shelf remains yours alone.</p>
          </div>
        </div>
      </section>

      {/* NEW: About Section */}
      <section id="about" className="about-section">
        <div className="about-glass-panel">
          <h2 className="section-title">About the Project</h2>
          <p className="about-text">
            Media Shelf was born out of a simple need: a beautiful, distraction-free space to track digital consumption. Whether you are a cinephile logging your daily films or an avid reader tracking your yearly goals, this platform is designed to make curation a joy rather than a chore.
          </p>
        </div>
      </section>

      {/* Minimal Footer */}
      <footer className="landing-footer">
        <div className="footer-bottom">
          <p>© 2026 Media Shelf. All rights reserved.</p>
          <p className="crafted-by">Crafted by: <strong>Nitika</strong></p>
        </div>
      </footer>
    </div>
  );
}

export default Landing;