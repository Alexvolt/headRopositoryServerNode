exports.up = (knex, Promise) => {
  return knex.schema.createTable('professionalAreas', (table) => {
    table.increments();
    table.string('name').unique().notNullable();
    table.integer('parentId').notNullable();
    table.timestamp('created_at').notNullable().defaultTo(knex.raw('now()'));
    table.integer('created_by').notNullable();
  });
};


exports.down = (knex, Promise) => {
  return knex.schema.dropTable('professionalAreas');
};

