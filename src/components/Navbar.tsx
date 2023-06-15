import React, { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from './AuthContext';
import './Navbar.css'
const Navbar: React.FC = () => {
  const { isAuthenticated, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  return (
    <nav className="navbar">
      <div className="navbar-container">
        {isAuthenticated ? (
          <div>
            <Link to="/" className="navbar-brand">
              Home
            </Link>
            <Link to="/dashboard" className="navbar-brand">
              Dashboard
            </Link>
          </div>
        ) : (
          <Link to="/" className="navbar-brand">
            Home
          </Link>
        )}

        {isAuthenticated ? (
          <button onClick={logout} className="navbar-button">
            Logout
          </button>
        ) : (
          <Link to="/login" className="navbar-button">
            Login
          </Link>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
