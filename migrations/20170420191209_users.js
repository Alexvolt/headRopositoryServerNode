exports.up = (knex, Promise) => {
  return knex.schema.createTable('users', (table) => {
    table.increments();
    table.string('username').unique().notNullable();
    table.string('firstName').notNullable();
    table.string('lastName').notNullable();
    table.string('password').notNullable();
    table.string('email').notNullable();
    table.boolean('admin').notNullable().defaultTo(false);
    table.boolean('haveAccess').notNullable().defaultTo(false);
    table.timestamp('created_at').notNullable().defaultTo(knex.raw('now()'));
  });
};


exports.down = (knex, Promise) => {
  return knex.schema.dropTable('users');
};
