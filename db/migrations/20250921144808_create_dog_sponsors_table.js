exports.up = function (knex) {
  return knex.schema.createTable("wp_custom_dog_sponsors", function (table) {
    table.increments("id").primary();

    table.bigInteger("dog_id").unsigned().notNullable();
    table.integer("sponsor_id").unsigned().notNullable();

    table.date("start_date").notNullable();
    table.date("end_date").nullable();
    table.string("source", 50);
    table.boolean("is_active").notNullable().defaultTo(true);

    table.timestamps(true, true);

    // Definición de las claves foráneas
    table.foreign("dog_id").references("ID").inTable("wp_posts");
    table.foreign("sponsor_id").references("id").inTable("wp_custom_sponsors");
  });
};

exports.down = function (knex) {
  return knex.schema.dropTable("wp_custom_dog_sponsors");
};
