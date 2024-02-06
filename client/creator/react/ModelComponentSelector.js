import React, { useState } from 'react';
import Col from 'react-bootstrap/Col';
import Container from 'react-bootstrap/Container';
import Form from 'react-bootstrap/Form';
import Modal from 'react-bootstrap/Modal';
import Row from 'react-bootstrap/Row';
import NamedBooleanProperty from '../model/NamedBooleanProperty.js';
import NamedBounds2Property from '../model/NamedBounds2Property.js';
import NamedDerivedProperty from '../model/NamedDerivedProperty.js';
import NamedEnumerationProperty from '../model/NamedEnumerationProperty.js';
import NamedNumberProperty from '../model/NamedNumberProperty.js';
import NamedObservableArray from '../model/NamedObservableArray.js';
import NamedStringProperty from '../model/NamedStringProperty.js';
import NamedVector2Property from '../model/NamedVector2Property.js';
import styles from './../CreatorMain.css';
import StyledButton from './StyledButton.js';

export default function ModelComponentSelector( props ) {

  // All possible model components in the project.
  const allModelComponents = props.allModelComponents;

  // The selected components for the component being worked on.
  const selectedModelComponents = props.selectedModelComponents;

  // If true, the dependency/reference switch will not be shown.
  const hideDependencyControl = props.hideDependencyControl || false;

  if ( !hideDependencyControl ) {
    if ( !props.referenceComponentNames ) {
      throw new Error( 'If reference controls are available, referenceComponentNames are required.' );
    }
  }

  // A sub-list from selectedModelComponents that will be used to
  const referenceComponentNames = props.referenceComponentNames;

  const [ showingDialog, setShowingDialog ] = useState( false );

  // A function to be called whenever any checkbox changes.
  const handleChange = props.handleChange || ( () => {} );

  const handleRemoveComponent = component => {

    // remove from the list of components
    const componentsCopy = selectedModelComponents.slice();
    const index = componentsCopy.indexOf( component );
    if ( index < 0 ) { throw new Error( 'This component was not in the list...' ); }
    componentsCopy.splice( index, 1 );

    if ( referenceComponentNames ) {

      // If this component supports reference connections, we need to remove the component from the list
      // of reference components if it is there.
      const referenceCopy = referenceComponentNames.slice();
      const referenceIndex = referenceCopy.indexOf( component.nameProperty.value );
      if ( referenceIndex >= 0 ) {
        referenceCopy.splice( referenceIndex, 1 );
      }

      handleChange( componentsCopy, referenceCopy );
    }
    else {

      // No support for reference components, just update the list of selected components.
      handleChange( componentsCopy, null );
    }
  };

  // Adds a component to the list of reference components for connections to this component.
  const addReferenceComponent = componentName => {

    assert && assert( referenceComponentNames, 'Reference component names are required for this operation.' );
    const referenceCopy = referenceComponentNames.slice();
    referenceCopy.push( componentName );

    handleChange( selectedModelComponents, referenceCopy );
  };

  // Removes a component from the list of reference components for connections to this component.
  const removeReferenceComponent = componentName => {

    assert && assert( referenceComponentNames, 'Reference component names are required for this operation.' );
    const referenceCopy = referenceComponentNames.slice();
    const index = referenceCopy.indexOf( componentName );

    assert && assert( index >= 0, 'This component was not in the list of reference components.' );
    referenceCopy.splice( index, 1 );

    handleChange( selectedModelComponents, referenceCopy );
  };

  return (
    <>
      <SelectComponentsDialog
        showing={showingDialog}
        setShowing={setShowingDialog}
        allModelComponents={allModelComponents}
        selectedModelComponents={selectedModelComponents}
        handleChange={handleChange}
      ></SelectComponentsDialog>
      <div>
        <h3>Connections</h3>
        <p className={`${styles.controlElement} ${styles.largerText}`}>{props.componentsPrompt}</p>

        <SelectedComponentsList
          selectedModelComponents={selectedModelComponents}
          handleRemoveComponent={handleRemoveComponent}
          hideDependencyControl={hideDependencyControl}
          addReferenceComponent={addReferenceComponent}
          removeReferenceComponent={removeReferenceComponent}
          getCurrentReferenceComponentNames={() => referenceComponentNames || []}
        ></SelectedComponentsList>

        <StyledButton
          onClick={() => {
            setShowingDialog( true );
          }}
          name={'Add Components'}
        >
        </StyledButton>
      </div>
    </>
  );
}

