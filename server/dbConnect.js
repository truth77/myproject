require('dotenv').config();

const knex = require('knex');

const connection = {
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false
};

const config = {
  client: 'pg',
  connection,
  pool: {
    min: 2,
    max: 10
  },
  migrations: {
    tableName: 'knex_migrations'
  }
};

module.exports = knex(config);