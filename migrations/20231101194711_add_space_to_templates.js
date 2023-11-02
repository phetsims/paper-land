/**
 * @param { import('knex').Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function( knex ) {
  return knex.schema.table( 'creator-templates', table => {

    // if null, the template will be available to all spaces
    table.string( 'spaceName' ).nullable();
  } );
};

/**
 * @param { import('knex').Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function( knex ) {
  return knex.schema.table( 'creator-templates', table => {

    // removes the spaceName column from the table in a rollback
    table.dropColumn( 'spaceName' );
  } );
};