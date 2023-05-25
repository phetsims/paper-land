/**
 * FlatAppearanceStrategy is a value for ButtonNode options.buttonAppearanceStrategy. It makes a
 * button look flat, i.e. no shading or highlighting, with color changes on mouseover, press, etc.
 */
class CustomButtonAppearanceStrategy {

  /**
   * @param buttonBackground - the Node for the button's background, sans content
   * @param interactionStateProperty - interaction state, used to trigger updates
   * @param baseColorProperty - base color from which other colors are derived
   * @param [providedOptions]
   */
  constructor( buttonBackground,
               interactionStateProperty,
               baseColorProperty,
               providedOptions ) {

    // dynamic colors
    const baseBrighter4Property = new phet.scenery.PaintColorProperty( baseColorProperty, { luminanceFactor: 0.25 } );
    const baseDarker4Property = new phet.scenery.PaintColorProperty( baseColorProperty, { luminanceFactor: -0.25 } );

    // reversed from typical "flat" appearance strategy so it can look like a radio button if needed
    const upFillProperty = baseDarker4Property;
    const overFillProperty = baseColorProperty;
    const downFillProperty = baseBrighter4Property;

    const options = _.merge( {
      stroke: baseDarker4Property,
      selectedStroke: baseDarker4Property
    }, providedOptions );

    const lineWidth = typeof options.lineWidth === 'number' ? options.lineWidth : 1;

    // If the stroke wasn't provided, set a default.
    buttonBackground.stroke = options.stroke || baseDarker4Property;
    buttonBackground.lineWidth = lineWidth;

    this.maxLineWidth = buttonBackground.hasStroke() ? lineWidth : 0;

    // Cache colors
    buttonBackground.cachedPaints = [ upFillProperty, overFillProperty, downFillProperty ];

    // Change colors to match interactionState
    function interactionStateListener( interactionState ) {
      switch( interactionState ) {

        case phet.sun.ButtonInteractionState.IDLE:
          buttonBackground.fill = upFillProperty;
          buttonBackground.stroke = options.stroke;
          break;

        case phet.sun.ButtonInteractionState.OVER:
          buttonBackground.fill = overFillProperty;
          buttonBackground.stroke = options.stroke;
          break;

        case phet.sun.ButtonInteractionState.PRESSED:
          buttonBackground.fill = downFillProperty;
          buttonBackground.stroke = options.selectedStroke;
          break;

        default:
          throw new Error( `unsupported interactionState: ${interactionState}` );
      }
    }

    // Do the initial update explicitly, then lazy link to the properties.  This keeps the number of initial updates to
    // a minimum and allows us to update some optimization flags the first time the base color is actually changed.
    interactionStateProperty.link( interactionStateListener );

    this.disposeFlatAppearanceStrategy = () => {
      if ( interactionStateProperty.hasListener( interactionStateListener ) ) {
        interactionStateProperty.unlink( interactionStateListener );
      }
      baseBrighter4Property.dispose();
      baseDarker4Property.dispose();
    };
  }

  dispose() {
    this.disposeFlatAppearanceStrategy();
  }
}

export default CustomButtonAppearanceStrategy;
