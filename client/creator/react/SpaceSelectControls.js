import React, { useEffect, useState } from 'react';
import Col from 'react-bootstrap/Col';
import Container from 'react-bootstrap/Container';
import Form from 'react-bootstrap/Form';
import Row from 'react-bootstrap/Row';
import xhr from 'xhr';
import { getApiUrl, isValidProjectName } from '../../utils.js';
import styles from './../CreatorMain.css';
import StyledButton from './StyledButton.js';

const SpaceSelectControls = props => {
  const model = props.creatorModel;

  const [ availableSpaces, setAvailableSpaces ] = useState( [] );
  const [ selectedSpaceName, setSelectedSpaceName ] = useState( '' );
  const [ creatingNewProject, setCreatingNewProject ] = useState( false );
  const [ newProjectName, setNewProjectName ] = useState( '' );
  const [ selectedProjectName, setSelectedProjectName ] = useState( '' );
  const [ availableProjects, setAvailableProjects ] = useState( [] );

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

          // FOR DEBUGGING - initialize to jg-tests with project lab
          if ( window.dev ) {
            setTimeout( () => {
              setSelectedSpaceName( 'creator-tests' );

              setTimeout( () => {
                setSelectedProjectName( 'upload-test' );
              }, 500 );
            }, 500 );
          }
        }
      }
    } );
  }, [] );

  // When the space changes, update the state of whether it is restricted.
  useEffect( () => {

    // Set the enableEdit when the axon Property for project name changes
    const spaceNameListener = spaceName => {
      if ( !spaceName ) {
        return;
      }

      // use the API to determine if the project name is restricted
      const url = getApiUrl( spaceName, '/restricted' );
      xhr.get( url, { json: true }, ( error, response ) => {
        if ( error ) {
          console.error( 'Error retrieving whether space is restricted.' );
        }
        else {

          // Update the axon Model when the user requests a new space from React
          model.spaceRestrictedProperty.value = response.body.restricted;
        }
      } );
    };
    model.spaceNameProperty.link( spaceNameListener );

    return function cleanup() {
      model.spaceNameProperty.unlink( spaceNameListener );
    };
  } );

  // Update state to include the list of available projects.
  const updateProjectNames = () => {
    if ( selectedSpaceName ) {
      const projectsList = new URL( `api/creator/projectNames/${selectedSpaceName}`, window.location.origin ).toString();
      xhr.get( projectsList, { json: true }, ( error, response ) => {
        if ( error ) {
          console.error( error );
        }
        else {
          if ( Array.isArray( response.body.projectNames ) ) {
            setAvailableProjects( response.body.projectNames );
          }
        }
      } );
    }
    else {
      setAvailableProjects( [] );
    }
  };

  // Handle a request to delete a project.
  const handleProjectDelete = () => {
    if ( selectedSpaceName && selectedSpaceName ) {
      xhr.get(
        new URL( `api/creator/${selectedSpaceName}/delete/${selectedProjectName}`, window.location.origin ).toString(),
        {
          json: {}
        },
        ( error, response ) => {
          if ( error ) {
            console.log( 'Error deleting project: ' + error );
          }
          else {
            updateProjectNames();
            setSelectedProjectName( '' );
          }
        }
      );
    }
  };

  // Whenever the selectedSpaceName changes, make a request to the database to get existing projects for that space.
  useEffect( () => {
    updateProjectNames();

    // Notify the scenery side that the space has changed.
    model.spaceNameProperty.value = selectedSpaceName;
  }, [ selectedSpaceName ] );

  // Whenever the project name changes, notify scenery side that there is a new project.
  useEffect( () => {
    model.projectNameProperty.value = selectedProjectName;
  }, [ selectedProjectName ] );

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
                setSelectedProjectName( '' );
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
              <h2>Project Name:</h2>
              <Form.Select
                name='spaces'
                id='spaces'
                value={selectedProjectName}
                onChange={event => {
                  setSelectedProjectName( event.target.value );
                }}
              >
                <option value={''}>Select Project</option>
                {availableProjects.map( ( option, index ) => {
                  return <option key={index} value={option}>
                    {option}
                  </option>;
                } )}
              </Form.Select>
              {
                creatingNewProject ? (
                  <div className={styles.controlElement}>
                    <Form onSubmit={event => {
                      event.preventDefault();

                      if ( selectedSpaceName && isValidProjectName( newProjectName, availableProjects ) ) {

                        // name valid, create a new one in the db
                        xhr.post( new URL( `api/creator/projectNames/${selectedSpaceName}/${newProjectName}`, window.location.origin ).toString(), { json: true }, ( error, response ) => {
                          if ( error ) {
                            console.error( error );
                          }
                          else {

                            // on success, update project names with the new UI
                            updateProjectNames();

                            // use the new project
                            setSelectedProjectName( newProjectName );
                          }
                        } );
                      }
                      setCreatingNewProject( false );
                    }}>
                      <label>
                        Name:&nbsp;
                        <input
                          type='text'
                          onChange={event => { setNewProjectName( event.target.value ); }}
                        />
                      </label>
                      <br/>
                      <Row>
                        <Col>
                          <StyledButton name={'Confirm'} type='submit'></StyledButton>
                        </Col>
                        <Col>
                          <StyledButton name={'Cancel'} onClick={() => setCreatingNewProject( false )}></StyledButton>
                        </Col>
                      </Row>
                    </Form>
                  </div>
                ) : <Row>
                  <Col>
                    <StyledButton
                      name={'New Project'}
                      disabled={!props.enableEdit}
                      onClick={() => setCreatingNewProject( true )}
                    ></StyledButton>
                  </Col>
                  <Col>
                    <StyledButton
                      name={'Delete Project'}
                      disabled={!props.enableEdit}
                      hidden={!selectedProjectName}
                      onClick={handleProjectDelete}
                    ></StyledButton>
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