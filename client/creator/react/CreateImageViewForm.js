import React, { useEffect, useState } from 'react';
import Form from 'react-bootstrap/Form';
import ListGroup from 'react-bootstrap/ListGroup';
import xhr from 'xhr';
import ImageViewComponent from '../model/views/ImageViewComponent.js';
import styles from './../CreatorMain.css';
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
      return componentData.imageFileName.length > 0;
    },
    getFormData,
    ImageViewComponent
  );

  const [ imageFiles, setImageFiles ] = useState( [] );

  // Load image files on mounts
  useEffect( () => {
    const imageFilesListUrl = new URL( 'api/creator/imageFiles', window.location.origin ).toString();
    xhr.get( imageFilesListUrl, { json: true }, ( error, response ) => {
      if ( error ) {
        console.error( error );
      }
      else {
        if ( response.body && response.body.imageFiles ) {
          if ( Array.isArray( response.body.imageFiles ) ) {
            setImageFiles( response.body.imageFiles );
          }
        }
      }
    } );
  }, [] );

  const imageFileSelector = (
    <div>
      <Form.Label>Select image file:</Form.Label>
      <Form.Select
        onChange={event => {
          handleChange( { imageFileName: event.target.value } );
        }}
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
    </div>
  );

  const imageFunctions = (
    <div className={styles.controlElement}>
      <p>Available functions:</p>
      <ListGroup>
        <ListGroup.Item className={styles.listGroupItem}>setCenter() - Sets image center in the board, takes a Vector2 position.</ListGroup.Item>
        <ListGroup.Item className={styles.listGroupItem}>setScale() - Sets image scale.</ListGroup.Item>
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