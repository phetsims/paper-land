/**
 * Collection of utility functions for server operations.
 */

const restrictedSpacesList = require( './restrictedSpacesList.js' );

// A config should have been created by now, so we can require it.
const loadConfig = require( './loadConfig.js' );
const config = loadConfig();

const ALLOW_ACCESS_TO_RESTRICTED_FILES = config.ALLOW_ACCESS_TO_RESTRICTED_FILES;

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