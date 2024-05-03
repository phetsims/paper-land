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

  // error codes
  UNKNOWN_ERROR: 500,
  MISSING_INFO: 400,
}

module.exports = Constants;