/**
 * Manages the bluetooth servers that are available to the user. The user will make a request to connect to a device.
 * On connection, we will connect to the device's GATT server. The server is then added to this list, and
 * then specific services and characteristics can be accessed from paper program code.
 */
import paperLand from './paperLand.js';

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

const SERVICE_TO_CHARACTERISTIC_MAP = new Map( [
  [ MICROBIT_TEMPERATURE_SERVICE, [ MICROBIT_TEMPERATURE_CHARACTERISTIC ] ],
  [ MICROBIT_ACCELEROMETER_SERVICE, [ MICROBIT_ACCELEROMETER_CHARACTERISTIC ] ],
  [ MICROBIT_BUTTON_SERVICE, [ MICROBIT_BUTTON_A_CHARACTERISTIC, MICROBIT_BUTTON_B_CHARACTERISTIC ] ],
  [ MICROBIT_LED_SERVICE, [ MICROBIT_LED_MATRIX_CHARACTERISTIC, MICROBIT_LED_TEXT_CHARACTERISTIC ] ],
  [ MICROBIT_MAGNETOMETER_SERVICE, [ MICROBIT_MAGNETOMETER_CHARACTERISTIC ] ],
  [ MICROBIT_IO_PIN_SERVICE, [ MICROBIT_IO_PIN_CHARACTERISTIC ] ],
  [ MICROBIT_EVENT_SERVICE, [ MICROBIT_EVENT_CHARACTERISTIC ] ],
  [ RANDOM_SERVICE_1, RANDOM_CHARACTERISTICS ],
  [ RANDOM_SERVICE_2, RANDOM_CHARACTERISTICS ],
  [ RANDOM_SERVICE_3, RANDOM_CHARACTERISTICS ],
  [ RANDOM_SERVICE_4, RANDOM_CHARACTERISTICS ],
  [ RANDOM_SERVICE_5, RANDOM_CHARACTERISTICS ]
] );

// The list of all available services
const SERVICES = SERVICE_TO_CHARACTERISTIC_MAP.keys();

const boardBluetoothServers = {

  // The list of all available services
  services: SERVICES,

  // Maps available services to their BLE characteristics. When the user selects a service, only the related
  // characteristics will be shown for a bluetooth component.
  serviceToCharacteristicMap: SERVICE_TO_CHARACTERISTIC_MAP,

  /**
   * The list of servers that are available to the user. Maps a bluetooth device to a GATT server.
   * This way we can remove all servers when a device disconnects. Only one server per device.
   */
  deviceServerMap: new Map(),

  /**
   * Adds a server to the list of available servers.
   * @param {BluetoothDevice} device
   * @param {BluetoothRemoteGATTServer} server
   */
  addServer( device, server ) {
    this.deviceServerMap.set( device, server );
  },

  /**
   * Remove the server associated with the provided device.
   * @param device
   */
  clearServerForDevice( device ) {
    this.deviceServerMap.delete( device );
  },

  /**
   * Get the server associated with the provided device.
   */
  getServerForDevice( device ) {
    return this.deviceServerMap.get( device );
  },

  /**
   * Get the characteristic for the specified service and characteristic UUIDs. This will search through all
   * connected servers until it finds the correct service and characteristic. Pulled out in case we want to
   * retry connecting to a characteristic if the first attempt fails (but that hasn't seemed necessary yet).
   */
  async makeAttemptToGetCharacteristic( serviceUUID, characteristicUUID ) {
    for ( let [ device, server ] of phet.paperLand.boardBluetoothServers.deviceServerMap ) {
      try {
        const service = await server.getPrimaryService( serviceUUID );
        return await service.getCharacteristic( characteristicUUID );
      }
      catch( error ) {
        // Continue trying with the next server instead of immediately throwing
      }
    }
  },

  /**
   * Get the characteristic for the specified service and characteristic UUIDs. This will search through all
   * connected servers until it finds the correct service and characteristic.
   * @returns {Promise<*>}
   */
  async getServiceCharacteristic( serviceUUID, characteristicUUID ) {
    const characteristic = await this.makeAttemptToGetCharacteristic( serviceUUID, characteristicUUID );
    if ( characteristic ) {
      return characteristic;
    }
    throw new Error( `No connected bluetooth server has the specified service: ${serviceUUID}` );
  },

  /**
   * Gets a notification abstraction for a bluetooth characteristic. Lets you add an event listener that
   * will be called when the value of the characteristic changes.
   * @param serviceUUID
   * @param characteristicUUID
   * @returns {Promise<*>}
   */
  async getServiceCharacteristicNotifier( serviceUUID, characteristicUUID ) {
    const characteristic = await this.getServiceCharacteristic( serviceUUID, characteristicUUID );
    return characteristic.startNotifications().catch( error => {
      phet.paperLand.console.error( error, 'Please try refreshing the page.' );
    } );
  },

  /**
   * Add an event listener to a changing BLE characteristic.
   * @param serviceUUID - The UUID of the service that the characteristic belongs to.
   * @param characteristicUUID - The UUID of the characteristic that you want to listen to.
   * @param listener - Called with the value whenever the characteristic changes. Remember value is encoded,
   *                   (call getFloat32, getUint8, etc. on the DataView object to get the actual value).
   * @returns {Promise<()=>void>} - The callback added to the event, returned so it can be removed.
   */
  async addCharacteristicListener( serviceUUID, characteristicUUID, listener ) {

    const characteristicListener = event => {
      listener( event.target.value );
    };

    const characteristic = await this.getServiceCharacteristicNotifier( serviceUUID, characteristicUUID );
    characteristic.addEventListener( 'characteristicvaluechanged', characteristicListener );

    phet.paperLand.console.log( 'Successful connection to device characteristic.' );

    return characteristicListener;
  },

  async removeCharacteristicListener( serviceUUID, characteristicUUID, listener ) {
    const characteristic = await this.getServiceCharacteristic( serviceUUID, characteristicUUID );
    characteristic.removeEventListener( 'characteristicvaluechanged', listener );
  }
};

// Assign to the namespace so that the available servers can be accessed from the paper program code.
paperLand.boardBluetoothServers = boardBluetoothServers;

// This will be used from paper program code, but be sure to import in an entry file so that it is available.
export default boardBluetoothServers;