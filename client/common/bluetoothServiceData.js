/**
 * A utility file that contains all of the bluetooth services and characteristics that are available
 * to the user.
 */
import paperLand from '../display/paperLand.js';
import CharacteristicDescriptor from './CharacteristicDescriptor.js';
import ServiceDescriptor from './ServiceDescriptor.js';


// The list of services that are available to the user. This is a list of UUIDs that the user can connect to.
// Instead of an arbitrary list, we reduce the list so that we can connect to them on an insecure origin.
// On an insecure origin, the browser will not allow us to connect to any arbitrary service.
// See https://lancaster-university.github.io/microbit-docs/resources/bluetooth/bluetooth_profile.html for
// microbit BLE services and characteristics.
const MICROBIT_TEMPERATURE_SERVICE = 'e95d6100-251d-470a-a062-fa1922dfa9a8';
const MICROBIT_TEMPERATURE_CHARACTERISTIC = 'e95d9250-251d-470a-a062-fa1922dfa9a8';

const MICROBIT_ACCELEROMETER_SERVICE = 'e95d0753-251d-470a-a062-fa1922dfa9a8';
const MICROBIT_ACCELEROMETER_CHARACTERISTIC = 'e95dca4b-251d-470a-a062-fa1922dfa9a8';

const MICROBIT_BUTTON_SERVICE = 'e95d9882-251d-470a-a062-fa1922dfa9a8';
const MICROBIT_BUTTON_A_CHARACTERISTIC = 'e95dda90-251d-470a-a062-fa1922dfa9a8';
const MICROBIT_BUTTON_B_CHARACTERISTIC = 'e95dda91-251d-470a-a062-fa1922dfa9a8';

const MICROBIT_LED_SERVICE = 'e95dd91d-251d-470a-a062-fa1922dfa9a8';
const MICROBIT_LED_MATRIX_CHARACTERISTIC = 'e95d7b77-251d-470a-a062-fa1922dfa9a8';
const MICROBIT_LED_TEXT_CHARACTERISTIC = 'e95d93ee-251d-470a-a062-fa1922dfa9a8';

const MICROBIT_MAGNETOMETER_SERVICE = 'e95df2d8-251d-470a-a062-fa1922dfa9a8';
const MICROBIT_MAGNETOMETER_CHARACTERISTIC = 'e95dfb11-251d-470a-a062-fa1922dfa9a8';

const MICROBIT_IO_PIN_SERVICE = 'e95d127b-251d-470a-a062-fa1922dfa9a8';
const MICROBIT_IO_PIN_CHARACTERISTIC = 'e95d8d00-251d-470a-a062-fa1922dfa9a8';

const MICROBIT_UART_SERVICE = '6e400001-b5a3-f393-e0a9-e50e24dcca9e';
const MICROBIT_UART_TX_CHARACTERISTIC = '6e400002-b5a3-f393-e0a9-e50e24dcca9e';
const MICROBIT_UART_RX_CHARACTERISTIC = '6e400003-b5a3-f393-e0a9-e50e24dcca9e';

// A set of custom service (not related to the microbit) UUIDs that the user can optionally connect to with a
// different device like an Arduino or another microcontroller.
const CUSTOM_SERVICE_1 = '0000aaaa-251d-470a-a062-fa1922dfa9a8';
const CUSTOM_SERVICE_2 = '0000bbbb-251d-470a-a062-fa1922dfa9a8';
const CUSTOM_SERVICE_3 = '0000cccc-251d-470a-a062-fa1922dfa9a8';
const CUSTOM_SERVICE_4 = '0000dddd-251d-470a-a062-fa1922dfa9a8';
const CUSTOM_SERVICE_5 = '0000eeee-251d-470a-a062-fa1922dfa9a8';

