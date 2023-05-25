/**
 * Support for image loading is deeply embedded in PhET's modules. This is a poor replacement to get us rolling.
 */
export default class ImageLoader {
  constructor() {
  }

  static loadImage( path, onLoad ) {
    if ( !ImageLoader.ImageMap.has( path ) ) {
      const imageElement = document.createElement( 'img' );
      imageElement.setAttribute( 'src', path );

      imageElement.addEventListener( 'load', () => {
        ImageLoader.ImageMap.set( path, imageElement );
        onLoad( imageElement );
      } );
    }
    else {

      // Map already has the image data loaded, use callback right away
      onLoad( ImageLoader.ImageMap.get( path ) );
    }
  }

  static ImageMap = new Map();
}