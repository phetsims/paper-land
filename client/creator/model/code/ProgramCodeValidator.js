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

  /**
   * Check for missing images or sounds in the program code.
   * @param programCode - Code for an entire program
   * @param mediaType - 'image' or 'sound'
   * @param inspectSetters - if true, inspect setImage or setSound functions for missing assets
   */
  static async checkForMissingAssets( programCode, mediaType, inspectSetters ) {
    const generalErrorMessage = `Sorry, there was an error checking for ${mediaType} files. Please report an issue to the developer.`;

    if ( mediaType !== 'image' && mediaType !== 'sound' ) {
      throw new Error( generalErrorMessage );
    }

    const apiSuffix = mediaType === 'image' ? 'imageFiles' : 'soundFiles';

    // the path to an asset as it will appear in code, like 'media/images/{{FILE_NAME}}'
    const path = mediaType === 'image' ? 'media/images/' : 'media/sounds/';

    return new Promise( ( resolve, reject ) => {

      // There is duplication in the patterns here but when I try to refactor them, the regex doesn't work. Something
      // about escaped characters, but I couldn't figure it out. This is a small enough duplication that it's fine.
      const regexPattern = mediaType === 'image' ? /media\/images\/(uploads\/)?[\w-]+\.\w+/g : /media\/sounds\/(uploads\/)?[\w-]+\.\w+/g;
      const assetPathsInCode = programCode.match( regexPattern ) || [];

      if ( inspectSetters ) {
        const setterFunction = mediaType === 'image' ? 'setImage' : 'setSound';

        // get all usages of the setter function in the code - if there are any, get the value provided to that
        // setter and add it to assetPathsInCode so we can check that value for existence
        const regex = new RegExp( `${setterFunction}\\(\\s*'([^']+)'\\s*\\)`, 'g' );
        const matches = [ ...programCode.matchAll( regex ) ];
        const values = matches.map( match => {

          // The setter function just takes the name of the file (or name through uploads) and not the full path.
          // So we need to add the path to the file name.
          return `${path}${match[ 1 ]}`;
        } );
        assetPathsInCode.push( ...values );
      }

      // remove duplicates for efficiency
      const uniqueAssetPathsInCode = [ ...new Set( assetPathsInCode ) ];

      if ( uniqueAssetPathsInCode.length > 0 ) {
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
              const filesWithMediaPath = files.map( fileName => `${path}${ProgramCodeValidator.trimPath( fileName )}` );

              for ( let i = 0; i < uniqueAssetPathsInCode.length; i++ ) {
                const usedPath = uniqueAssetPathsInCode[ i ];
                if ( !filesWithMediaPath.includes( usedPath ) ) {

                  // customizations for the error message
                  const mediaTypeString = mediaType === 'image' ? 'image' : 'sound';
                  const mediaTypeWithArticle = mediaType === 'image' ? 'an image' : 'a sound';
                  const capitalizedMediaTypeWithArticle = mediaType === 'image' ? 'An image' : 'A sound';
                  const exampleFileType = mediaType === 'image' ? 'png' : 'mp3';
                  const imageName = usedPath.substring( path.length );

                  let errorMessage = `${capitalizedMediaTypeWithArticle} is missing and cannot be used: ${imageName}.\n
                    Please upload ${mediaTypeWithArticle} with that name or select an alternative.`;

                  // If this type uses setters, add a note about how to correctly use the setter functions
                  if ( inspectSetters ) {
                    errorMessage += `\n\nIf setting from uploads in custom code, be sure to include the directory like "uploads/my-${mediaTypeString}.${exampleFileType}".`;
                  }

                  reject(
                    new Error( errorMessage )
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
      else {
        resolve();
      }
    } );
  }

  /**
   * Trims a path of an extra leading '/' if it's there. Useful for combining paths, since the start may have a
   * leading '/'.
   * @param path
   * @return {string|*}
   */
  static trimPath( path ) {
    return path.startsWith( '/' ) ? path.substring( 1 ) : path;
  }
}