require('dotenv').config();

module.exports = {
  development: {
    client: 'pg',
    connection: process.env.DATABASE_URL || {
      host: 'localhost',
      port: 5432,
      user: 'postgres',
      password: process.env.DB_PASSWORD || 'C00kies!!!',
      database: 'bible'
    },
    migrations: {
      directory: './migrations',
      tableName: 'knex_migrations'
    },
    seeds: {
      directory: './seeds'
    },
    pool: {
      min: 2,
      max: 10,
      idleTimeoutMillis: 10000,
      createTimeoutMillis: 30000,
      acquireTimeoutMillis: 30000
    },
    debug: process.env.NODE_ENV === 'development',
    asyncStackTraces: process.env.NODE_ENV === 'development'
  },
  
  production: {
    client: 'pg',
    connection: process.env.DATABASE_URL || {
      host: process.env.DB_HOST || 'postgres',
      port: parseInt(process.env.DB_PORT || '5432'),
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
      ssl: process.env.DB_SSL === 'true' ? { 
        rejectUnauthorized: false 
      } : false
    },
    migrations: {
      directory: './migrations',
      tableName: 'knex_migrations'
    },
    pool: {
      min: 2,
      max: 10,
      idleTimeoutMillis: 60000,
      createTimeoutMillis: 30000,
      acquireTimeoutMillis: 30000
    },
    debug: process.env.KNEX_DEBUG === 'true', 
    asyncStackTraces: process.env.KNEX_DEBUG === 'true'
  }
};