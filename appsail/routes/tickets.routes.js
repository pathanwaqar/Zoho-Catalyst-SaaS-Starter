const express = require('express');
const { requireAuth } = require('../middleware/authMiddleware');
const {
  listTickets,
  createTicket,
  updateTicketStatus,
} = require('../controllers/tickets.controller');

const router = express.Router();

router.use(requireAuth);
router.get('/projects/:projectId/tickets', listTickets);
router.post('/projects/:projectId/tickets', createTicket);
router.patch('/tickets/:ticketId/status', updateTicketStatus);

module.exports = router;