/**
 * A component that displays a list of selected components.
 * @param props
 * @return {*}
 * @constructor
 */
function SelectedComponentsList( props ) {
  const selectedComponents = props.selectedModelComponents;

  // Callbacks that will add/remove a reference component from the list - optional because
  // not all components support reference connections.
  const addReferenceComponent = props.addReferenceComponent || ( () => {} );
  const removeReferenceComponent = props.removeReferenceComponent || ( () => {} );

  const getCurrentReferenceComponentNames = props.getCurrentReferenceComponentNames || ( () => [] );

  // alphabetize the selectedComponents by name so that they appear in consistent order as you add/remove
  // them
  const sortedComponents = selectedComponents.slice().sort( ( a, b ) => {
    return a.nameProperty.value.localeCompare( b.nameProperty.value );
  } );

  return (
    <>
      {sortedComponents.length > 0 && (
        <>
          <h4>Selected Components</h4>
          <Container>
            <ul>
              {
                sortedComponents.map( ( component, index ) => {
                  return (
                    <SelectedComponentListItem
                      key={`selected-component-${index}`}
                      component={component}
                      handleRemoveComponent={props.handleRemoveComponent}
                      hideDependencyControl={props.hideDependencyControl}
                      addReferenceComponent={addReferenceComponent}
                      removeReferenceComponent={removeReferenceComponent}
                      getCurrentReferenceComponentNames={getCurrentReferenceComponentNames}
                    ></SelectedComponentListItem>
                  );
                } )
              }
            </ul>
          </Container>
        </>
      )}
    </>
  );
}

/**
 * A list item for selected components, with buttons to toggle dependency type and remove this component from the list.
 */
function SelectedComponentListItem( props ) {
  const hideDependencyControl = props.hideDependencyControl || false;

  const addReferenceComponent = props.addReferenceComponent || ( () => {} );
  const removeReferenceComponent = props.removeReferenceComponent || ( () => {} );

  // Props provides a callback that will give us a reference to the current selected reference components -
  // this allows us to control the checked state of the switch with state
  const currentReferenceComponentNames = props.getCurrentReferenceComponentNames();
  const switchChecked = !currentReferenceComponentNames.includes( props.component.nameProperty.value );

  return (
    <>
      <li>
        <Row className={`${styles.alignItemsCenter}`}>
          <Col md={8} className={styles.justifyLeft}>
            <b>{props.component.nameProperty.value}</b>
          </Col>
          <Col md={3} className={styles.justifyRight}>
            {!hideDependencyControl && (
              <CustomSwitch
                labelLeft={'Reference'}
                labelRight={'Dependency'}
                componentName={props.component.nameProperty.value}
                addReferenceComponent={addReferenceComponent}
                removeReferenceComponent={removeReferenceComponent}
                checked={switchChecked}
              ></CustomSwitch>
            )
            }
          </Col>
          <Col md={1} className={styles.justifyRight}>
            <StyledButton
              onClick={() => {
                props.handleRemoveComponent( props.component );
              }}
              name={'X'}
              overrideClassName={styles.reducedVerticalPadding}
            ></StyledButton>
          </Col>
        </Row>
      </li>
    </>
  );
}

function CustomSwitch( props ) {

  const componentName = props.componentName;
  assert && assert( componentName, 'Component name is required for CustomSwitch' );

  // Callbacks that will add/remove the component from the list of reference component when
  // this switch changes. Optional because not all components support reference connections.
  const addReferenceComponent = props.addReferenceComponent || ( () => {} );
  const removeReferenceComponent = props.removeReferenceComponent || ( () => {} );

  return (
    <div className={styles.customSwitchContainer}>
      <span className={styles.labelLeft}>{props.labelLeft}</span>
      <Form.Check
        type='switch'
        id='custom-switch'
        checked={props.checked}
        label=''
        onChange={event => {

          if ( event.target.checked ) {

            // this is now a dependency component
            removeReferenceComponent( componentName );

          }
          else {

            // this is now a reference component
            addReferenceComponent( componentName );
          }

          // Eventually this is going to modify the list of reference components.
        }}
      />
      <span className={styles.labelRight}>{props.labelRight}</span>
    </div>
  );
}

