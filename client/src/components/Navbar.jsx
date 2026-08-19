import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  return (
    <nav className="navbar">
      <Link to="/" className="brand">Catalyst SaaS Starter</Link>
      {user && (
        <div className="navbar-right">
          <span>{user.name} · {user.organization}</span>
          <button onClick={() => { logout(); navigate('/login'); }}>Log out</button>
        </div>
      )}
    </nav>
  );
}
