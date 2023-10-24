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

  // All spaces available in the project
  const [ availableSpaces, setAvailableSpaces ] = useState( [] );

  // The list of spaces available to the user that are not restricted to them
  const [ availableUnrestrictedSpaces, setAvailableUnrestrictedSpaces ] = useState( [] );

  // The space that the user has chosen to work with projects
  const [ selectedSpaceName, setSelectedSpaceName ] = useState( '' );

  // Are we creating a new project in the selected space?
  const [ creatingNewProject, setCreatingNewProject ] = useState( false );

  // Are we about to delete an existing project?
  const [ deletingProject, setDeletingProject ] = useState( false );

  // The new project name when we are creating a new project
  const [ newProjectName, setNewProjectName ] = useState( '' );

  // The project that we are currently working with
  const [ selectedProjectName, setSelectedProjectName ] = useState( '' );

  // A list of all available projects selectedSpaceName
  const [ availableProjects, setAvailableProjects ] = useState( [] );

  // Are we currently copying a project?
  const [ copyingProject, setCopyingProject ] = useState( false );

  // While copying a project, this is where we are going to copy a project to
  const [ destinationSpaceName, setDestinationSpaceName ] = useState( '' );

  // While copying a project, this is the new name for the project
  const [ destinationProjectName, setDestinationProjectName ] = useState( '' );

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
              setSelectedSpaceName( 'jg-tests' );

              setTimeout( () => {
                setSelectedProjectName( 'text-test' );
              }, 500 );
            }, 500 );
          }
        }
      }
    } );

    // Get the list of available unrestricted spaces
    const unrestrictedSpacesUrl = new URL( 'api/spaces-list-not-restricted', window.location.origin ).toString();
    xhr.get( unrestrictedSpacesUrl, { json: true }, ( error, response ) => {
      if ( error ) {
        console.error( error );
      }
      else {
        if ( Array.isArray( response.body ) ) {
          setAvailableUnrestrictedSpaces( response.body );
        }
      }
    } );

    // When the user selects a new active edit, clear the copy form and hide it
    const activeEditListener = () => {
      if ( model.activeEditProperty.value ) {
        setCopyingProject( false );
        setDeletingProject( false );
      }
    };
    model.activeEditProperty.link( activeEditListener );

    // Unlink the listener when this component is unmounted
    return function cleanup() {
      model.activeEditProperty.unlink( activeEditListener );
    };
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
                size='lg'
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
                copyingProject ? (
                                 <div className={styles.controlElement}>
                                   <Form onSubmit={event => {
                                     event.preventDefault();
                                   }}>
                                     <Col>
                                       <label>
                                         Destination Space:
                                         <Form.Select
                                           name='destinationSpace'
                                           id='destinationSpace'
                                           value={destinationSpaceName}
                                           onChange={event => {setDestinationSpaceName( event.target.value );}}
                                         >
                                           <option value={''}>Choose a space</option>
                                           {availableUnrestrictedSpaces.map( ( option, index ) => {
                                             return <option key={index}>
                                               {option}
                                             </option>;
                                           } )}
                                         </Form.Select>
                                       </label>
                                       <div>
                                         <Form.Label htmlFor='destinationProjectName'>New project name:</Form.Label>
                                         <Form.Control
                                           id='destinationProjectName'
                                           type='text'
                                           onChange={event => { setDestinationProjectName( event.target.value ); }}
                                           value={destinationProjectName}
                                         />
                                       </div>
                                     </Col>
                                   </Form>
                                   <Row>
                                     <Col>
                                       <StyledButton
                                         disabled={!( selectedSpaceName && selectedProjectName && destinationSpaceName && destinationProjectName )}
                                         name={'Confirm'}
                                         onClick={() => {

                                           // Make the request to the server to copy this project
                                           xhr.post(
                                             new URL( `api/creator/copyProject/${selectedSpaceName}/${selectedProjectName}/${destinationSpaceName}/${destinationProjectName}`, window.location.origin ).toString(),
                                             { json: true },
                                             ( error, response ) => {
                                               if ( error ) {
                                                 alert( 'Sorry, unknown error copying project.' );
                                               }
                                               else {
                                                 if ( response.statusCode === 401 ) {
                                                   alert( 'Sorry, that space is restricted.' );
                                                 }
                                                 else if ( response.statusCode === 402 ) {
                                                   alert( 'A project with that name already exists in the destination space.' );
                                                 }
                                                 else if ( response.statusCode === 404 ) {
                                                   alert( 'That project and space could not be found.' );
                                                 }
                                                 else if ( response.statusCode === 403 ) {
                                                   alert( 'Please provide project and space names.' );
                                                 }
                                                 else if ( response.statusCode === 200 ) {

                                                   // Copy was successful, stop copying and display the new copied project
                                                   setCopyingProject( false );

                                                   // use the new project right away
                                                   setSelectedSpaceName( destinationSpaceName );
                                                   setSelectedProjectName( destinationProjectName );

                                                   // clear destination space and project names for next time
                                                   setDestinationSpaceName( '' );
                                                   setDestinationProjectName( '' );
                                                 }
                                                 else {
                                                   alert( 'Sorry, Unknown error copying project.' );
                                                 }
                                               }
                                             } );
                                         }}></StyledButton>
                                     </Col>
                                     <Col>
                                       <StyledButton name={'Cancel'} onClick={() => setCopyingProject( false )}></StyledButton>
                                     </Col>
                                   </Row>
                                 </div>
                               ) :
                deletingProject ? (
                                  <div className={styles.controlElement}>
                                    <p>Are you sure you want to delete this project?</p>
                                    <Row>
                                      <Col>
                                        <StyledButton
                                          name={'Confirm'}
                                          onClick={() => {
                                            handleProjectDelete();
                                            setDeletingProject( false );
                                          }}
                                        ></StyledButton>
                                      </Col>
                                      <Col>
                                        <StyledButton
                                          name={'Cancel'}
                                          onClick={() => setDeletingProject( false )}
                                        ></StyledButton>
                                      </Col>
                                    </Row>
                                  </div>
                                ) :
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

                                               // on success, update project names with the new UI and go right to it
                                               updateProjectNames();
                                               setSelectedProjectName( newProjectName );
                                             }
                                           } );

                                           setCreatingNewProject( false );
                                         }
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
                                   ) :
                <Row>
                  <Col>
                    <StyledButton
                      name={'New Project'}
                      disabled={!props.enableEdit}
                      hidden={!selectedSpaceName}
                      onClick={() => setCreatingNewProject( true )}
                    ></StyledButton>
                  </Col>
                  <Col>
                    <StyledButton
                      name={'Copy Project'}
                      hidden={!selectedProjectName}
                      onClick={() => {
                        setCopyingProject( true );

                        // When we start to copy a project, clear the active edit if there is one
                        model.activeEditProperty.value = null;
                      }}
                    ></StyledButton>
                  </Col>
                  <Col>
                    <StyledButton
                      name={'Delete Project'}
                      disabled={!props.enableEdit}
                      hidden={!selectedProjectName}
                      onClick={() => setDeletingProject( true )}
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