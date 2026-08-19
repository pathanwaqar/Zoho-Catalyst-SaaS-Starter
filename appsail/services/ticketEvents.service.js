const { EventEmitter } = require('events');

// Used only for local development, so the demo is observable without a
// live Catalyst Signals subscriber wired up.
const localBus = new EventEmitter();

/**
 * Publishes a ticket lifecycle event. On Catalyst this fires a Signal that
 * the `ticketNotifier` Function subscribes to; locally it just emits on an
 * in-process EventEmitter and logs, so behavior is visible without deploying.
 */
async function publishTicketEvent(req, signalName, payload) {
  if (req.catalystApp) {
    const signal = req.catalystApp.signal();
    return signal.publish({ signal_name: signalName, signal_data: payload });
  }

  localBus.emit(signalName, payload);
  console.log(`[local-signal] ${signalName}`, payload);
}

module.exports = { publishTicketEvent, localBus };
