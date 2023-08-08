import { useEffect, useState } from 'react';

/**
 * Verify that every key in the base object is present in the testing object.
 * @param templateObject - object with required keys
 * @param testingObject - object you want to verify
 * @return {*}
 */
const verifyRequiredKeys = ( templateObject, testingObject ) => {

  // Get the keys from the template object
  const templateKeys = Object.keys( templateObject );

  // Check if every key in the template exists in the other object
  for ( const requiredKey of templateKeys ) {
    if ( !( requiredKey in testingObject ) ) {
      return false;
    }
  }

  return true;
};

const validateData = ( templateObject, testObject ) => {
  if ( !verifyRequiredKeys( templateObject, testObject ) ) {
    debugger;
    throw new Error( 'New data does not match the schema of the component.' );
  }
};

const useEditableForm = ( activeEdit, isFormValid, getFormData, ComponentClass ) => {

  if ( !ComponentClass.getStateSchema ) {
    throw new Error( 'ComponentClass must have a static getStateSchema function to define the component schema' );
  }
  const componentStateSchema = ComponentClass.getStateSchema();

  const [ formData, setFormData ] = useState( componentStateSchema );

  // // Update form to saved state whenever the active edit changes.
  useEffect( () => {
    if ( activeEdit.component instanceof ComponentClass ) {
      const serialized = activeEdit.component.save();
      validateData( componentStateSchema, serialized );
      setFormData( serialized );
    }
  }, [ activeEdit ] );

  const handleChange = newData => {

    // So that the client doesn't have to provide every key, we merge the change into the previous state
    const totalData = { ...formData, ...newData };

    // Make sure that the change function provided the correct data for this component
    validateData( componentStateSchema, totalData );
    setFormData( totalData );

    // TODO: Other validation logic here
    const defined = Object.values( totalData ).every( val => val !== '' );

    isFormValid( defined );
    getFormData( totalData );
  };

  return [ formData, handleChange ];
};

export default useEditableForm;