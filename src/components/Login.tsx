import React, { useContext, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from './AuthContext';
import './Login.css';

const Login: React.FC = () => {
  const navigate = useNavigate();
  const { login } = useContext(AuthContext);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = () => {
    // Send login request to the server
    axios
      .post('http://127.0.0.1:8000/api/login', {
        username,
        password,
      })
      .then((response) => {
        // Handle successful login
        login(username, password);
        localStorage.setItem('token', response.data.token);

        // Clear input fields
        setUsername('');
        setPassword('');

        // Redirect to protected route
        navigate('/');
      })
      .catch((error) => {
        // Handle login error
        console.error('Login failed:', error);
      });
  };

  const handleRegister = () => {
    // Redirect to register page
    navigate('/register');
  };

  return (
    <div className="container">
      <div className="card">
        {/* Login form */}
        <input
          type="text"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          className="input-field"
        />
        <br />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="input-field"
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              handleLogin();
            }
          }}
        />
        <br />
        <button onClick={handleLogin} className="login-button">
          Log In
        </button>
        <button onClick={handleRegister} className="register-button">
          Sign up
        </button>
      </div>
    </div>
  );
};

export default Login;
