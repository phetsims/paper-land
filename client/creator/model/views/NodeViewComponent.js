/**
 * A superclass for view components that support the features of a scenery Node. Things such as
 * opacity, positioning, scale, visibility, etc.
 */

import ViewComponent from './ViewComponent.js';

export default class NodeViewComponent extends ViewComponent {
  constructor( name, modelComponents, controlFunctionString, providedOptions ) {
    super( name, modelComponents, controlFunctionString );

    const viewOptions = {
      centerX: 0.5,
      centerY: 0.5,
      scale: 1,
      rotation: 0,
      opacity: 1,
      visible: true,

      viewUnits: 'model' // 'model' or 'pixels'
    };

    const options = _.merge( {}, viewOptions, providedOptions );
    this.defaultViewOptions = _.pick( options, Object.keys( viewOptions ) );
  }

  save() {
    return {
      ...super.save(),
      defaultViewOptions: this.defaultViewOptions
    };
  }

  static getStateSchema() {
    return {
      ...ViewComponent.getStateSchema(),
      defaultViewOptions: {
        centerX: 0.5,
        centerY: 0.5,
        scale: 1,
        rotation: 0,
        opacity: 1,
        visible: true,
        viewUnits: 'model'
      }
    };
  }
}