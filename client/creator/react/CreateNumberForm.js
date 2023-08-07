import React from 'react';
import Form from 'react-bootstrap/Form';
import NamedNumberProperty from '../model/NamedNumberProperty.js';
import styles from './../CreatorMain.css';
import useEditableForm from './useEditableForm.js';

export default function CreateNumberForm( props ) {
  //
  // // {ActiveEdit|null}
  // const activeEdit = props.activeEdit;
  //
  // const editingComponent = activeEdit.component;
  //
  // // value as state - default values come from the editing component
  // const [ value, setValue ] = useState( editingComponent?.defaultValue || '' );
  // const [ min, setMin ] = useState( editingComponent?.min || '' );
  // const [ max, setMax ] = useState( editingComponent?.max || '' );
  //
  // // Validate and get data whenever state changes
  // useEffect( () => {
  //   handleChange();
  // }, [ value, min, max ] );
  //
  // const handleChange = () => {
  //   const allDefined = [ value, min, max ].every( val => val !== '' );
  //   const numbers = [ value, min, max ].map( val => parseInt( val, 10 ) );
  //
  //   const defaultNumber = numbers[ 0 ];
  //   const minNumber = numbers[ 1 ];
  //   const maxNumber = numbers[ 2 ];
  //   const inRange = minNumber < defaultNumber && defaultNumber < maxNumber;
  //   props.isFormValid( allDefined && inRange );
  //   props.getFormData( { min: min, max: max, default: defaultNumber } );
  // };

  const [ formData, handleChange ] = useEditableForm(
    props.activeEdit,
    props.isFormValid,
    props.getFormData,
    NamedNumberProperty
  );

  return (
    <div>
      <Form.Group className={styles.controlElement}>
        <Form.Label>Min Value</Form.Label>
        <Form.Control
          type='number'
          value={formData.min}
          onChange={event => {
            handleChange( {
              min: event.target.value,
            } );
          }}
        />
      </Form.Group>
      <Form.Group className={styles.controlElement}>
        <Form.Label>Max Value</Form.Label>
        <Form.Control
          type='number'
          value={formData.max}
          onChange={event => {
            handleChange( {
              max: event.target.value,
            } );
          }}
        />
      </Form.Group>
      <Form.Group className={styles.controlElement}>
        <Form.Label>Default Value</Form.Label>
        <Form.Control
          type='number'
          value={formData.defaultValue}
          onChange={event => {
            handleChange( {
              default: event.target.value
            } );
          }}
        />
      </Form.Group></div>
  );
}