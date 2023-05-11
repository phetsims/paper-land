/**
 * CameraSelector is a React component that presents a selector element with all available cameras and updates state
 * when the user changes the selected one.
 *
 * @author John Blanco (PhET Interactive Simulations)
 */

import React from 'react';
import Form from 'react-bootstrap/Form';

class CameraSelector extends React.Component {

  constructor( props ) {
    super( props );
    this.state = {};
  }

  /**
   * Render the component
   * @returns {JSX.Element}
   * @public
   */
  render() {

    const { selectedCameraDeviceId, availableCameras, onSelectionChanged } = this.props;

    const selectedCamera = availableCameras.find( cam => cam.deviceId === selectedCameraDeviceId );
    const selectedCameraLabel = selectedCamera ? selectedCamera.label : 'Error: Camera ID not found';

    return (
      <Form.Select
        name='cameras'
        id='cameras'
        value={selectedCameraLabel}
        onChange={onSelectionChanged}
      >
        {availableCameras.map( ( option, index ) => {
          return <option key={index}>
            {option.label}
          </option>;
        } )}
      </Form.Select>
    );
  }
}

export default CameraSelector;