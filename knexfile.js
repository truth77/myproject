require('dotenv').config();

module.exports = {
  development: {
    client: 'postgresql',
    connection: {
      host: 'localhost',
      port: 5432,
      database: 'bible',
      user: 'postgres',
      password: 'postgres',
      ssl: false,
      connectionTimeoutMillis: 10000,
      idleTimeoutMillis: 30000
    },
    migrations: {
      directory: './migrations',
      tableName: 'knex_migrations',
      disableTransactions: false
    },
    seeds: {
      directory: './seeds'
    },
    pool: {
      min: 1,
      max: 5,
      acquireTimeoutMillis: 30000,
      createRetryIntervalMillis: 100,
      createTimeoutMillis: 30000,
      idleTimeoutMillis: 60000,
      reapIntervalMillis: 1000,
      createRetryIntervalMillis: 100,
      propagateCreateError: true
    },
    debug: true,
    asyncStackTraces: true
  },
  
  production: {
    client: 'postgresql',
    connection: process.env.DATABASE_URL || {
      host: process.env.DB_HOST || 'localhost',
      port: process.env.DB_PORT || 5432,
      database: process.env.DB_NAME || 'bible',
      user: process.env.DB_USER || 'postgres',
      password: process.env.DB_PASSWORD || 'postgres',
      ssl: process.env.DB_SSL ? { rejectUnauthorized: false } : false
    },
    migrations: {
      directory: './migrations',
      tableName: 'knex_migrations'
    },
    pool: {
      min: 2,
      max: 10
    }
  }
};