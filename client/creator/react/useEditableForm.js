import { useEffect, useState } from 'react';

const verifyMatchingKeys = ( object1, object2 ) => {
  const object1Keys = Object.keys( object1 );
  const object2Keys = Object.keys( object2 );

  return object1Keys.every( key => object2Keys.includes( key ) );
};

const useEditableForm = ( activeEdit, isFormValid, getFormData, ComponentClass ) => {
  const initialState = ComponentClass.getInitialState();

  const [ formData, setFormData ] = useState( initialState );

  useEffect( () => {
    if ( activeEdit && activeEdit.component && activeEdit.component instanceof ComponentClass ) {
      const serialized = activeEdit.component.save();
      setFormData( serialized );
    }
  }, [ activeEdit ] );

  getFormData( initialState );

  const handleChange = newData => {

    if ( !verifyMatchingKeys( newData, initialState ) ) {
      throw new Error( 'New data does not match the schema of the component.' );
    }
    setFormData( newData );

    // TODO: Other validation logic here
    const defined = Object.values( newData ).every( val => val !== '' );

    isFormValid( defined );
    getFormData( newData );
  };

  return [ formData, handleChange ];
};

export default useEditableForm;