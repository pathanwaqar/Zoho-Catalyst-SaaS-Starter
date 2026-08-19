const catalystSDK = require('zcatalyst-sdk-node');

/**
 * Subscribed to the `ticket.created` and `ticket.status_changed` Signals
 * published by the AppSail API (see appsail/services/ticketEvents.service.js).
 */
module.exports = async (event, context) => {
  const catalystApp = catalystSDK.initialize(context);
  const { signal_name: signalName, signal_data: ticket } = event;

  console.log(`Received signal "${signalName}" for ticket ${ticket.ROWID}`);

  if (signalName === 'ticket.created') {
    await notify(ticket, 'A new ticket was created');
  }

  if (signalName === 'ticket.status_changed') {
    await notify(ticket, `Ticket status changed to "${ticket.status}"`);
  }

  context.closeWithSuccess();
};

async function notify(ticket, message) {
  // Wire this up to Zoho Cliq / email / Slack in production. Kept as a
  // log line here so the flow is observable without external credentials.
  console.log(`[notify] ${message}: "${ticket.title}" (project ${ticket.projectId})`);
}
