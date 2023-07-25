/**
 * A template for program code. The code generator will fill in the template.
 */

// Putting the title here on the first line makes it so there isn't an empty blank line when the template is filled in.
// That is important because the title of the program must be on the first line.
const programTemplate = `// {{TITLE}}
// Keywords: {{KEYWORDS}}
// Description: {{DESCRIPTION}}

importScripts('paper.js');

(async () => {

  const onProgramAdded = ( paperNumber, scratchpad, sharedData ) => {
    {{PROGRAM_ADDED_CODE}}
  };

  const onProgramRemoved = ( paperNumber, scratchpad, sharedData ) => {
    {{PROGRAM_REMOVED_CODE}}
  };

  const onProgramChangedPosition = ( paperNumber, points, scratchpad, sharedData ) => {
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
  
  // PROJECTOR CODE //
  // Get a canvas object for this paper to draw something to the Projector.
  const canvas = await paper.get('canvas');

  // Draw the name of the program to the projector
  const ctx = canvas.getContext('2d');
  ctx.font = '20px sans-serif';
  ctx.textAlign = 'center';
  ctx.fillStyle = 'rgb(255,0,0)';
  ctx.fillText('{{NUMBER}}', canvas.width / 2, canvas.height / 2 - 10);
  ctx.fillStyle = 'rgb(0,255,0)';
  ctx.font = '10px sans-serif';
  ctx.fillText('{{NAME}}', canvas.width / 2, canvas.height / 2 + 20);
})();
`;

export default programTemplate;