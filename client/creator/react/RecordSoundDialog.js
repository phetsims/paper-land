import React, { useEffect, useRef, useState } from 'react';
import Col from 'react-bootstrap/Col';
import Container from 'react-bootstrap/Container';
import Modal from 'react-bootstrap/Modal';
import Row from 'react-bootstrap/Row';
import ViewConstants from '../view/ViewConstants.js';
import styles from './../CreatorMain.css';
import StyledButton from './StyledButton.js';

const centeredColumn = 'd-flex justify-content-center';

// in seconds, the limit for the recording duration
const MAX_RECORDING_TIME = 5;

export default function RecordSoundDialog( props ) {
  const showing = props.showing;
  const setShowing = props.setShowing;

  const [ permissionGranted, setPermissionGranted ] = useState( false );
  const [ recordingComplete, setRecordingComplete ] = useState( false );
  const [ elapsedRecordingTime, setElapsedRecordingTime ] = useState( 0 );

  // A reference to an audio element, that persists across multiple renders.
  const audioRef = useRef( null );

  const handleClose = () => {

    // Other work you want to do here before closing...
    setRecordingComplete( false );
    setElapsedRecordingTime( 0 );

    // Close the dialog by updating state forwarded by the client.
    setShowing( false );
  };

  return (
    <>
      <Modal show={showing} onHide={handleClose} size='lg'>
        <Modal.Header className={`${styles.dialog} ${styles.dialogHeaderContent}`}>
          <Modal.Title>{'Record Sound'}</Modal.Title>
          <StyledButton variant='primary' onClick={handleClose} name={'X'}></StyledButton>
        </Modal.Header>
        <Modal.Body className={styles.dialog}>
          {( () => {
            if ( !permissionGranted ) {
              return <RequestPermissionContent setPermissionGranted={setPermissionGranted}/>;
            }
            else if ( !recordingComplete ) {
              return <RecordContent
                setRecordingComplete={setRecordingComplete}
                elapsedRecordingTime={elapsedRecordingTime}
                setElapsedRecordingTime={setElapsedRecordingTime}
              />;
            }
            else {
              return <EditRecordingContent
                setRecordingComplete={setRecordingComplete}
                handleClose={handleClose}
                setElapsedRecordingTime={setElapsedRecordingTime}
                audioRef={audioRef}
              />;
            }
          } )()}
        </Modal.Body>
      </Modal>
    </>
  )
}

function RequestPermissionContent( props ) {
  return (
    <>
      <p className={styles.allowMultiline}>To record sound, you must grant permission to access your microphone.</p>
      <StyledButton variant='primary' onClick={() => {

        // For now, just allow permission
        props.setPermissionGranted( true );

        // It will look something like this:
        // navigator.mediaDevices.getUserMedia( { audio: true } )
        //   .then( stream => {
        //     setPermissionGranted( true );
        //   } )
        //   .catch( error => {
        //     console.error( 'Error getting microphone access:', error );
        //   } );
      }} name={'Grant Permission'}></StyledButton>
    </>
  );
}

function RecordContent( props ) {
  const elapsedTime = props.elapsedRecordingTime;
  const setElapsedTime = props.setElapsedRecordingTime;

  const stopRecording = () => {
    setCurrentlyRecording( false );
    props.setRecordingComplete( true );
  };

  const [ currentlyRecording, setCurrentlyRecording ] = useState( false );

  // This is a simple way to update the elapsed time every second.
  // For a more accurate timer, you can use the Web Audio API.
  useEffect( () => {
    const interval = setInterval( () => {
      if ( currentlyRecording ) {
        setElapsedTime( ( prevTime ) => prevTime + 0.1 );
      }
    }, 100 );

    // Clear the interval when the component unmounts
    return () => clearInterval( interval );
  }, [ currentlyRecording ] );

  // In its own useEffect so that this update happens after the elapsed time state is fully updated.
  // Putting this check in the above useEffect can cause a memory leak.
  useEffect( () => {
    if ( elapsedTime >= MAX_RECORDING_TIME ) {
      stopRecording();
    }
  }, [ elapsedTime ] );

  return (
    <Row className='justify-content-center'>
      <Col xs='auto' className='text-center'>
        <p>{elapsedTime.toFixed( 2 )} / {MAX_RECORDING_TIME.toFixed( 2 )}</p>
        <p style={{ visibility: currentlyRecording ? 'visible' : 'hidden' }}>Recording...</p>
        {currentlyRecording ? (
          <>
            <StyledButton variant='primary' onClick={() => {
              stopRecording();
            }} name={'Stop Recording'}></StyledButton>
          </>
        ) : (
           <StyledButton variant='primary' onClick={() => {
             setCurrentlyRecording( true );
             // Implement web audio part here...
           }} name={'Start Recording'}></StyledButton>
         )}
      </Col>
    </Row>
  );
}

