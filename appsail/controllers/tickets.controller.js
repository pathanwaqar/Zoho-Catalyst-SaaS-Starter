const { getTable } = require('../services/dataStore');
const { publishTicketEvent } = require('../services/ticketEvents.service');

async function listTickets(req, res, next) {
  try {
    const { projectId } = req.params;
    const tickets = getTable(req, 'Tickets');
    const rows = await tickets.find((t) => t.projectId === projectId);
    res.json({ success: true, tickets: rows });
  } catch (err) {
    next(err);
  }
}

async function createTicket(req, res, next) {
  try {
    const { projectId } = req.params;
    const { title, description, priority } = req.body;
    if (!title) return res.status(400).json({ success: false, error: 'title is required' });

    const tickets = getTable(req, 'Tickets');
    const ticket = await tickets.insert({
      projectId,
      title,
      description: description || '',
      priority: priority || 'normal',
      status: 'open',
      organization: req.user.organization,
      createdBy: req.user.sub,
    });

    await publishTicketEvent(req, 'ticket.created', ticket);

    res.status(201).json({ success: true, ticket });
  } catch (err) {
    next(err);
  }
}

async function updateTicketStatus(req, res, next) {
  try {
    const { ticketId } = req.params;
    const { status } = req.body;
    const allowed = ['open', 'in_progress', 'resolved', 'closed'];
    if (!allowed.includes(status)) {
      return res.status(400).json({ success: false, error: `status must be one of ${allowed.join(', ')}` });
    }

    const tickets = getTable(req, 'Tickets');
    const ticket = await tickets.update(ticketId, { status });
    if (!ticket) return res.status(404).json({ success: false, error: 'Ticket not found' });

    await publishTicketEvent(req, 'ticket.status_changed', ticket);

    res.json({ success: true, ticket });
  } catch (err) {
    next(err);
  }
}

module.exports = { listTickets, createTicket, updateTicketStatus };