// A set of custom characteristics (not related to the microbit) that the user can optionally connect to with a
// different device like an Arduino or another microcontroller.
const CUSTOM_CHARACTERISTIC_1 = '0000aaaa-251d-470a-a062-fa1922dfa9a8';
const CUSTOM_CHARACTERISTIC_2 = '0000bbbb-251d-470a-a062-fa1922dfa9a8';
const CUSTOM_CHARACTERISTIC_3 = '0000cccc-251d-470a-a062-fa1922dfa9a8';
const CUSTOM_CHARACTERISTIC_4 = '0000dddd-251d-470a-a062-fa1922dfa9a8';
const CUSTOM_CHARACTERISTIC_5 = '0000eeee-251d-470a-a062-fa1922dfa9a8';

const CUSTOM_CHARACTERISTICS = [
  CUSTOM_CHARACTERISTIC_1,
  CUSTOM_CHARACTERISTIC_2,
  CUSTOM_CHARACTERISTIC_3,
  CUSTOM_CHARACTERISTIC_4,
  CUSTOM_CHARACTERISTIC_5
];

// A collection of characteristic descriptors for the 'custom' IDs.
const CUSTOM_CHARACTERISTIC_DESCRIPTORS = CUSTOM_CHARACTERISTICS.map( characteristicUUID => new CharacteristicDescriptor( characteristicUUID, 'Custom Arduino Characteristic', true, true ) );

// Create descriptors for the services and their characteristics and assign them to a map to convey
// their associations.
const SERVICE_DESCRIPTOR_TO_CHARACTERISTIC_DESCRIPTOR_MAP = new Map( [
  [
    new ServiceDescriptor( MICROBIT_TEMPERATURE_SERVICE, 'micro:bit temperature' ),
    [ new CharacteristicDescriptor( MICROBIT_TEMPERATURE_CHARACTERISTIC, 'micro:bit temperature', true, false ) ]
  ],
  [
    new ServiceDescriptor( MICROBIT_ACCELEROMETER_SERVICE, 'micro:bit accelerometer' ),
    [ new CharacteristicDescriptor( MICROBIT_ACCELEROMETER_CHARACTERISTIC, 'micro:bit accelerometer', true, false ) ]
  ],
  [
    new ServiceDescriptor( MICROBIT_BUTTON_SERVICE, 'micro:bit buttons' ),
    [
      new CharacteristicDescriptor( MICROBIT_BUTTON_A_CHARACTERISTIC, 'micro:bit button A', true, false ),
      new CharacteristicDescriptor( MICROBIT_BUTTON_B_CHARACTERISTIC, 'micro:bit button B', true, false )
    ]
  ],
  [
    new ServiceDescriptor( MICROBIT_LED_SERVICE, 'micro:bit LEDs' ),
    [
      new CharacteristicDescriptor( MICROBIT_LED_MATRIX_CHARACTERISTIC, 'micro:bit LED matrix', false, true ),
      new CharacteristicDescriptor( MICROBIT_LED_TEXT_CHARACTERISTIC, 'micro:bit LED text', false, true )
    ]
  ],
  [
    new ServiceDescriptor( MICROBIT_MAGNETOMETER_SERVICE, 'micro:bit magnetometer' ),
    [ new CharacteristicDescriptor( MICROBIT_MAGNETOMETER_CHARACTERISTIC, 'micro:bit magnetometer', true, false ) ]
  ],
  [
    new ServiceDescriptor( MICROBIT_IO_PIN_SERVICE, 'micro:bit IO pins' ),
    [ new CharacteristicDescriptor( MICROBIT_IO_PIN_CHARACTERISTIC, 'micro:bit IO pin', true, true ) ]
  ],
  [
    new ServiceDescriptor( MICROBIT_UART_SERVICE, 'micro:bit UART' ),
    [
      new CharacteristicDescriptor( MICROBIT_UART_RX_CHARACTERISTIC, 'micro:bit RX (write to micro:bit)', false, true ),
      new CharacteristicDescriptor( MICROBIT_UART_TX_CHARACTERISTIC, 'micro:bit TX (read from micro:bit)', true, false )
    ]
  ],
  [
    new ServiceDescriptor( CUSTOM_SERVICE_1, 'Custom Arduino Service 1' ),
    CUSTOM_CHARACTERISTIC_DESCRIPTORS
  ],
  [
    new ServiceDescriptor( CUSTOM_SERVICE_2, 'Custom Arduino Service 2' ),
    CUSTOM_CHARACTERISTIC_DESCRIPTORS
  ],
  [
    new ServiceDescriptor( CUSTOM_SERVICE_3, 'Custom Arduino Service 3' ),
    CUSTOM_CHARACTERISTIC_DESCRIPTORS
  ],
  [
    new ServiceDescriptor( CUSTOM_SERVICE_4, 'Custom Arduino Service 4' ),
    CUSTOM_CHARACTERISTIC_DESCRIPTORS
  ],
  [
    new ServiceDescriptor( CUSTOM_SERVICE_5, 'Custom Arduino Service 5' ),
    CUSTOM_CHARACTERISTIC_DESCRIPTORS
  ]
] );


