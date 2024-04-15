import Component from '../Component.js';
import ListenerComponent from './ListenerComponent.js';
import MultilinkListenerComponent from './MultilinkListenerComponent.js';

/**
 * A component that controls OR depends on other components. The controlled components may be updated by a BLE
 * characteristic OR they may be used as dependencies that control a BLE characteristic. Extends a "multilink" listener
 * component as the bluetooth controller may use dependencies, controlled components, and reference components.
 */
export default class BluetoothListenerComponent extends MultilinkListenerComponent {
  constructor(
    name,
    dependencies,
    controlledProperties,
    controlFunctionString,
    writeToCharacteristic,
    serviceId,
    characteristicId,
    providedOptions
  ) {
    super( name, dependencies, controlledProperties, controlFunctionString, providedOptions );

    // {boolean} - If true, this listener will write to a BLE characteristic. When false, the listener will
    // read from a BLE characteristic.
    this.writeToCharacteristic = writeToCharacteristic;

    // {string} - the UUID for the service that this listener will interact with
    this.serviceId = serviceId;

    // {string} - the UUID for the characteristic that this listener will interact with
    this.characteristicId = characteristicId;
  }

  /**
   * Serialize to a state object for save/load.
   */
  save() {
    return {
      ...super.save(),
      writeToCharacteristic: this.writeToCharacteristic,
      serviceId: this.serviceId,
      characteristicId: this.characteristicId
    };
  }

  /**
   * Creates a new BluetoothListenerComponent from the serialized state.
   */
  static fromData( data, namedProperties ) {
    const controlledPropertyNames = data.controlledPropertyNames || [];
    const dependencyNames = data.dependencyNames || [];

    const controlledProperties = Component.findComponentsByName( namedProperties, controlledPropertyNames );
    // if ( controlledProperties.length < 1 ) {
    //   throw new Error( 'Could not find controlled properties for BluetoothListenerComponent.' );
    // }

    const dependencies = Component.findComponentsByName( namedProperties, dependencyNames );
    // if ( dependencies.length < 1 ) {
    //   throw new Error( 'Could not find dependencies for BluetoothListenerComponent.' );
    // }

    return new BluetoothListenerComponent(
      data.name,
      dependencies,
      controlledProperties,
      data.controlFunctionString,
      data.writeToCharacteristic,
      data.serviceId,
      data.characteristicId,
      {
        referenceComponentNames: data.referenceComponentNames
      }
    );
  }

  /**
   * Returns the schema for data required for this component when working with React forms.
   */
  static getStateSchema() {
    return {
      ...MultilinkListenerComponent.getStateSchema(),
      writeToCharacteristic: true,
      serviceId: '',
      characteristicId: ''
    };
  }
}