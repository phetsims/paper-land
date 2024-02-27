/**
 * A template for program code. The code generator will fill in the template.
 *
 * @author Jesse Greenberg (PhET Interactive Simulations)
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
  
  const onProgramMarkersAdded = ( paperNumber, points, scratchpad, sharedData, markers ) => {
    {{PROGRAM_MARKERS_ADDED_CODE}}
  };
  
  const onProgramMarkersRemoved = ( paperNumber, points, scratchpad, sharedData, markers ) => {
    {{PROGRAM_MARKERS_REMOVED_CODE}}
  };
  
  const onProgramMarkersChangedPosition = ( paperNumber, points, scratchpad, sharedData, markers ) => {
    {{PROGRAM_MARKERS_CHANGED_POSITION_CODE}}
  };
  
  const onProgramAdjacent = ( paperNumber, otherPaperNumber, direction, scratchpad, sharedData ) => {
    {{PROGRAM_ADJACENT_CODE}}
  };
  
  const onProgramSeparated = ( paperNumber, otherPaperNumber, direction, scratchpad, sharedData ) => {
    {{PROGRAM_SEPARATED_CODE}}
  };

  await paper.set( 'data', {
    paperPlaygroundData: {
      updateTime: Date.now(),
      eventHandlers: {
        onProgramAdded: onProgramAdded.toString(),
        onProgramRemoved: onProgramRemoved.toString(),
        onProgramChangedPosition: onProgramChangedPosition.toString(),
        onProgramMarkersAdded: onProgramMarkersAdded.toString(),
        onProgramMarkersRemoved: onProgramMarkersRemoved.toString(),
        onProgramMarkersChangedPosition: onProgramMarkersChangedPosition.toString(),
        onProgramAdjacent: onProgramAdjacent.toString(),
        onProgramSeparated: onProgramSeparated.toString(),
      },
      customWhiskerLengths: {
        top: {{TOP_WHISKER_LENGTH}},
        right: {{RIGHT_WHISKER_LENGTH}},
        bottom: {{BOTTOM_WHISKER_LENGTH}},
        left: {{LEFT_WHISKER_LENGTH}}
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