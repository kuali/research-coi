let mysql = require('mysql');
const POOL_SIZE = 70;
const DB_NAME = 'coi';

try {
  let extensions = require('research-extensions');
  mysql = extensions.mysql(mysql);
} catch (e) {}

class _ConnectionManager {
  constructor() {
    this.pool = mysql.createPool({
      connectionLimit: POOL_SIZE,
      host: 'localhost',
      user: 'root',
      password: '',
      database: 'coi'
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

export let ConnectionManager = new _ConnectionManager()