function SelectComponentsDialog( props ) {

  const [ showBoolean, setShowBoolean ] = useState( true );
  const [ showNumber, setShowNumber ] = useState( true );
  const [ showPosition, setShowPosition ] = useState( true );
  const [ showString, setShowString ] = useState( true );
  const [ showEnumeration, setShowEnumeration ] = useState( true );
  const [ showDerived, setShowingDerived ] = useState( true );
  const [ showBounds, setShowingBounds ] = useState( true );
  const [ showArray, setShowingArray ] = useState( true );

  const [ searchText, setSearchText ] = useState( '' );

  const [ newSelectedComponents, setNewSelectedComponents ] = useState( [] );

  const selectedComponents = props.selectedModelComponents;
  const allComponents = props.allModelComponents;
  const handleChange = props.handleChange;

  const handleClose = () => {

    // Clear the newSelectedComponents so that it is empty for the next time this dialog is open and we don't
    // accidentally add the same components again.
    setNewSelectedComponents( [] );

    props.setShowing( false );
  };

  const handleAddComponents = () => {

    // all of the newly selected components will be added to selectedModelComponents
    const selectedComponentsCopy = selectedComponents.slice();

    // add each of the new components to the list
    newSelectedComponents.forEach( component => {

      // verify that this component is not already in the list
      if ( selectedComponentsCopy.includes( component ) ) {
        throw new Error( 'Problem adding components - this component is already in the list.' );
      }

      selectedComponentsCopy.push( component );
    } );

    // update the state - no change to the reference component names here
    handleChange( selectedComponentsCopy, null );

    // close the dialog
    handleClose();
  };

  // This dialog will only show the components that
  // 1) Are of the type that the user wants to see from the filter checkboxes.
  // 2) Has a name that matches the filter name.
  // 3) Is not already selected.
  const filteredComponents = allComponents.filter( component => {
    const isTypeMatch = (
      ( showBoolean && component instanceof NamedBooleanProperty ) ||
      ( showNumber && component instanceof NamedNumberProperty ) ||
      ( showPosition && component instanceof NamedVector2Property ) ||
      ( showString && component instanceof NamedStringProperty ) ||
      ( showEnumeration && component instanceof NamedEnumerationProperty ) ||
      ( showDerived && component instanceof NamedDerivedProperty ) ||
      ( showBounds && component instanceof NamedBounds2Property ) ||
      ( showArray && component instanceof NamedObservableArray )
    );

    // an empty string will always be a match
    const isNameMatch = component.nameProperty.value.toLowerCase().includes( searchText.toLowerCase() );
    const isSelected = selectedComponents.includes( component );
    return isTypeMatch && isNameMatch && !isSelected;
  } );

  return (
    <>
      <Modal show={props.showing} onHide={handleClose} fullscreen={true}>
        <Modal.Header className={styles.dialog}>
          <Modal.Title>{'Available Model Components'}</Modal.Title>
          <StyledButton variant='primary' onClick={handleClose} name={'X'}></StyledButton>
        </Modal.Header>
        <Modal.Body className={styles.dialog}>
          <div>
            <h4>Filters</h4>
            <Form.Group className='mb-3' controlId='component.name'>
              <Form.Label>Component Name:</Form.Label>
              <Form.Control
                type='text'
                value={searchText}
                onChange={event => { setSearchText( event.target.value ); }}
              />
            </Form.Group>
            <div>
              <ComponentTypeFilter
                showBoolean={showBoolean}
                setShowBoolean={setShowBoolean}
                showNumber={showNumber}
                setSetShowNumber={setShowNumber}
                showPosition={showPosition}
                setSetShowPosition={setShowPosition}
                showString={showString}
                setSetShowString={setShowString}
                showEnumeration={showEnumeration}
                setShowEnumeration={setShowEnumeration}
                showDerived={showDerived}
                setShowingDerived={setShowingDerived}
                showBounds={showBounds}
                setShowingBounds={setShowingBounds}
                showArray={showArray}
                setShowingArray={setShowingArray}
              ></ComponentTypeFilter>
            </div>
            <hr></hr>
            <ComponentsCheckboxList
              filteredComponents={filteredComponents}
              newSelectedComponents={newSelectedComponents}
              setNewSelectedComponents={setNewSelectedComponents}
            ></ComponentsCheckboxList>
          </div>
        </Modal.Body>
        <Modal.Footer className={styles.dialog}>
          <StyledButton
            variant='primary'
            onClick={handleAddComponents}
            name={'Add Selected Components'}>
            disabled={newSelectedComponents.length === 0}
          </StyledButton>
        </Modal.Footer>
      </Modal>
    </>
  );
}

