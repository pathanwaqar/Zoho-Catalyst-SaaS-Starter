import React from 'react';

const STATUSES = ['open', 'in_progress', 'resolved', 'closed'];

export default function TicketCard({ ticket, onStatusChange }) {
  return (
    <div className={`ticket-card priority-${ticket.priority}`}>
      <div className="ticket-header">
        <h4>{ticket.title}</h4>
        <span className="badge">{ticket.priority}</span>
      </div>
      {ticket.description && <p>{ticket.description}</p>}
      <select value={ticket.status} onChange={(e) => onStatusChange(ticket.ROWID, e.target.value)}>
        {STATUSES.map((s) => (
          <option key={s} value={s}>{s.replace('_', ' ')}</option>
        ))}
      </select>
    </div>
  );
}
