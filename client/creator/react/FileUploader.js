import React, { useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import xhr from 'xhr';
import styles from './../CreatorMain.css';

export default function FileUploader( props ) {

  // 'image' | 'sound'
  const fileType = props.fileType;
  if ( fileType !== 'image' && fileType !== 'sound' ) {
    throw new Error( 'Invalid fileType: ' + fileType );
  }

  const uploadUrlPath = fileType === 'image' ? 'api/creator/uploadImage' : 'api/creator/uploadSound';
  const uploadUrl = new URL( uploadUrlPath, window.location.origin ).toString();

  const handleNewUpload = props.handleNewUpload || ( () => {} );

  const onDrop = useCallback( acceptedFiles => {
    const formData = new FormData();
    formData.append( 'file', acceptedFiles[ 0 ] );

    xhr.post( uploadUrl, { body: formData }, ( error, response ) => {
      if ( error ) {
        console.error( error );
      }
      else {
        if ( response.body ) {
          const bodyObject = JSON.parse( response.body );
          const fileNameKey = fileType === 'image' ? 'imageFileName' : 'soundFileName';
          if ( bodyObject && bodyObject[ fileNameKey ] ) {
            handleNewUpload( bodyObject[ fileNameKey ] );
          }
        }
      }
    } );

    // it is important to update this callback when props change to avoid a stale closure!
  }, [ uploadUrl, fileType, handleNewUpload ] );

  const hintContent = props.hint || 'Drag \'n\' drop a file here, or click to select a file.';

  const { getRootProps, getInputProps } = useDropzone( {
    onDrop: onDrop,
    accept: fileType === 'image' ? 'image/*' : 'audio/*',
    maxFiles: 1
  } );

  return (
    <div className={styles.dropZoneContainer}>
      <div className={styles.dropZone}>
        <div {...getRootProps()}>
          <input {...getInputProps()} />
          {
            <p>{hintContent}</p>
          }
        </div>
      </div>
    </div>
  );
}