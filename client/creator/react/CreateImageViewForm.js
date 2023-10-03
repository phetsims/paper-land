import React, { useEffect, useState } from 'react';
import Form from 'react-bootstrap/Form';
import ListGroup from 'react-bootstrap/ListGroup';
import xhr from 'xhr';
import ImageViewComponent from '../model/views/ImageViewComponent.js';
import ViewUnitsSelector from '../model/views/ViewUnitsSelector.js';
import styles from './../CreatorMain.css';
import FileUploader from './FileUploader.js';
import NodeComponentFunctionsList from './NodeComponentFunctionsList.js';
import useEditableForm from './useEditableForm.js';
import ViewComponentControls from './ViewComponentControls.js';

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

  // Specific form components for the Image components - A select for the built-in images and a place to upload custom
  // files
  const imageFileSelector = (
    <div>
      <Form.Label>Select from available files:</Form.Label>
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
      <div className={`${styles.controlElement}`}>
        <FileUploader
          fileType='image'
          handleChange={async fileName => {
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
        functionPrompt={'Use the available functions and variables to control the image.'}
        componentsPrompt={'Function is called whenever a selected component changes.'}
      ></ViewComponentControls>
    </div>
  );
}