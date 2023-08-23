/**
 * A class that is responsible for generating code related to the view.
 */

export default class ViewCodeGenerator {
  static getSetterFunctionsForViewType( viewType ) {

    const codeStrings = [];

    // The setters that are available for all Node types.
    codeStrings.push( `
      const setCenterX = ( x ) => {
        {{NAME}}Path.centerX = x;
      };
      
      const setCenterY = ( y ) => {
        {{NAME}}Path.centerY = y;
      };
      
      const setScale( scale ) => {
        {{NAME}}Path.scaleMagnitude = scale;
      };
      
      const setOpacity = ( opacity ) => {
        {{NAME}}Path.opacity = opacity;
      };
      
      const setVisible = ( visible ) => {
        {{NAME}}Path.visible = visible;
      };
      
      const setRotation = ( rotation ) => {
        {{NAME}}Path.rotation = rotation;
      };`
    );

    if ( viewType === 'ShapeViewComponent' ) {
      codeStrings.push( `
        const setStroke = ( color ) => {
          {{NAME}}Path.stroke = color;
        };
        
        const setLineWidth = ( width ) => {
          {{NAME}}Path.lineWidth = width;
        };
        
        const setFill = ( color ) => {
          {{NAME}}Path.fill = color;
        };`
      );
    }
    else if ( viewType === 'TextViewComponent' ) {
      codeStrings.push( `
        const setString = ( string ) => {
          {{NAME}}Text.string = string;
        };
        
        const setFontSize = ( size ) => {
          {{NAME}}Text.fontSize = size;
        };
        
        const setTextColor = ( color ) => {
          {{NAME}}Text.fill = color;
        };
        
        const setFontFamily = ( family ) => {
          {{NAME}}Text.fontFamily = family;
        };
      ` );
    }

    return codeStrings;
  }
}