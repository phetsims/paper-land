const Constants = {

  // An amount of time that editors will "claim" program code after the server is polled.
  // This is used to prevent multiple users from editing the same program at the same time.
  EDITOR_HANDLE_DURATION: 1500,

  // The maximum number for a program. Value comes from the original paper-land project. I have
  // no idea why this number was chosen but it probably has something to do with the number
  // of uniquely identifiable programs that can be detected by the camera.
  MAX_PROGRAM_NUMBER: 8400 / 4,

  // An arbitrary limit on the number of snippets that can be saved.
  MAX_SNIPPET_NUMBER: 500,

  // success codes
  SUCCESS: 200,

  // error codes
  UNKNOWN_ERROR: 500,
  MISSING_INFO: 400,
  SPACE_RESTRICTED: 401,
  PROJECT_ALREADY_EXISTS: 402,
  BAD_PARAMETERS: 403,
  PROJECT_DOES_NOT_EXIST: 404,

  /**
   * Brute force method for generating a new program number that is within the maximum
   * number of allowed programs but is unique from the existing numbers.
   *
   * @param existingNumbers
   * @param maxNumber
   * @returns {*}
   */
  generateProgramNumber: ( existingNumbers, maxNumber ) => {
    const potentialNumbers = [];

    for ( let i = 0; i < maxNumber; i++ ) {
      if ( !existingNumbers.includes( i ) ) {
        potentialNumbers.push( i );
      }
    }
    if ( potentialNumbers.length === 0 ) {
      throw new Error( 'No more available numbers' );
    }
    return potentialNumbers[ Math.floor( Math.random() * potentialNumbers.length ) ];
  },

  generateUniqueId: () => {
    return Math.random().toString( 36 ).substr( 2, 9 );
  }
}

module.exports = Constants;