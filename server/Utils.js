/**
 * Collection of utility functions for server operations.
 */

const restrictedSpacesList = require( './restrictedSpacesList.js' );

const ALLOW_ACCESS_TO_RESTRICTED_FILES = process.env.ALLOW_ACCESS_TO_RESTRICTED_FILES === 'true';

const Utils = {

  /**
   * Returns true if the user has access to the space. Always true for those with permissions, otherwise only true
   * for non-restricted spaces.
   */
  canAccessSpace: spaceName => {
    return ALLOW_ACCESS_TO_RESTRICTED_FILES || !restrictedSpacesList.includes( spaceName );
  }
}

module.exports = Utils;