import React, { useEffect, useState } from 'react';
import Col from 'react-bootstrap/Col';
import Container from 'react-bootstrap/Container';
import Form from 'react-bootstrap/Form';
import Row from 'react-bootstrap/Row';
import xhr from 'xhr';
import { isValidSystemName } from '../../utils.js';
import styles from './../CreatorMain.css';
import StyledButton from './StyledButton.js';

const SpaceSelectControls = props => {
  const model = props.creatorModel;

  const [ availableSpaces, setAvailableSpaces ] = useState( [] );
  const [ selectedSpaceName, setSelectedSpaceName ] = useState( '' );
  const [ creatingNewSystem, setCreatingNewSystem ] = useState( false );
  const [ newSystemName, setNewSystemName ] = useState( '' );
  const [ selectedSystemName, setSelectedSystemName ] = useState( '' );
  const [ availableSystems, setAvailableSystems ] = useState( [] );

  // Only called on mount, gets the list of available spaces.
  useEffect( () => {

    // Get the list of available programs once
    const spacesListUrl = new URL( 'api/spaces-list', window.location.origin ).toString();
    xhr.get( spacesListUrl, { json: true }, ( error, response ) => {
      if ( error ) {
        console.error( error );
      }
      else {
        if ( Array.isArray( response.body ) ) {
          setAvailableSpaces( response.body );
        }
      }
    } );
  }, [] );

  // Update state to include the list of available systems.
  const updateSystemNames = () => {
    if ( selectedSpaceName ) {
      const systemsList = new URL( `api/creator/systemNames/${selectedSpaceName}`, window.location.origin ).toString();
      xhr.get( systemsList, { json: true }, ( error, response ) => {
        if ( error ) {
          console.error( error );
        }
        else {
          if ( Array.isArray( response.body.systemNames ) ) {
            setAvailableSystems( response.body.systemNames );
          }
        }
      } );
    }
    else {
      setAvailableSystems( [] );
    }
  };

  // Handle a request to delete a system.
  const handleSystemDelete = () => {
    if ( selectedSpaceName && selectedSpaceName ) {
      xhr.get(
        new URL( `api/creator/${selectedSpaceName}/delete/${selectedSystemName}`, window.location.origin ).toString(),
        {
          json: {}
        },
        ( error, response ) => {
          if ( error ) {
            console.log( 'Error deleting system: ' + error );
          }
          else {
            updateSystemNames();
            setSelectedSystemName( '' );
          }
        }
      );
    }
  };

  // Whenever the selectedSpaceName changes, make a request to the database to get existing systems for that space.
  useEffect( () => {
    updateSystemNames();

    // Notify the scenery side that the space has changed.
    model.spaceNameProperty.value = selectedSpaceName;
  }, [ selectedSpaceName ] );

  // Whenever the system name changes, notify scenery side that there is a new system.
  useEffect( () => {
    model.systemNameProperty.value = selectedSystemName;
  }, [ selectedSystemName ] );

  return (
    <div>
      <Container>
        <Row>
          <Col>
            <h2>Space Name:</h2>
            <Form.Select
              name='spaces'
              id='spaces'
              size='lg'
              value={selectedSpaceName}
              onChange={event => {
                setSelectedSpaceName( event.target.value );
                setSelectedSystemName( '' );
              }}
            >
              <option>Select Space</option>
              {availableSpaces.map( ( option, index ) => {
                return <option key={index}>
                  {option}
                </option>;
              } )}
            </Form.Select>
          </Col>
          <Col>
            <Col>
              <h2>System Name:</h2>
              <Form.Select
                name='spaces'
                id='spaces'
                value={selectedSystemName}
                onChange={event => {
                  setSelectedSystemName( event.target.value );
                }}
              >
                <option value={''}>Select System</option>
                {availableSystems.map( ( option, index ) => {
                  return <option key={index} value={option}>
                    {option}
                  </option>;
                } )}
              </Form.Select>
              {
                creatingNewSystem ? (
                  <div className={styles.controlElement}>
                    <Form onSubmit={event => {
                      event.preventDefault();

                      if ( selectedSpaceName && isValidSystemName( newSystemName, availableSystems ) ) {

                        // name valid, create a new one in the db
                        xhr.post( new URL( `api/creator/systemNames/${selectedSpaceName}/${newSystemName}`, window.location.origin ).toString(), { json: true }, ( error, response ) => {
                          if ( error ) {
                            console.error( error );
                          }
                          else {

                            // on success, update system names with the new UI
                            updateSystemNames();

                            // use the new system
                            setSelectedSystemName( newSystemName );
                          }
                        } );
                      }
                      setCreatingNewSystem( false );
                    }}>
                      <label>
                        Name:&nbsp;
                        <input
                          type='text'
                          onChange={event => { setNewSystemName( event.target.value ); }}
                        />
                      </label>
                      <br/>
                      <Row>
                        <Col>
                          <StyledButton name={'Confirm'} type='submit'></StyledButton>
                        </Col>
                        <Col>
                          <StyledButton name={'Cancel'} onClick={() => setCreatingNewSystem( false )}></StyledButton>
                        </Col>
                      </Row>
                    </Form>
                  </div>
                ) : <Row>
                  <Col>
                    <StyledButton name={'New System'} onClick={() => setCreatingNewSystem( true )}></StyledButton>
                  </Col>
                  <Col>
                    <StyledButton name={'Delete System'} hidden={!selectedSystemName} onClick={handleSystemDelete}></StyledButton>
                  </Col>
                </Row>
              }
            </Col>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default SpaceSelectControls;