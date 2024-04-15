/**
 * A type that describes a bluetooth characteristic. Gives us details about the characteristic if available,
 * like the name, whether it can be read from, and whether it can be written to.
 */
export default class CharacteristicDescriptor {

  /**
   * @param characteristicUUID - the unique ID for this bluetooth characteristic
   * @param name - the name of the characteristic (human readable for the interface)
   * @param read - whether the characteristic can be read from
   * @param write - whether the characteristic can be written to
   */
  constructor( characteristicUUID, name, read, write ) {
    this.characteristicUUID = characteristicUUID;
    this.name = name;
    this.read = read;
    this.write = write;
  }
}