import NamedProperty from './NamedProperty.js';

export default class NamedBounds2Property extends NamedProperty {
  constructor( name, minX, minY, maxX, maxY ) {
    super( name, 'Bounds2Property' );

    this.defaultMinX = minX;
    this.defaultMinY = minY;
    this.defaultMaxX = maxX;
    this.defaultMaxY = maxY;
  }

  save() {
    return {
      name: this.nameProperty.value,
      propertyType: this.propertyType,
      defaultMinX: this.defaultMinX,
      defaultMinY: this.defaultMinY,
      defaultMaxX: this.defaultMaxX,
      defaultMaxY: this.defaultMaxY
    };
  }

  static getStateSchema() {
    return {
      defaultMinX: 0,
      defaultMinY: 0,
      defaultMaxX: 1,
      defaultMaxY: 1
    };
  }
}