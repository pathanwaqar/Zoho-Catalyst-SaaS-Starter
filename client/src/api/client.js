const BASE_URL = import.meta.env.VITE_API_BASE_URL || '/api';

async function request(path, { method = 'GET', body, token } = {}) {
  const res = await fetch(`${BASE_URL}${path}`, {
    method,
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    body: body ? JSON.stringify(body) : undefined,
  });

  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    throw new Error(data.error || `Request failed with status ${res.status}`);
  }
  return data;
}

export const api = {
  register: (payload) => request('/auth/register', { method: 'POST', body: payload }),
  login: (payload) => request('/auth/login', { method: 'POST', body: payload }),
  listProjects: (token) => request('/projects', { token }),
  createProject: (payload, token) => request('/projects', { method: 'POST', body: payload, token }),
  listTickets: (projectId, token) => request(`/projects/${projectId}/tickets`, { token }),
  createTicket: (projectId, payload, token) =>
    request(`/projects/${projectId}/tickets`, { method: 'POST', body: payload, token }),
  updateTicketStatus: (ticketId, status, token) =>
    request(`/tickets/${ticketId}/status`, { method: 'PATCH', body: { status }, token }),
};
