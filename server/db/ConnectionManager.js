let mysql = require('mysql');
try {
  let extensions = require('research-extensions');
  mysql = extensions.mysql(mysql);
} catch (e) {}

class _ConnectionManager {
  constructor() {
    this.pool = mysql.createPool({
      connectionLimit: process.env.CONNECTION_POOL_SIZE || 70,
      host: process.env.DB_HOST || 'localhost',
      user: process.env.DB_USER || 'root',
      password: process.env.DB_PASSWORD || '',
      database: process.env.DB_NAME || 'coi'
    });
  }

  getConnection(callback, req) {
    this.pool.getConnection((err, connection) => {
      if (err) {
        callback(err);
      }
      else {
        callback(undefined, connection);
      }
    }, req);
  }
}

export let ConnectionManager = new _ConnectionManager();