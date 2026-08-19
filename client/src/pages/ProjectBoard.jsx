import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { api } from '../api/client.js';
import { useAuth } from '../context/AuthContext.jsx';
import Navbar from '../components/Navbar.jsx';
import TicketCard from '../components/TicketCard.jsx';
import NewTicketModal from '../components/NewTicketModal.jsx';

export default function ProjectBoard() {
  const { projectId } = useParams();
  const { token } = useAuth();
  const [tickets, setTickets] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [error, setError] = useState('');

  const loadTickets = () => {
    api
      .listTickets(projectId, token)
      .then((data) => setTickets(data.tickets))
      .catch((err) => setError(err.message));
  };

  useEffect(loadTickets, [projectId, token]);

  const createTicket = async (payload) => {
    try {
      await api.createTicket(projectId, payload, token);
      setShowModal(false);
      loadTickets();
    } catch (err) {
      setError(err.message);
    }
  };

  const changeStatus = async (ticketId, status) => {
    try {
      await api.updateTicketStatus(ticketId, status, token);
      loadTickets();
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <>
      <Navbar />
      <div className="page">
        <div className="page-header">
          <h2>Tickets</h2>
          <button onClick={() => setShowModal(true)}>New ticket</button>
        </div>
        {error && <p className="error">{error}</p>}
        <div className="ticket-grid">
          {tickets.map((t) => (
            <TicketCard key={t.ROWID} ticket={t} onStatusChange={changeStatus} />
          ))}
        </div>
        {showModal && <NewTicketModal onClose={() => setShowModal(false)} onCreate={createTicket} />}
      </div>
    </>
  );
}