// Includes a button to re-record (clearing the previous recording), a button to play the recording, and a button
// to save the recording.
function EditRecordingContent( props ) {
  const setRecordingComplete = props.setRecordingComplete;
  const handleClose = props.handleClose;
  const setElapsedRecordingTime = props.setElapsedRecordingTime;
  const audioRef = props.audioRef;

  return (
    <>
      <Container>
        <Row>
          <Col></Col>
          <Col className={centeredColumn}>
            <WaveformDisplay></WaveformDisplay>
          </Col>
          <Col></Col>
        </Row>
        <Row>
          <Col className={centeredColumn}>
            <StyledButton variant='primary' onClick={() => {

              // Clear the recording
              setRecordingComplete( false );
              setElapsedRecordingTime( 0 );
            }} name={'Re-record'}></StyledButton>
          </Col>
          <Col className={centeredColumn}>
            <StyledButton variant='primary' onClick={() => {
              // Play the recording

              if ( audioRef.current ) {
                audioRef.current.pause();
                audioRef.current = null;
              }
              else {
                const fullPath = 'media/sounds/selectionArpeggio005.mp3';
                audioRef.current = new Audio( fullPath );
                audioRef.current.play().catch( error => {
                  console.error( error );
                  audioRef.current = null;
                } );

                audioRef.current.onended = () => {
                  audioRef.current = null;
                };
              }
            }} name={'Play Recording'}></StyledButton>
          </Col>
          <Col className={centeredColumn}>
            <StyledButton variant='primary' onClick={() => {
              // Save the recording

              // For now, just close the dialog
              handleClose( false );

            }} name={'Save Recording'}></StyledButton>
          </Col>
        </Row>
      </Container>
    </>
  );
}

