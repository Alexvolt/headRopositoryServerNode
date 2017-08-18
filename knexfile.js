// Update with your config settings.
const databaseName = 'heads';//databaseName

module.exports = {


  test: {
    client: 'postgresql',
    connection: {
      database: databaseName,
      user:     'postgres',
      password: '4198b04a1e2e7684ba887796e92e0d9a'
    },
    pool: {
      min: 2,
      max: 10
    },
    migrations: {
      tableName: 'knex_migrations'
    }
  },

  development: {
    client: 'postgresql',
    connection: {
      database: databaseName,
      user:     'postgres',
      password: '4198b04a1e2e7684ba887796e92e0d9a'
    },
    pool: {
      min: 2,
      max: 10
    },
    migrations: {
      tableName: 'knex_migrations'
    }
  },

  production: {
    client: 'postgresql',
    connection: {
      database: databaseName,
      user:     'postgres',
      password: '4198b04a1e2e7684ba887796e92e0d9a'
    },
    pool: {
      min: 2,
      max: 10
    },
    migrations: {
      tableName: 'knex_migrations'
    }
  }

};
