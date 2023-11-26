import React from 'react';
import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';
import NamedArrayItem from '../model/NamedArrayItem.js';
import styles from './../CreatorMain.css';
import StyledButton from './StyledButton.js';
import StyledSelectInput from './StyledSelectInput.js';
import StyledTextInput from './StyledTextInput.js';
import useEditableForm from './useEditableForm.js';

export default function CreateArrayItemForm( props ) {

  // props args:
  //  activeEdit: ActiveEdit
  //  isFormValid: boolean - callback that returns whether the form is valid data to the parent
  //  getFormData: function - callback that returns form data to the parent
  //  allModelComponents: ObservableArray<NamedProperty> - all model components available

  const [ formData, handleChange ] = useEditableForm(
    props.activeEdit,
    props.isFormValid,
    proposedData => {

      // TODO: Validation
      return [];
    },
    props.getFormData,
    NamedArrayItem
  );

  // When the user requests to add an entry. For now we just add a blank one.
  const handleAddEntry = event => {
    const newItem = {
      entryName: '',
      componentName: ''
    };
    handleChange( { itemSchema: [ ...formData.itemSchema, newItem ] } );
  };

  // When the user requests to delete an entry. For now we just remove the last one.
  const handleDeleteEntry = event => {
    formData.itemSchema.pop();
    handleChange( { itemSchema: formData.itemSchema } );
  };

  // Handle a change to the entry name.
  const handleNameChange = ( event, index ) => {

    // A copy because React doesn't like mutating state directly
    const newValues = formData.itemSchema.slice();

    // Update the value at the index
    const entry = newValues[ index ];
    entry.entryName = event.target.value;

    // Assign the new array to the itemSchema
    handleChange( { itemSchema: newValues } );
  };

  // Handle a change to the entry component.
  const handleComponentChange = ( event, index ) => {

    // A copy because React doesn't like mutating state directly
    const newValues = formData.itemSchema.slice();

    // Update the value at the index
    const entry = newValues[ index ];
    entry.componentName = event.target.value;

    // Assign the new array to the itemSchema
    handleChange( { itemSchema: newValues } );
  };

  const handleArrayChange = ( event, index ) => {

    // Assign the new array to the itemSchema
    handleChange( { arrayName: event.target.value } );
  };

  let activeEditModelComponents = [];
  if ( props.activeEdit && props.activeEdit.program ) {
    activeEditModelComponents = props.activeEdit.program.modelContainer.allComponents;
  }

  const allArrayComponents = props.allModelComponents.filter( component => component.propertyType === 'ObservableArray' );
  const allArrayComponentOptions = allArrayComponents.map( component => {
    return {
      value: component.nameProperty.value,
      label: component.nameProperty.value
    };
  } );

  return (
    <>
      <hr/>
      <p>Select an array. Then create an entry for each component you want in the array. Then use the component in a loop in
        custom code, accessing the component through the name used for the entry.</p>
      <p>When this program is added to the playground, the entries you provide will be added to the array.</p>
      <p>For example, create an entry called 'position' and assign a Position model component to it. Then in a loop in custom
        code you use the component in code that looks like:</p>
      <pre>
        <code>
          {`myArray.forEach( item => {
    
  // do something with item.position
  phet.paperLand.console.log( item.position );
});`}
        </code>
      </pre>
      <StyledSelectInput
        label={'Select Array'}
        value={formData.arrayName}
        options={allArrayComponentOptions}
        handleChange={handleArrayChange}/>
      <StyledButton name={'Create Entry'} onClick={handleAddEntry} otherClassNames={styles.horizontalPadding}></StyledButton>
      <StyledButton name={'Remove Entry'} onClick={handleDeleteEntry} otherClassNames={styles.horizontalPadding}></StyledButton>
      {
        formData.itemSchema.map( ( item, index ) =>
          <div key={`${index}-enum-input-parent`}>
            <SchemaItem
              index={index}
              entryName={item.entryName}
              componentName={item.componentName}
              handleNameChange={handleNameChange}
              handleComponentChange={handleComponentChange}
              modelComponents={activeEditModelComponents}/>
          </div>
        )
      }
    </>
  );
}

function SchemaItem( props ) {
  const modelComponentOptions = props.modelComponents.map( component => {
    return {
      value: component.nameProperty.value,
      label: component.nameProperty.value
    };
  } );

  return (
    <Row>
      <Col>
        <StyledTextInput
          label={'Data Name'}
          value={props.entryName}
          index={props.index}
          handleChange={props.handleNameChange}/>
      </Col>
      <Col>
        <StyledSelectInput
          label={'Select Component'}
          value={props.componentName}
          options={modelComponentOptions}
          index={props.index}
          handleChange={props.handleComponentChange}/>
      </Col>
    </Row>
  );
}