const bluetoothServiceData = {

  /**
   * Specific UUIDs that should be exposed.
   */
  MICROBIT_UART_SERVICE: MICROBIT_UART_SERVICE,
  MICROBIT_UART_RX_CHARACTERISTIC: MICROBIT_UART_RX_CHARACTERISTIC,

  /**
   * The list of all unique service IDs that are available to the user.
   */
  services: Array.from( SERVICE_DESCRIPTOR_TO_CHARACTERISTIC_DESCRIPTOR_MAP.keys() ).map(
    serviceDescriptor => serviceDescriptor.serviceUUID
  ),

  /**
   * Map of service descriptors to their characteristic descriptors. This is used to show the user the
   * available characteristics for a service when they are creating a bluetooth component.
   */
  serviceDescriptorToCharacteristicDescriptorMap: SERVICE_DESCRIPTOR_TO_CHARACTERISTIC_DESCRIPTOR_MAP,

  /**
   * Gets the service descriptor for the specified service UUID.
   * @param serviceUUID
   * @returns {ServiceDescriptor}
   */
  getServiceDescriptor( serviceUUID ) {
    return Array.from( SERVICE_DESCRIPTOR_TO_CHARACTERISTIC_DESCRIPTOR_MAP.keys() ).find( serviceDescriptor => serviceDescriptor.serviceUUID === serviceUUID );
  },

  /**
   * Gets the characteristic descriptors for the specified service descriptor.
   * @param serviceDescriptor
   * @returns {CharacteristicDescriptor[]}
   */
  getCharacteristicDescriptors( serviceDescriptor ) {
    return SERVICE_DESCRIPTOR_TO_CHARACTERISTIC_DESCRIPTOR_MAP.get( serviceDescriptor );
  },

  /**
   * Gets the characteristic descriptors under the provided service UUID.
   * @param serviceUUID
   * @returns {CharacteristicDescriptor[]}
   */
  getCharacteristicDescriptorsForService( serviceUUID ) {
    return bluetoothServiceData.getCharacteristicDescriptors( bluetoothServiceData.getServiceDescriptor( serviceUUID ) );
  },

  /**
   * Returns the characteristic descriptor for the specified characteristic ID. Null if none is found.
   * @param characteristicId
   * @returns {CharacteristicDescriptor|null}
   */
  getCharacteristicDescriptorForCharacteristicId( characteristicId ) {
    for ( let [ serviceDescriptor, characteristicDescriptors ] of SERVICE_DESCRIPTOR_TO_CHARACTERISTIC_DESCRIPTOR_MAP ) {
      for ( let characteristicDescriptor of characteristicDescriptors ) {
        if ( characteristicDescriptor.characteristicUUID === characteristicId ) {
          return characteristicDescriptor;
        }
      }
    }
    return null;
  }
};

// Add it to the namespace so it can be used in generated code
paperLand.bluetoothServiceData = bluetoothServiceData;

export default bluetoothServiceData;