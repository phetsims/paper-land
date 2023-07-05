/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function( knex ) {
  return knex.schema.createTable( 'creator-data', table => {
    table.string( 'spaceName' ).notNullable();
    table.string( 'systemName' ).notNullable();
    table.json( 'systemData' ).notNullable();
    table.boolean( 'editing' ).notNullable();
    table.primary( [ 'spaceName', 'systemName' ] );
  } );
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function( knex ) {
  return knex.schema.dropTable( 'creator-data' );
};