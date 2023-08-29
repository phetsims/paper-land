/**
 * A class that is responsible for generating code related to the view.
 */

export default class ViewCodeGenerator {

  /**
   * Get a consistent name for a component based on its type and the user defined name.
   */
  static getComponentNameString( viewType, componentName ) {

    return viewType === 'ShapeViewComponent' ? `${componentName}Path` :
           viewType === 'TextViewComponent' ? `${componentName}Text` :
           viewType === 'ImageViewComponent' ? `${componentName}Image` :
           viewType === 'SoundViewComponent' ? `${componentName}Sound` :
           viewType === 'DescriptionViewComponent' ? `${componentName}Description` :
           `${componentName}Background`;
  }

  static getSetterFunctionsForViewType( viewType, componentName ) {
    const componentNameString = ViewCodeGenerator.getComponentNameString( viewType, componentName );
    const codeStrings = [];

    // The setters that are available for all Node types.
    codeStrings.push( `
      const setCenterX = ( x ) => {
        ${componentNameString}.centerX = x;
        ${componentNameString}.centerX = x;
      };
      
      const setCenterY = ( y ) => {
        ${componentNameString}.centerY = y;
      };
      
      const setScale = ( scale ) => {
        ${componentNameString}.scaleMagnitude = scale;
      };
      
      const setOpacity = ( opacity ) => {
        ${componentNameString}.opacity = opacity;
      };
      
      const setVisible = ( visible ) => {
        ${componentNameString}.visible = visible;
      };
      
      const setRotation = ( rotation ) => {
        ${componentNameString}.rotation = rotation;
      };`
    );

    if ( viewType === 'ShapeViewComponent' ) {
      codeStrings.push( `
        const setStroke = ( color ) => {
          ${componentNameString}.stroke = color;
        };
        
        const setLineWidth = ( width ) => {
          ${componentNameString}.lineWidth = width;
        };
        
        const setFill = ( color ) => {
          ${componentNameString}.fill = color;
        };
        
        // for a line
        const setX1 = ( newX1 ) => {
          x1 = newX1;
          ${componentNameString}.shape = phet.kite.Shape.lineSegment( x1, y1, x2, y2 );
        };
        
        const setY1 = ( newY1 ) => {
          y1 = newY1;
          ${componentNameString}.shape = phet.kite.Shape.lineSegment( x1, y1, x2, y2 );
        };

        const setX2 = ( newX2 ) => {
          x2 = newX2;
          ${componentNameString}.shape = phet.kite.Shape.lineSegment( x1, y1, x2, y2 );
        };
        
        const setY2 = ( newY2 ) => {
          y2 = newY2;
          ${componentNameString}.shape = phet.kite.Shape.lineSegment( x1, y1, x2, y2 );
        };
        
        // for a circle
        const setRadius = ( radius ) => {
          ${componentNameString}.radius = radius;
        };
        `
      );
    }
    else if ( viewType === 'TextViewComponent' ) {
      codeStrings.push( `
        const setString = ( string ) => {
          ${componentNameString}.string = string;
        };
        
        const setFontSize = ( size ) => {
          ${componentNameString}.fontSize = size;
        };
        
        const setTextColor = ( color ) => {
          ${componentNameString}.fill = color;
        };
        
        const setFontFamily = ( family ) => {
          ${componentNameString}.fontFamily = family;
        };
      ` );
    }

    return codeStrings.join( '\n' );
  }
}