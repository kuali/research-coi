import knex from 'knex';

let knexInstance = knex({
  client: 'mysql',
  connection: {
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'coi',
    charset: 'utf8'
  },
  pool: {
    min: 0,
    max: process.env.CONNECTION_POOL_SIZE || 70
  }
});

export default dbInfo => {
  return knexInstance;
};
