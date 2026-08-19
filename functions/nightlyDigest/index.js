const catalystSDK = require('zcatalyst-sdk-node');

/**
 * Runs nightly (see catalyst-config.json's cron schedule) and emails each
 * organization a summary of its still-open tickets.
 */
module.exports = async (event, context) => {
  const catalystApp = catalystSDK.initialize(context);
  const zcql = catalystApp.zcql();

  const rows = await zcql.executeZCQLQuery("SELECT * FROM Tickets WHERE status != 'closed'");
  const openTickets = rows.map((r) => r.Tickets);
  const grouped = groupByOrganization(openTickets);

  for (const [organization, tickets] of Object.entries(grouped)) {
    await sendDigestEmail(organization, tickets);
  }

  context.closeWithSuccess();
};

function groupByOrganization(tickets) {
  return tickets.reduce((acc, ticket) => {
    (acc[ticket.organization] = acc[ticket.organization] || []).push(ticket);
    return acc;
  }, {});
}

async function sendDigestEmail(organization, tickets) {
  // Wire this up to Zoho Catalyst's Email service (or an external provider)
  // in production. Logged here so the job's output stays verifiable in Logs.
  console.log(`[digest] ${organization}: ${tickets.length} open ticket(s)`);
  tickets.forEach((t) => console.log(`  - [${t.priority}] ${t.title} (${t.status})`));
}
