import CustomButtonAppearanceStrategy from '../creator/view/CustomButtonAppearanceStrategy.js';

const TEXT_FONT = new phet.scenery.Font( { size: 16 } );
const TEXT_FILL_COLOR = new phet.scenery.Color( 189, 203, 218 );
const BUTTON_FILL_COLOR = new phet.scenery.Color( 89, 93, 94 );
const BUTTON_STROKE_COLOR = new phet.scenery.Color( 80, 80, 80 );
const BUTTON_APPEARANCE_STRATEGY = phet.sun.ButtonNode.FlatAppearanceStrategy;
const TITLE_TEXT_FONT = new phet.scenery.Font( { size: 24 } );
const BUTTON_DISABLED_COLOR = BUTTON_FILL_COLOR.colorUtilsBrighter( 0.25 );
const BUTTON_PRESSED_COLOR = BUTTON_FILL_COLOR.colorUtilsDarker( 0.2 );
const ARROW_SIZE = new phet.dot.Dimension2( 120, 21 );
const FOCUS_HIGHLIGHT_COLOR = new phet.scenery.Color( '#6C8EAC' );
const INTERACTION_COLOR = new phet.scenery.Color( 'blue' );
const ERROR_COLOR = new phet.scenery.Color( '#8b0000' );
const BACKGROUND_COLOR = new phet.scenery.Color( '#2E4152' );

const PROGRAM_FONT = new phet.scenery.Font( { size: 6 } );

const TEXT_BUTTON_OPTIONS = {
  font: TEXT_FONT,
  minWidth: 200,
  minHeight: 40,
  textFill: TEXT_FILL_COLOR,
  baseColor: BUTTON_FILL_COLOR,
  stroke: BUTTON_STROKE_COLOR,
  buttonAppearanceStrategy: BUTTON_APPEARANCE_STRATEGY,
  disabledColor: BUTTON_DISABLED_COLOR
};

const RECTANGULAR_BUTTON_OPTIONS = {
  stroke: BUTTON_STROKE_COLOR,
  buttonAppearanceStrategy: BUTTON_APPEARANCE_STRATEGY,
  baseColor: BUTTON_FILL_COLOR,
  disabledColor: BUTTON_DISABLED_COLOR,
  xMargin: 3,
  yMargin: 3
};

const ViewConstants = {

  PROGRAM_FONT: PROGRAM_FONT,

  // color for buttons
  buttonFillColor: BUTTON_FILL_COLOR,

  buttonDisabledColor: BUTTON_DISABLED_COLOR,
  BUTTON_PRESSED_COLOR: BUTTON_PRESSED_COLOR,

  // stroke color for buttons
  buttonStrokeColor: new phet.scenery.Color( 80, 80, 80 ),

  // background color for the app
  backgroundColor: new phet.scenery.Color( 43, 43, 43 ),

  buttonAppearanceStrategy: CustomButtonAppearanceStrategy,

  buttonAppearanceStrategyOptions: {
    selectedStroke: INTERACTION_COLOR
  },

  TEXT_BUTTON_OPTIONS: TEXT_BUTTON_OPTIONS,
  RECTANGULAR_BUTTON_OPTIONS: RECTANGULAR_BUTTON_OPTIONS,

  // background for the toolbar
  toolbarBackgroundColor: new phet.scenery.Color( 60, 63, 65 ),

  // stroke for the toolbar
  toolbarStrokeColor: new phet.scenery.Color( 125, 125, 125 ),

  // fonts for buttons and other things
  font: TEXT_FONT,

  // color for all text
  textFillColor: TEXT_FILL_COLOR,

  TEXT_OPTIONS: {
    font: TEXT_FONT,
    fill: TEXT_FILL_COLOR
  },

  titleTextOptions: {
    font: TITLE_TEXT_FONT,
    fill: TEXT_FILL_COLOR
  },

  lineWidth: 1,

  arrowButtonOptions: {
    arrowSize: ARROW_SIZE,
    baseColor: BUTTON_FILL_COLOR,
    disabledColor: BUTTON_DISABLED_COLOR,
    stroke: BUTTON_STROKE_COLOR,
    arrowStroke: TEXT_FILL_COLOR,
    lineWidth: 2
  },

  // color for the focus highlight
  focusHighlightColor: FOCUS_HIGHLIGHT_COLOR,

  // color to indicate that something is interactive or being interacted with
  interactionColor: INTERACTION_COLOR,

  ERROR_COLOR: ERROR_COLOR,

  BACKGROUND_COLOR: BACKGROUND_COLOR,

  interfaceSpacing: 10,

  defaultDescription: 'NO_DESCRIPTION'
};

export default ViewConstants;