module.exports = {
  development: {
    client: 'pg',
    connection: {
      host: 'postgres',
      user: 'postgres',
      password: 'postgres',
      database: 'bible'
    },
    migrations: {
      directory: './migrations'
    },
    seeds: {
      directory: './seeds'
    }
  }
};
