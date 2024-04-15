/**
 * A type that describes a bluetooth service. Gives us details about the service if available, like the name.
 */
export default class ServiceDescriptor {
  constructor( serviceUUID, name ) {
    this.serviceUUID = serviceUUID;
    this.name = name;
  }
}