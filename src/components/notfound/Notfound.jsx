import React from 'react';
import { Link } from 'react-router-dom';
import './notfound.scss';

export default function NotFound() {
  return (
    <div className="notfound-container">
      <h1>404</h1>
      <h2>Oops! Page Not Found</h2>
      <p>The page you are looking for might have been removed, had its name changed, or is temporarily unavailable.</p>
      <Link to="/categories" className="home-link">Go Back to Home</Link>
    </div>
  );
}