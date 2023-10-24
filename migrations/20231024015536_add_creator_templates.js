/**
 * @param { import('knex').Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function( knex ) {
  return knex.schema.createTable( 'creator-templates', table => {
    table.increments( 'id' ).primary(); // Adding an 'id' means that we can use it as a foreign key in other tables
    table.string( 'name' ).notNullable();
    table.text( 'description' ).nullable();
    table.string( 'keyWords' ).notNullable();
    table.text( 'projectData' ).notNullable(); // JSON representation of state
  } );
};

/**
 * @param { import('knex').Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function( knex ) {
  return knex.schema.dropTable( 'creator-templates' );
};