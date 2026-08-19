const { randomUUID } = require('crypto');

/**
 * Local, in-memory table adapter used when the app is NOT running inside
 * Catalyst (i.e. `req.catalystApp` is null during local development). It
 * mirrors the shape of the Catalyst adapter below so controllers never need
 * to know which backend they're talking to.
 */
const memory = {
  users: new Map(),
  projects: new Map(),
  tickets: new Map(),
};

function nowISO() {
  return new Date().toISOString();
}

function localTable(name) {
  return {
    async insert(row) {
      const id = randomUUID();
      const record = { ROWID: id, CREATEDTIME: nowISO(), ...row };
      memory[name].set(id, record);
      return record;
    },
    async update(id, patch) {
      const existing = memory[name].get(id);
      if (!existing) return null;
      const updated = { ...existing, ...patch, MODIFIEDTIME: nowISO() };
      memory[name].set(id, updated);
      return updated;
    },
    async getById(id) {
      return memory[name].get(id) || null;
    },
    async find(predicate) {
      return Array.from(memory[name].values()).filter(predicate);
    },
    async remove(id) {
      return memory[name].delete(id);
    },
  };
}

/**
 * Real adapter backed by Zoho Catalyst Data Store. Reads go through ZCQL,
 * writes go through the Datastore row APIs, per the zcatalyst-sdk-node docs.
 */
function catalystTable(catalystApp, tableName) {
  const table = catalystApp.datastore().table(tableName);

  return {
    async insert(row) {
      return table.insertRow(row);
    },
    async update(id, patch) {
      return table.updateRow({ ROWID: id, ...patch });
    },
    async getById(id) {
      return table.getRow(id);
    },
    async find(predicate, zcqlWhere) {
      const zcql = catalystApp.zcql();
      const query = `SELECT * FROM ${tableName}${zcqlWhere ? ` WHERE ${zcqlWhere}` : ''}`;
      const rows = await zcql.executeZCQLQuery(query);
      return rows.map((r) => r[tableName]).filter(predicate || (() => true));
    },
    async remove(id) {
      return table.deleteRow(id);
    },
  };
}

function getTable(req, tableName) {
  if (req.catalystApp) {
    return catalystTable(req.catalystApp, tableName);
  }
  return localTable(tableName.toLowerCase());
}

module.exports = { getTable };
