import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './Register.css'; // Import the CSS file

const Register: React.FC = () => {
  const navigate = useNavigate();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleRegister = () => {
    // Send register request to the server
    axios
      .post('http://127.0.0.1:8000/api/register', {
        username,
        password,
      })
      .then((response) => {
        // Handle successful registration

        // Redirect to login page
        console.log(response);
        navigate('/login');
      })
      .catch((error) => {
        // Handle registration error
        console.error('Registration failed:', error);
      });
  };

  return (
    <div className="register-container">
      {/* Registration form */}
      <input
        type="text"
        placeholder="Username"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
        className="register-input"
      />
      <br />
      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        className="register-input"
      />
      <br />
      <button onClick={handleRegister} className="register-button">
        Register
      </button>
    </div>
  );
};

export default Register;
