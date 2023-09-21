/**
 * @param { import('knex').Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function( knex ) {
  return knex.schema.alterTable( 'creator-data', table => {

    // Rename the 'systemName' column to 'projectName'
    table.renameColumn( 'systemName', 'projectName' );

    // Rename the 'systemData' column to 'projectData'
    table.renameColumn( 'systemData', 'projectData' );
  } );
};

/**
 * @param { import('knex').Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function( knex ) {
  return knex.schema.alterTable( 'creator-data', table => {

    // Rename the 'projectName' column back to 'systemName'
    table.renameColumn( 'projectName', 'systemName' );

    // Rename the 'projectData' column back to 'systemData'
    table.renameColumn( 'projectData', 'systemData' );
  } );
};