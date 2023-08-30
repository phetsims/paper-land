/**
 * A class that defines the configurable attributes of a whisker for controllers that might use it.
 */

export default class WhiskerConfiguration {
  constructor( providedOptions ) {

    const options = _.extend( {
      topLength: 0.2,
      rightLength: 0.2,
      bottomLength: 0.2,
      leftLength: 0.2,

      otherPaperNumber: null
    }, providedOptions );

    this.topLength = options.topLength;
    this.rightLength = options.rightLength;
    this.bottomLength = options.bottomLength;
    this.leftLength = options.leftLength;

    this.otherPaperNumber = options.otherPaperNumber;
  }

  /**
   * Save as a JSON like object for serialization.
   */
  save() {
    return {
      topLength: this.topLength,
      rightLength: this.rightLength,
      bottomLength: this.bottomLength,
      leftLength: this.leftLength,

      otherPaperNumber: this.otherPaperNumber
    };
  }

  /**
   * Load an instance of a WhiskerConfiguration from a serialized state.
   */
  static fromData( data ) {
    return new WhiskerConfiguration( {
      topLength: data.topLength,
      rightLength: data.rightLength,
      bottomLength: data.bottomLength,
      leftLength: data.leftLength,
      otherPaperNumber: data.otherPaperNumber
    } );
  }

  /**
   * Defines the state schema for this class for usage in forms and other validation.
   */
  static getStateSchema() {
    return {
      topLength: 0.2,
      rightLength: 0.2,
      bottomLength: 0.2,
      leftLength: 0.2,
      otherPaperNumber: null
    };
  }
}