import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Brain, Lock, User, AlertCircle } from 'lucide-react';
import './Login.css';

const Login = ({ setAuthRole }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password })
      });

      if (!response.ok) {
        throw new Error("Invalid username or password");
      }

      const data = await response.json();
      localStorage.setItem("userRole", data.role);
      localStorage.setItem("authToken", data.token);
      setAuthRole(data.role);

      if (data.role === 'manager') {
        navigate('/dashboard');
      } else {
        navigate('/application');
      }
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="login-container">
      <div className="login-box">
        <div className="login-header">
          <Brain size={40} className="login-icon" />
          <h2>AI Loan Approval System</h2>
          <p>Login to access your dashboard</p>
        </div>
        
        {error && (
          <div className="login-error">
            <AlertCircle size={16} />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleLogin} className="login-form">
          <div className="input-group">
            <User size={18} className="input-icon" />
            <input 
              type="text" 
              placeholder="Username (manager / applicant)" 
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required 
            />
          </div>
          <div className="input-group">
            <Lock size={18} className="input-icon" />
            <input 
              type="password" 
              placeholder="Password (password)" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required 
            />
          </div>
          <button type="submit" className="login-btn">Secure Login</button>
        </form>
        
        <div className="login-hints">
          <small>Manager: <code>manager</code> / <code>password</code></small>
          <small>Applicant: <code>applicant</code> / <code>password</code></small>
        </div>
      </div>
    </div>
  );
};

export default Login;