function FilterCheckbox( props ) {
  return (
    <>
      <Col>
        <Form.Check
          type='checkbox'
          checked={props.checked}
          onChange={event => {
            props.handleCheckboxChange( event );
          }}
          id={`filter-checkbox-${props.label}`}
          label={props.label}
        />
      </Col>
    </>
  );
}

function ComponentTypeFilter( props ) {
  return (
    <>
      <Row>
        <FilterCheckbox label='Boolean' checked={props.showBoolean} handleCheckboxChange={event => {
          props.setShowBoolean( event.target.checked );
        }}></FilterCheckbox>
        <FilterCheckbox label='Number' checked={props.showNumber} handleCheckboxChange={event => {
          props.setSetShowNumber( event.target.checked );
        }}></FilterCheckbox>
        <FilterCheckbox label='Position' checked={props.showPosition} handleCheckboxChange={event => {
          props.setSetShowPosition( event.target.checked );
        }}></FilterCheckbox>
        <FilterCheckbox label='String' checked={props.showString} handleCheckboxChange={event => {
          props.setSetShowString( event.target.checked );
        }}></FilterCheckbox>
      </Row>
      <Row>
        <FilterCheckbox label='Enumeration' checked={props.showEnumeration} handleCheckboxChange={event => {
          props.setShowEnumeration( event.target.checked );
        }}></FilterCheckbox>
        <FilterCheckbox label='Derived' checked={props.showDerived} handleCheckboxChange={event => {
          props.setShowingDerived( event.target.checked );
        }}></FilterCheckbox>
        <FilterCheckbox label='Bounds' checked={props.showBounds} handleCheckboxChange={event => {
          props.setShowingBounds( event.target.checked );
        }}></FilterCheckbox>
        <FilterCheckbox label='Array' checked={props.showArray} handleCheckboxChange={event => {
          props.setShowingArray( event.target.checked );
        }}></FilterCheckbox>
      </Row>
    </>
  );
}

/**
 * The columns of checkboxes for components that are available to select.
 * @constructor
 */
function ComponentsCheckboxList( props ) {
  const filteredComponents = props.filteredComponents;

  // state from the parent
  const newSelectedComponents = props.newSelectedComponents; // the state value itself
  const setNewSelectedComponents = props.setNewSelectedComponents; // a function to update the state

  // If a checkbox is checked, add the component to the list of newSelectedComponents - if unchecked, remove it.
  const handleCheckboxChange = ( event, namedProperty ) => {

    // A copy so that we can work with React state.
    const arrayCopy = newSelectedComponents.slice();

    if ( event.target.checked ) {
      arrayCopy.push( namedProperty );
    }
    else {
      const index = arrayCopy.indexOf( namedProperty );
      if ( index < 0 ) { throw new Error( 'Problem selecting dependencies...' ); }
      arrayCopy.splice( index, 1 );
    }

    setNewSelectedComponents( arrayCopy );
  };

  return (
    <>
      <h4>Components</h4>
      <Container>
        <>
          {
            filteredComponents.map( ( component, index ) => {
              if ( index % 3 === 0 ) {
                const nextThreeComponents = filteredComponents.slice( index, index + 3 );

                // We will fill the array with entries for layout so that the row is full, even
                // if there isn't a component to render in that column
                while ( nextThreeComponents.length < 3 ) {
                  nextThreeComponents.push( undefined );
                }

                return (
                  <Row key={`component-checkbox-row-${index}`}>
                    {
                      nextThreeComponents.map( ( innerComponent, innerIndex ) => {
                        return (
                          <Col key={`inner-row-${innerIndex}`}>
                            {innerComponent ?
                             <Form.Check
                               type={'checkbox'}
                               id={`dependency-checkbox-${index}-${innerIndex}`}
                               label={innerComponent.nameProperty.value}
                               onChange={event => {
                                 handleCheckboxChange( event, innerComponent );
                               }}
                             /> : ''
                            }
                          </Col>
                        );
                      } )
                    }
                  </Row>
                );
              }
              else {
                return '';
              }
            } )
          }
        </>
      </Container>
    </>
  );
}