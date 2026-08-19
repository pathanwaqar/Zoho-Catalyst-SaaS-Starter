import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../api/client.js';
import { useAuth } from '../context/AuthContext.jsx';
import Navbar from '../components/Navbar.jsx';

export default function Dashboard() {
  const { token } = useAuth();
  const [projects, setProjects] = useState([]);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    api
      .listProjects(token)
      .then((data) => setProjects(data.projects))
      .catch((err) => setError(err.message));
  }, [token]);

  const createProject = async (e) => {
    e.preventDefault();
    try {
      const data = await api.createProject({ name, description }, token);
      setProjects([...projects, data.project]);
      setName('');
      setDescription('');
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <>
      <Navbar />
      <div className="page">
        <h2>Projects</h2>
        {error && <p className="error">{error}</p>}
        <form onSubmit={createProject} className="inline-form">
          <input placeholder="Project name" value={name} onChange={(e) => setName(e.target.value)} required />
          <input placeholder="Description" value={description} onChange={(e) => setDescription(e.target.value)} />
          <button type="submit">Add project</button>
        </form>
        <div className="project-grid">
          {projects.map((p) => (
            <Link key={p.ROWID} to={`/projects/${p.ROWID}`} className="project-card">
              <h3>{p.name}</h3>
              <p>{p.description}</p>
            </Link>
          ))}
        </div>
      </div>
    </>
  );
}
