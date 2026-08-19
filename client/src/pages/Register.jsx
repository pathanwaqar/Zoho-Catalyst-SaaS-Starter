import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { api } from '../api/client.js';
import { useAuth } from '../context/AuthContext.jsx';

export default function Register() {
  const [form, setForm] = useState({ name: '', email: '', password: '', organization: '' });
  const [error, setError] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();

  const update = (field) => (e) => setForm({ ...form, [field]: e.target.value });

  const submit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      const data = await api.register(form);
      login(data.token, data.user);
      navigate('/dashboard');
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="auth-page">
      <form onSubmit={submit} className="auth-form">
        <h2>Create your workspace</h2>
        {error && <p className="error">{error}</p>}
        <input placeholder="Full name" value={form.name} onChange={update('name')} required />
        <input placeholder="Organization" value={form.organization} onChange={update('organization')} required />
        <input type="email" placeholder="Email" value={form.email} onChange={update('email')} required />
        <input
          type="password"
          placeholder="Password"
          value={form.password}
          onChange={update('password')}
          required
        />
        <button type="submit">Register</button>
        <p>Already have an account? <Link to="/login">Log in</Link></p>
      </form>
    </div>
  );
}
