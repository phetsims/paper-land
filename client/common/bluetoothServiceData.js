/**
 * A utility file that contains all of the bluetooth services and characteristics that are available
 * to the user.
 */
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

const MICROBIT_EVENT_SERVICE = 'e95d93af-251d-470a-a062-fa1922dfa9a8';
const MICROBIT_EVENT_CHARACTERISTIC = 'e95d9775-251d-470a-a062-fa1922dfa9a8';

const MICROBIT_UART_SERVICE = '6e400001-b5a3-f393-e0a9-e50e24dcca9e';
const MICROBIT_UART_TX_CHARACTERISTIC = '6e400002-b5a3-f393-e0a9-e50e24dcca9e';
const MICROBIT_UART_RX_CHARACTERISTIC = '6e400003-b5a3-f393-e0a9-e50e24dcca9e';

// A set of random service (not related to the microbit) UUIDs that the user can optionally connect to with a
// different device like an Arduino or another microcontroller.
const RANDOM_SERVICE_1 = '0000aaaa-251d-470a-a062-fa1922dfa9a8';
const RANDOM_SERVICE_2 = '0000bbbb-251d-470a-a062-fa1922dfa9a8';
const RANDOM_SERVICE_3 = '0000cccc-251d-470a-a062-fa1922dfa9a8';
const RANDOM_SERVICE_4 = '0000dddd-251d-470a-a062-fa1922dfa9a8';
const RANDOM_SERVICE_5 = '0000eeee-251d-470a-a062-fa1922dfa9a8';

// A set of random characteristics (not related to the microbit) that the user can optionally connect to with a
// different device like an Arduino or another microcontroller.
const RANDOM_CHARACTERISTIC_1 = '0000aaaa-251d-470a-a062-fa1922dfa9a8';
const RANDOM_CHARACTERISTIC_2 = '0000bbbb-251d-470a-a062-fa1922dfa9a8';
const RANDOM_CHARACTERISTIC_3 = '0000cccc-251d-470a-a062-fa1922dfa9a8';
const RANDOM_CHARACTERISTIC_4 = '0000dddd-251d-470a-a062-fa1922dfa9a8';
const RANDOM_CHARACTERISTIC_5 = '0000eeee-251d-470a-a062-fa1922dfa9a8';

const RANDOM_CHARACTERISTICS = [
  RANDOM_CHARACTERISTIC_1,
  RANDOM_CHARACTERISTIC_2,
  RANDOM_CHARACTERISTIC_3,
  RANDOM_CHARACTERISTIC_4,
  RANDOM_CHARACTERISTIC_5
];

// A collection of characteristic descriptors for the 'random' IDs.
const RANDOM_CHARACTERISTIC_DESCRIPTORS = RANDOM_CHARACTERISTICS.map( characteristicUUID => new CharacteristicDescriptor( characteristicUUID, 'Random characteristic', true, true ) );

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
    [ new CharacteristicDescriptor( MICROBIT_IO_PIN_CHARACTERISTIC, 'micro:bit IO pin', true, false ) ]
  ],
  [
    new ServiceDescriptor( MICROBIT_EVENT_SERVICE, 'micro:bit events' ),
    [ new CharacteristicDescriptor( MICROBIT_EVENT_CHARACTERISTIC, 'micro:bit event', true, false ) ]
  ],
  [
    new ServiceDescriptor( MICROBIT_UART_SERVICE, 'micro:bit UART' ),
    [
      new CharacteristicDescriptor( MICROBIT_UART_RX_CHARACTERISTIC, 'micro:bit RX (write to micro:bit)', false, true ),
      new CharacteristicDescriptor( MICROBIT_UART_TX_CHARACTERISTIC, 'micro:bit TX (read from micro:bit)', true, false )
    ]
  ],
  [
    new ServiceDescriptor( RANDOM_SERVICE_1, 'Random service 1' ),
    RANDOM_CHARACTERISTIC_DESCRIPTORS
  ],
  [
    new ServiceDescriptor( RANDOM_SERVICE_2, 'Random service 2' ),
    RANDOM_CHARACTERISTIC_DESCRIPTORS
  ],
  [
    new ServiceDescriptor( RANDOM_SERVICE_3, 'Random service 3' ),
    RANDOM_CHARACTERISTIC_DESCRIPTORS
  ],
  [
    new ServiceDescriptor( RANDOM_SERVICE_4, 'Random service 4' ),
    RANDOM_CHARACTERISTIC_DESCRIPTORS
  ],
  [
    new ServiceDescriptor( RANDOM_SERVICE_5, 'Random service 5' ),
    RANDOM_CHARACTERISTIC_DESCRIPTORS
  ]
] );


const bluetoothServiceData = {

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
  serviceDescriptorToCharacteristicDescriptorMap: SERVICE_DESCRIPTOR_TO_CHARACTERISTIC_DESCRIPTOR_MAP
};

export default bluetoothServiceData;