function WaveformDisplay( { waveform } ) {
  const canvasRef = useRef( null );

  const canvasWidth = 600;
  const canvasHeight = 300;

  // Limmted so that there is room to decorate with time stamps or other text
  const horizontalPadding = 100;
  const plotWidth = canvasWidth - horizontalPadding;
  const plotHeight = canvasHeight / 2;
  const plotStartX = horizontalPadding / 2;

  // Position from 0 to 100 representing the trimmer position. Will be mapped to the canvas width.
  const [ trimmerPos, setTrimmerPos ] = useState( { start: 0, end: 1 } );
  const [ isDraggingStart, setIsDraggingStart ] = useState( false );
  const [ isDraggingEnd, setIsDraggingEnd ] = useState( false );

  const plotToTrimmerPosition = ( x ) => {
    return ( x - plotStartX ) / plotWidth;
  }

  const trimmerToPlotPosition = ( pos ) => {
    return pos * plotWidth + plotStartX;
  }

  const drawTrimmer = ( ctx, x, height ) => {
    const width = 10;
    const borderRadius = 2;

    // Gradient for depth
    const gradient = ctx.createLinearGradient( x, 0, x + width, height );
    gradient.addColorStop( 0, ViewConstants.buttonFillColor.toCSS() );
    gradient.addColorStop( 1, ViewConstants.buttonFillColor.colorUtilsBrighter( 0.2 ).toCSS() );

    ctx.fillStyle = gradient;
    ctx.shadowColor = 'rgba(0, 0, 0, 0.3)';
    ctx.shadowBlur = 4;
    ctx.shadowOffsetX = 2;
    ctx.shadowOffsetY = 2;

    ctx.beginPath();
    ctx.moveTo( x, 0 );
    ctx.lineTo( x + width, 0 );
    ctx.quadraticCurveTo( x + width + borderRadius, 0, x + width + borderRadius, borderRadius );
    ctx.lineTo( x + width + borderRadius, height - borderRadius );
    ctx.quadraticCurveTo( x + width + borderRadius, height, x + width, height );
    ctx.lineTo( x, height );
    ctx.quadraticCurveTo( x - borderRadius, height, x - borderRadius, height - borderRadius );
    ctx.lineTo( x - borderRadius, borderRadius );
    ctx.quadraticCurveTo( x - borderRadius, 0, x, 0 );
    ctx.closePath();
    ctx.fill();

    // Draw outline
    ctx.strokeStyle = ViewConstants.buttonStrokeColor.toCSS();
    ctx.lineWidth = 1;
    ctx.stroke();

    // Inner glow
    const innerGlowGradient = ctx.createLinearGradient( x, 0, x + width, height );
    innerGlowGradient.addColorStop( 0, ViewConstants.focusHighlightColor.colorUtilsDarker( 0.2 ).toCSS() );
    innerGlowGradient.addColorStop( 1, ViewConstants.focusHighlightColor.toCSS() );

    ctx.fillStyle = innerGlowGradient;
    ctx.beginPath();
    ctx.moveTo( x + 1, 1 );
    ctx.lineTo( x + width - 1, 1 );
    ctx.quadraticCurveTo( x + width - 1 + borderRadius, 1, x + width - 1 + borderRadius, borderRadius + 1 );
    ctx.lineTo( x + width - 1 + borderRadius, height - borderRadius - 1 );
    ctx.quadraticCurveTo( x + width - 1 + borderRadius, height - 1, x + width - 1, height - 1 );
    ctx.lineTo( x + 1, height - 1 );
    ctx.quadraticCurveTo( x + 1 - borderRadius, height - 1, x + 1 - borderRadius, height - borderRadius - 1 );
    ctx.lineTo( x + 1 - borderRadius, borderRadius + 1 );
    ctx.quadraticCurveTo( x + 1 - borderRadius, 1, x + 1, 1 );
    ctx.closePath();
    ctx.fill();

    // Draw grippy dots to make it look interactive
    ctx.fillStyle = 'black';
    const dotRadius = 2.5;
    const dotSpacing = 10;
    const numDots = 5;

    for ( let i = 0; i < numDots; i++ ) {
      const dotY = height / 2 + ( i - ( numDots - 1 ) / 2 ) * dotSpacing;
      ctx.beginPath();
      ctx.arc( x + width / 2, dotY, dotRadius, 0, Math.PI * 2 );
      ctx.fill();
    }

    // Reset shadow
    ctx.shadowColor = 'transparent';
    ctx.shadowBlur = 0;
    ctx.shadowOffsetX = 0;
    ctx.shadowOffsetY = 0;
  };

  useEffect( () => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext( '2d' );

    ctx.clearRect( 0, 0, canvasWidth, canvasHeight );

    // draw a border around the canvas area
    ctx.strokeStyle = ViewConstants.textFillColor.toCSS();
    ctx.lineWidth = 5;
    ctx.strokeRect( plotStartX, 0, plotWidth, plotHeight );

    // Dummy display of a waveform
    ctx.beginPath();
    ctx.moveTo( plotStartX, plotHeight / 2 );
    ctx.strokeStyle = ViewConstants.textFillColor.toCSS();
    ctx.lineWidth = 2;
    for ( let i = 0; i < plotWidth; i++ ) {
      ctx.lineTo( plotStartX + i, plotHeight / 2 + 20 * Math.sin( i * 0.05 ) );
    }
    ctx.stroke();

    // 0 seconds on the left side of the plot
    ctx.fillStyle = ViewConstants.textFillColor.toCSS();
    ctx.font = '24px Verdana';
    ctx.fillText( '0', plotStartX, plotHeight + 36 );

    // will be replaced with the actual duration of the recording on the right
    ctx.fillText( '5.0', plotStartX + plotWidth - 36, plotHeight + 36 );

    // Draw trimmers
    drawTrimmer( ctx, trimmerToPlotPosition( trimmerPos.start ), plotHeight );
    drawTrimmer( ctx, trimmerToPlotPosition( trimmerPos.end ), plotHeight );

  }, [ trimmerPos ] );

  useEffect( () => {
    const handleMouseMove = ( e ) => {
      if ( isDraggingStart || isDraggingEnd ) {
        const canvas = canvasRef.current;
        const rect = canvas.getBoundingClientRect();
        const x = e.clientX - rect.left;

        const constrainedX = Math.min( Math.max( x, plotStartX ), plotWidth + plotStartX );
        const trimmerPosition = plotToTrimmerPosition( constrainedX );

        if ( isDraggingStart ) {
          setTrimmerPos( ( prev ) => ( { ...prev, start: trimmerPosition } ) );
        }
        else if ( isDraggingEnd ) {
          setTrimmerPos( ( prev ) => ( { ...prev, end: trimmerPosition } ) );
        }
      }
    };

    const handleMouseUp = () => {
      setIsDraggingStart( false );
      setIsDraggingEnd( false );
    };

    // Attach event listeners to the window
    window.addEventListener( 'mousemove', handleMouseMove );
    window.addEventListener( 'mouseup', handleMouseUp );

    // Cleanup event listeners on component unmount
    return () => {
      window.removeEventListener( 'mousemove', handleMouseMove );
      window.removeEventListener( 'mouseup', handleMouseUp );
    };
  }, [ isDraggingStart, isDraggingEnd ] );

  const handleMouseDown = ( e ) => {
    const x = e.nativeEvent.offsetX;
    const startTrimmerCanvasX = trimmerToPlotPosition( trimmerPos.start );
    const endTrimmerCanvasX = trimmerToPlotPosition( trimmerPos.end );

    if ( Math.abs( x - startTrimmerCanvasX ) < 10 ) {
      setIsDraggingStart( true );
    }
    else if ( Math.abs( x - endTrimmerCanvasX ) < 10 ) {
      setIsDraggingEnd( true );
    }
  };

  return (
    <>
      <canvas
        ref={canvasRef}
        width={canvasWidth}
        height={canvasHeight}
        onMouseDown={handleMouseDown}
      ></canvas>
    </>
  );
}
