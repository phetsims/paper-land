/**
 * A collection of functions to validate program code.
 *
 * @author Jesse Greenberg
 */

import { parse } from 'acorn';
import xhr from 'xhr';

export default class ProgramCodeValidator {

  static async validate( programCode, programNumber ) {
    if ( programCode.length === 0 ) {
      throw new Error( 'Program code is required.' );
    }

    try {
      parse( programCode, { ecmaVersion: 'latest' } );
    }
    catch( error ) {
      throw new Error( `Sorry, syntax error in generated code for program ${programNumber}. Inspect your custom code or please report an issue to the developer.` );
    }

    try {
      await this.checkForMissingAssets( programCode, 'image', true );
      await this.checkForMissingAssets( programCode, 'sound', false );
    }
    catch( error ) {
      throw new Error( error.message );
    }
  }

  static async checkForMissingAssets( programCode, mediaType, inspectSetters ) {
    const generalErrorMessage = `Sorry, there was an error checking for ${mediaType} files. Please report an issue to the developer.`;

    if ( mediaType !== 'image' && mediaType !== 'sound' ) {
      throw new Error( generalErrorMessage );
    }

    const apiSuffix = mediaType === 'image' ? 'imageFiles' : 'soundFiles';

    // the path to an asset as it will appear in code, like 'media/images/{{FILE_NAME}}'
    const path = mediaType === 'image' ? 'media/images/' : 'media/sounds/';

    return new Promise( ( resolve, reject ) => {

      const assetPathsInCode = programCode.match( new RegExp( `${path}\\w+\\.\\w+`, 'g' ) );


      if ( inspectSetters ) {
        const setterFunction = mediaType === 'image' ? 'setImage' : 'setSound';

        // get all usages of the setter function in the code - if there are any, get the value provided to that
        // setter and add it to assetPathsInCode so we can check that value for existence
        const regex = new RegExp( `${setterFunction}\\(\\s*'([^']+)'\\s*\\)`, 'g' );
        const matches = [ ...programCode.matchAll( regex ) ];
        const values = matches.map( match => match[ 1 ] );
        assetPathsInCode.push( ...values );
      }

      if ( assetPathsInCode ) {
        const filesListUrl = new URL( `api/creator/${apiSuffix}`, window.location.origin ).toString();
        xhr.get( filesListUrl, { json: true }, ( error, response ) => {
          if ( error ) {
            reject(
              new Error( generalErrorMessage )
            );
          }
          else {
            if ( response.body && response.body[ `${apiSuffix}` ] && Array.isArray( response.body[ `${apiSuffix}` ] ) ) {
              const files = response.body[ `${apiSuffix}` ];

              const filesWithMediaPath = files.map( fileName => `${path}${fileName}` );

              for ( let i = 0; i < assetPathsInCode.length; i++ ) {
                const usedPath = assetPathsInCode[ i ];
                if ( !filesWithMediaPath.includes( usedPath ) ) {

                  // TODO: For next time, add information about how the to add the path.
                  // TODO: Allow /media/ to be used in the path. (instead of media/
                  // TODO: Add a hint about how to add the file to the project.

                  reject(
                    new Error( `Sorry, this project is trying to use an asset that is not available - ${usedPath}.` )
                  );
                }
              }
              resolve();
            }
            else {
              reject(
                new Error( generalErrorMessage )
              );
            }
          }
        } );
      }
    } );
  }
}