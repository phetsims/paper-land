import React from 'react';
import ReactDOM from 'react-dom';
import clientConstants from '../clientConstants';
import PaperWhiskerManager from '../common/PaperWhiskerManager.js';

import ProjectorMain from './ProjectorMain';

const element = document.createElement( 'div' );
document.body.appendChild( element );

function render( callback ) {
  const paperProgramsConfig = JSON.parse( localStorage.paperProgramsConfig );
  const paperSizeName = paperProgramsConfig.paperSize;
  const paperSize = paperSizeName in clientConstants.paperSizes ?
                    clientConstants.paperSizes[ paperSizeName ] :
                    clientConstants.paperSizes.LETTER;
  const paperRatio = paperSize[ 1 ] / paperSize[ 0 ];

  ReactDOM.render(
    <ProjectorMain
      cameraDeviceId={paperProgramsConfig.selectedCameraDeviceId}
      knobPoints={paperProgramsConfig.knobPoints}
      paperRatio={paperRatio}
      programsToRender={JSON.parse( localStorage.paperProgramsProgramsToRender || '[]' )}
      markers={JSON.parse( localStorage.paperProgramsMarkers || '[]' )}
      dataByProgramNumber={JSON.parse( localStorage.paperProgramsDataByProgramNumber || '{}' )}
      onDataByProgramNumberChange={( dataByProgramNumber, otherCallback ) => {
        localStorage.paperProgramsDataByProgramNumber = JSON.stringify( dataByProgramNumber );
        render( otherCallback );
      }}
    />,
    element,
    callback
  );
}

window.addEventListener( 'storage', () => render() );
window.addEventListener( 'resize', () => render() );
render();