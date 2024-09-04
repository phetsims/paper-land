import React, { useEffect, useState } from 'react';
import Col from 'react-bootstrap/Col';
import Form from 'react-bootstrap/Form';
import ListGroup from 'react-bootstrap/ListGroup';
import Row from 'react-bootstrap/Row';
import xhr from 'xhr';
import { formatFunctionListForPrompt } from '../../utils.js';
import ImageViewComponent from '../model/views/ImageViewComponent.js';
import ViewUnitsSelector from '../model/views/ViewUnitsSelector.js';
import styles from './../CreatorMain.css';
import FileUploader from './FileUploader.js';
import NodeComponentFunctionsList, { NODE_COMPONENT_FUNCTIONS } from './NodeComponentFunctionsList.js';
import StyledButton from './StyledButton.js';
import useEditableForm from './useEditableForm.js';
import ViewComponentControls from './ViewComponentControls.js';

// Image-specific functions available to the user.
const IMAGE_FUNCTIONS = [
  'setImage() - Sets to a new image. Takes the name of an image.'
];

export default function CreateImageViewForm( props ) {

  const getFormData = providedData => {
    props.getGeneralFormData( providedData );
    props.getImageFormData( providedData );
  };

  const [ formData, handleChange ] = useEditableForm(
    props.activeEdit,
    props.isFormValid,
    componentData => {
      if ( componentData.imageFileName.length === 0 ) {
        return [ 'No image selected.' ];
      }
      else {
        return [];
      }
    },
    getFormData,
    ImageViewComponent
  );

  const [ imageFiles, setImageFiles ] = useState( [] );

  // State controlling whether the button to delete an uploaded image is disabled. Only enabled when a image
  // in the uploads directory is selected.
  const [ deleteButtonDisabled, setDeleteButtonDisabled ] = useState( true );

  /**
   * Updates the list of available files that the user can select from. Done on mount or if
   * the user uploads a new file.
   */
  const refreshImageFiles = selectedFileName => {
    const imageFilesListUrl = new URL( 'api/creator/imageFiles', window.location.origin ).toString();
    xhr.get( imageFilesListUrl, { json: true }, ( error, response ) => {
      if ( error ) {
        console.error( error );
      }
      else {
        if ( response.body && response.body.imageFiles ) {
          if ( Array.isArray( response.body.imageFiles ) ) {
            setImageFiles( response.body.imageFiles );

            // If there is already a value for the image file name, or the active edit has one, don't overwrite it
            if ( formData.imageFileName === '' && props.activeEdit.component === null ) {
              handleChange( { imageFileName: selectedFileName || response.body.imageFiles[ 0 ] } );
            }
          }
        }
      }
    } );
  };

  // Load image files on mounts
  useEffect( () => {
    refreshImageFiles( formData.imageFileName );
  }, [] );

  // When the image file name is in the uploads directory, the delete button is enabled
  useEffect( () => {
    const enabled = formData.imageFileName && formData.imageFileName.includes( '/uploads/' );
    setDeleteButtonDisabled( !enabled );
  }, [ formData.imageFileName ] );

  // Make a request to the server to delete an image in the uploads directory. Only uploaded sounds can be deleted.
  // @param fileName - A file name like '/uploads/my-image.png'
  const deleteImage = fileName => {

    // Make sure that the fileName includes /uploads/
    if ( !fileName.includes( '/uploads/' ) ) {
      return;
    }

    // Now remove the /uploads/ string from the filename as the API does not expect it to be there.
    const modifiedFileName = fileName.replace( '/uploads/', '' );
    const deleteUrl = new URL( `api/creator/deleteImage/${modifiedFileName}`, window.location.origin ).toString();

    xhr.del( deleteUrl, { json: true }, ( error, response ) => {
      if ( error ) {
        console.log( error );
      }
      else {

        // Refresh available sound files and clear the previous selection upon success
        handleChange( { imageFileName: '' } );
        refreshImageFiles( '' );
      }
    } );
  }

  // Specific form components for the Image components - A select for the built-in images and a place to upload custom
  // files
  const imageFileSelector = (
    <div>
      <Form.Label>Select from available files:</Form.Label>
      <Row className='align-items-center'>
        <Col xs={9}>
          <Form.Select
            onChange={event => {
              handleChange( { imageFileName: event.target.value } );
            }}
            value={formData.imageFileName}
          >
            {
              imageFiles.map( ( imageFile, index ) => {
                return (
                  <option
                    key={`image-file-${index}`}
                    value={imageFile}
                  >{imageFile}</option>
                );
              } )
            }
          </Form.Select>
        </Col>
        <Col xs={3}>
          <StyledButton
            name={'Delete Image'}
            disabled={deleteButtonDisabled}
            onClick={() => {
              deleteImage( formData.imageFileName );
            }}
          ></StyledButton>
        </Col>
      </Row>
      <div className={`${styles.controlElement}`}>
        <FileUploader
          fileType='image'
          handleNewUpload={async fileName => {

            refreshImageFiles( fileName );
            handleChange( { imageFileName: fileName } );
          }}
        ></FileUploader>
      </div>
      <ViewUnitsSelector formData={formData} handleChange={handleChange}></ViewUnitsSelector>
    </div>
  );

  const imageFunctions = (
    <div className={styles.controlElement}>
      <hr/>
      <NodeComponentFunctionsList></NodeComponentFunctionsList>
      <hr/>
      <p>Image functions:</p>
      <ListGroup>
        <ListGroup.Item className={styles.listGroupItem}>setImage() - Sets to a new image. Takes the name of an image.</ListGroup.Item>
      </ListGroup>
    </div>
  );

  return (
    <div>
      <ViewComponentControls
        allModelComponents={props.allModelComponents}
        typeSpecificControls={imageFileSelector}
        typeSpecificFunctions={imageFunctions}
        isFormValid={props.isFormValid}
        formData={formData}
        handleChange={handleChange}
        functionPrompt={'Write a JavaScript function using the available variables and functions to control the image.'}
        componentsPrompt={'Add model components that will control the image.'}
        additionalControlFunctions={`${formatFunctionListForPrompt( NODE_COMPONENT_FUNCTIONS )}\n${formatFunctionListForPrompt( IMAGE_FUNCTIONS )}`}
      ></ViewComponentControls>
    </div>
  );
}