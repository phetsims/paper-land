const programTemplate = `
// {{TITLE}}
// Keywords: {{KEYWORDS}}
// Description: {{DESCRIPTION}}

importScripts('paper.js');

(async () => {

  const onProgramAdded = ( number, scratchpad, sharedData ) => {
    {{PROGRAM_ADDED_CODE}}
  };

  const onProgramRemoved = ( number, scratchpad, sharedData ) => {
    {{PROGRAM_REMOVED_CODE}}
  };

  const onProgramChangedPosition = ( number, points, scratchpad, sharedData ) => {
    {{PROGRAM_CHANGED_POSITION_CODE}}
  };

  await paper.set( 'data', {
    paperPlaygroundData: {
      updateTime: Date.now(),
      eventHandlers: {
        onProgramAdded: onProgramAdded.toString(),
        onProgramRemoved: onProgramRemoved.toString(),
        onProgramChangedPosition: onProgramChangedPosition.toString(),
      }
    }
  } );
})();
`;

export default programTemplate;