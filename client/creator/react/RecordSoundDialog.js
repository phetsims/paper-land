import React, { useEffect, useRef, useState } from 'react';
import Col from 'react-bootstrap/Col';
import Container from 'react-bootstrap/Container';
import Form from 'react-bootstrap/Form';
import Modal from 'react-bootstrap/Modal';
import Row from 'react-bootstrap/Row';
import xhr from 'xhr';
import ViewConstants from '../view/ViewConstants.js';
import styles from './../CreatorMain.css';
import StyledButton from './StyledButton.js';

const centeredColumn = 'd-flex justify-content-center';

// in seconds, the limit for the recording duration
const MAX_RECORDING_TIME = 10;

// in seconds, a countdown time  before recording begins
const MAX_COUNTDOWN_TIME = 3;

export default function RecordSoundDialog( props ) {
  const showing = props.showing;
  const setShowing = props.setShowing;

  // A function that is called to refresh the list of available files once the user has completed a recording.
  // The function takes the new file name.
  const handleRecordingFinished = props.handleRecordingFinished;

  // True when the user has granted permission to start recording.
  const [ permissionGranted, setPermissionGranted ] = useState( false );

  // True when the recording is complete and ready for editing.
  const [ recordingComplete, setRecordingComplete ] = useState( false );

  // True while "counting down" before starting to record. When the user starts recording there is a 3 second countdown.
  const [ currentlyCountingDown, setCurrentlyCountingDown ] = useState( false );

  // How long the user has been recording sound.
  const [ elapsedRecordingTime, setElapsedRecordingTime ] = useState( 0 );

  // Elapsed cowntdown time between pressing record and actually recording.
  const [ elapsedCountdownTime, setElapsedCountdownTime ] = useState( MAX_COUNTDOWN_TIME );

  // Position from 0 to 1 representing the trimmer position. Will be mapped to the canvas width to draw the trimmer.
  const [ startTrimmerPos, setStartTrimmerPos ] = useState( 0 );
  const [ endTrimmerPos, setEndTrimmerPos ] = useState( 1 );

  const audioChunksRef = useRef( [] );
  const [ audioURL, setAudioURL ] = useState( '' );

  // When the audio URL changes, we will update this audio buffer, which is used to display the waveform
  const [ audioBuffer, setAudioBuffer ] = useState( null );

  // References to audio context information that persists across multiple renders.
  const audioContextRef = useRef( null );
  const analyserRef = useRef( null );
  const dataArrayRef = useRef( null );

  // A reference to the media recorder which will be used to save the recording.
  const mediaRecorderRef = useRef( null );

  // A reference to an audio element, that persists across multiple renders.
  const audioRef = useRef( null );

  // When the audio URL changes, update the audio buffer
  useEffect( () => {
    if ( audioURL && audioContextRef.current ) {
      getAudioBuffer( audioURL, audioContextRef.current ).then( buffer => {
        setAudioBuffer( buffer );
      } );
    }
  }, [ audioURL ] );

  const stopRecording = () => {

    // Stop the audio context and analyser - do not clear the audio context because we need it to parse the audio
    // data
    if ( audioContextRef.current ) {
      audioContextRef.current.close().then( () => {
        // analyserRef.current = null;
        // dataArrayRef.current = null;
      } ).catch( error => {

        // It is OK if this doesn't succeed if we try to close more than once.
      } );
    }

    // Stop the media recorder
    if ( mediaRecorderRef.current ) {

      // stopping all tracks manually seems to be required to stop the recording
      if ( mediaRecorderRef.current.stream ) {
        mediaRecorderRef.current.stream.getTracks().forEach( track => track.stop() );
      }

      // Also use a general stop method
      mediaRecorderRef.current.stop();

      // Clear the mediaRecorderRef so we don't try to stop again.
      // mediaRecorderRef.current = null;
    }
  }

  const handleClose = () => {

    // Other work you want to do here before closing...
    // setPermissionGranted( false );
    setRecordingComplete( false );
    setElapsedRecordingTime( 0 );
    setElapsedCountdownTime( MAX_COUNTDOWN_TIME );

    stopRecording();

    // Close the dialog by updating state forwarded by the client.
    setShowing( false );
  };

  // Start recording again by setting the MediaRecorder. This is used when we grant permissions to start recording
  // and when the user wants to re-record.
  const startRecorder = async () => {

    // Clear previous recording state
    setRecordingComplete( false );
    setElapsedRecordingTime( 0 );
    setElapsedCountdownTime( MAX_COUNTDOWN_TIME );

    // Clear any previous recording
    audioChunksRef.current = [];
    setAudioURL( '' );

    mediaRecorderRef.current = await initRecorder(
      audioContextRef,
      analyserRef,
      dataArrayRef
    );
  }

  // When recording stops, trigger the work to be done with the various web audio APIs.
  useEffect( () => {
    if ( recordingComplete ) {
      stopRecording();
    }
  }, [ recordingComplete ] );

  // When the dialog opens, start the recorder if permissions have been granted.
  useEffect( () => {
    if ( showing && permissionGranted ) {

      // useEffect cannot return a Promise. Instead, wrap the with an async function and call it immediately without
      // waiting. Note the returned promise is ignored.
      async function callImmediately() {
        await startRecorder();
      }

      callImmediately();
    }
  }, [ showing ] );

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
              return <RequestPermissionContent
                startRecorder={startRecorder}
                mediaRecorderRef={mediaRecorderRef}
                setPermissionGranted={setPermissionGranted}/>;
            }
            else if ( !recordingComplete ) {
              return <RecordContent
                setRecordingComplete={setRecordingComplete}
                elapsedRecordingTime={elapsedRecordingTime}
                setElapsedRecordingTime={setElapsedRecordingTime}
                currentlyCountingDown={currentlyCountingDown}
                setCurrentlyCountingDown={setCurrentlyCountingDown}
                elapsedCountdownTime={elapsedCountdownTime}
                setElapsedCountdownTime={setElapsedCountdownTime}
                analyserRef={analyserRef}
                dataArrayRef={dataArrayRef}
                mediaRecorderRef={mediaRecorderRef}
                audioChunksRef={audioChunksRef}
                setAudioURL={setAudioURL}
              />;
            }
            else {
              return <EditRecordingContent
                setRecordingComplete={setRecordingComplete}
                handleClose={handleClose}
                elapsedRecordingTime={elapsedRecordingTime}
                setElapsedRecordingTime={setElapsedRecordingTime}
                audioRef={audioRef}
                audioURL={audioURL}
                audioContextRef={audioContextRef}
                audioBuffer={audioBuffer}
                startRecorder={startRecorder}
                startTrimmerPos={startTrimmerPos}
                setStartTrimmerPos={setStartTrimmerPos}
                endTrimmerPos={endTrimmerPos}
                setEndTrimmerPos={setEndTrimmerPos}
                handleRecordingFinished={handleRecordingFinished}
              />;
            }
          } )()}
        </Modal.Body>
      </Modal>
    </>
  )
}

function RequestPermissionContent( props ) {
  const mediaRecorderRef = props.mediaRecorderRef;
  const startRecorder = props.startRecorder;

  return (
    <>
      <p className={styles.allowMultiline}>To record sound, you must grant permission to access your microphone.</p>
      <StyledButton variant='primary' onClick={async () => {

        await startRecorder();
        props.setPermissionGranted( !!mediaRecorderRef.current );

      }} name={'Grant Permission'}></StyledButton>
    </>
  );
}

function RecordContent( props ) {
  const elapsedTime = props.elapsedRecordingTime;
  const setElapsedTime = props.setElapsedRecordingTime;
  const analyserRef = props.analyserRef;
  const dataArrayRef = props.dataArrayRef;
  const mediaRecorderRef = props.mediaRecorderRef;
  const audioChunksRef = props.audioChunksRef;
  const setAudioURL = props.setAudioURL;
  const setRecordingComplete = props.setRecordingComplete;
  const currentlyCountingDown = props.currentlyCountingDown;
  const setCurrentlyCountingDown = props.setCurrentlyCountingDown;
  const elapsedCountdownTime = props.elapsedCountdownTime;
  const setElapsedCountdownTime = props.setElapsedCountdownTime;

  const stopRecording = () => {

    if ( mediaRecorderRef.current ) {
      const mediaRecorder = mediaRecorderRef.current;
      mediaRecorder.onstop = () => {
        const blob = new Blob( audioChunksRef.current, { type: 'audio/mp3' } );
        const url = URL.createObjectURL( blob );
        setAudioURL( url );
      };

      mediaRecorder.stop();

      // mediaRecorderRef.current = null;
    }

    setCurrentlyRecording( false );
    setRecordingComplete( true );
  };

  const [ currentlyRecording, setCurrentlyRecording ] = useState( false );

  // This is a simple way to update the elapsed time counters every time interval.
  useEffect( () => {
    const interval = setInterval( () => {
      if ( currentlyRecording ) {
        setElapsedTime( ( prevTime ) => prevTime + 0.1 );
      }
      else if ( currentlyCountingDown ) {
        setElapsedCountdownTime( ( prevTime ) => prevTime - 0.1 );
      }
    }, 100 );

    // Clear the interval when the component unmounts
    return () => clearInterval( interval );
  }, [ currentlyRecording, currentlyCountingDown ] );

  // In its own useEffect so that this update happens after the elapsed time state is fully updated.
  // Putting this check in the above useEffect can cause a memory leak.
  useEffect( () => {
    if ( currentlyCountingDown && elapsedCountdownTime < 0 ) {

      // We reached the end of the countdown, start recording
      startRecording();
    }
    else if ( currentlyRecording && elapsedTime >= MAX_RECORDING_TIME ) {

      // We reached the end of the maximum recording time, stop recording
      stopRecording();
    }
  }, [ elapsedTime, elapsedCountdownTime ] );

  const startCountdown = () => {
    setCurrentlyCountingDown( true );
  }

  const startRecording = () => {
    setCurrentlyCountingDown( false );
    setCurrentlyRecording( true );

    const mediaRecorder = mediaRecorderRef.current;
    if ( mediaRecorder ) {
      mediaRecorder.start();

      mediaRecorder.ondataavailable = ( e ) => {
        audioChunksRef.current.push( e.data );
      }
    }
  };

  return (
    <Row className='justify-content-center align-items-center'>
      <Col className='text-center'>
        {currentlyRecording ? (
          <StyledButton
            variant='primary'
            onClick={stopRecording}
            name={<div className={styles.pauseButton}>❚❚</div>}>
          </StyledButton>
        ) : currentlyCountingDown ? (
          <p className={styles.evenLargerText}>{Math.ceil( elapsedCountdownTime )}</p>
        ) : (
              <StyledButton
                variant='primary'
                otherClassNames=''
                onClick={startCountdown}
                name={<div className={styles.recordButton}>●</div>}
              />
            )}
        <p>{elapsedTime.toFixed( 2 )} / {MAX_RECORDING_TIME.toFixed( 2 )}</p>
        <p style={{ visibility: currentlyRecording ? 'visible' : 'hidden' }}>Recording...</p>
      </Col>
      <Col>
        <div>
          <IncomingSoundLevelView
            analyserRef={analyserRef}
            dataArrayRef={dataArrayRef}
          />
        </div>
      </Col>
    </Row>
  );
}

// A view that displays the incoming sound level. This is a canvas element will draw 16 rectangles on top of eachother
// and their fill will update based on the incoming sound level.
function IncomingSoundLevelView( props ) {
  const canvasRef = useRef( null );
  const animationRef = useRef( null );
  const analyserRef = props.analyserRef;
  const dataArrayRef = props.dataArrayRef;

  // constants for the sound level bars
  const barWidth = 30;
  const barHeight = 14;
  const barSpacing = 5;
  const numBars = 16;

  const canvasWidth = 100;
  const canvasHeight = ( barHeight + barSpacing ) * numBars;

  const draw = () => {
    if ( !analyserRef.current || !dataArrayRef.current ) {
      animationRef.current = requestAnimationFrame( draw );
      return;
    }

    const canvas = canvasRef.current;
    const ctx = canvas.getContext( '2d' );

    // Clear the canvas
    ctx.clearRect( 0, 0, canvasWidth, canvasHeight );

    // calculate the sound level from the analyser node
    analyserRef.current.getByteTimeDomainData( dataArrayRef.current );

    // Multiply the displayed sound level so that it appears more dramatic
    const soundLevel = calculateSoundLevel( analyserRef.current, dataArrayRef.current ) * 2;

    // draw 16 bars stacked on top of eachother - the fill will update based on the incoming sound level
    for ( let i = 0; i < numBars; i++ ) {
      const barX = canvasWidth / 2 - barWidth / 2;
      const barY = i * ( barHeight + barSpacing );

      ctx.fillStyle = ( 1 - i / numBars ) < soundLevel ? ViewConstants.textFillColor.toCSS() : ViewConstants.backgroundColor.toCSS();
      ctx.strokeStyle = ViewConstants.buttonStrokeColor.toCSS();
      ctx.fillRect( barX, barY, barWidth, barHeight );
      ctx.strokeRect( barX, barY, barWidth, barHeight );
    }

    animationRef.current = requestAnimationFrame( draw );
  }

  useEffect( () => {

    // Start the animation
    draw();

    // Cleanup by cancelling any in progress animations
    return () => {
      cancelAnimationFrame( animationRef.current );
    };
  }, [] );

  return (
    <>
      <canvas ref={canvasRef} width={canvasWidth} height={canvasHeight}></canvas>
    </>
  );
}

// Includes a button to re-record (clearing the previous recording), a button to play the recording, and a button
// to save the recording.
function EditRecordingContent( props ) {
  const handleClose = props.handleClose;
  const elapsedRecordingTime = props.elapsedRecordingTime;
  const audioRef = props.audioRef;
  const audioURL = props.audioURL;
  const audioContextRef = props.audioContextRef;
  const startRecorder = props.startRecorder;
  const audioBuffer = props.audioBuffer;
  const startTrimmerPos = props.startTrimmerPos;
  const setStartTrimmerPos = props.setStartTrimmerPos;
  const endTrimmerPos = props.endTrimmerPos;
  const setEndTrimmerPos = props.setEndTrimmerPos;
  const handleRecordingFinished = props.handleRecordingFinished;

  // The name for the audio file
  const [ fileName, setFileName ] = useState( '' );
  const [ fileNameInvalid, setFileNameInvalid ] = useState( false );

  // Validate the file name
  useEffect( () => {

    // The file name cannot be empty and cannot include punctuation or special characters
    setFileNameInvalid( !fileName || !/^[a-zA-Z0-9_ ]*$/.test( fileName ) );
  }, [ fileName ] );

  return (
    <>
      <Container>
        <Row>
          <Col></Col>
          <Col className={centeredColumn}>
            <WaveformDisplay
              audioBuffer={audioBuffer}
              startTrimmerPos={startTrimmerPos}
              setStartTrimmerPos={setStartTrimmerPos}
              endTrimmerPos={endTrimmerPos}
              setEndTrimmerPos={setEndTrimmerPos}
              elapsedRecordingTime={elapsedRecordingTime}
            ></WaveformDisplay>
          </Col>
          <Col></Col>
        </Row>
        <Row>
          <Form.Group className={styles.controlElement}>
            <Form.Label>Sound Name:</Form.Label>
            <Form.Control
              type='text'
              value={fileName}
              required
              isInvalid={fileNameInvalid}
              onChange={event => {
                setFileName( event.target.value );
              }}
            />
            <Form.Control.Feedback type='invalid' className={styles.validation}>
              {'Please enter a file name. Must not contain special characters or punctuation.'}
            </Form.Control.Feedback>
          </Form.Group>
        </Row>
        <Row>
          <Col className={centeredColumn}>
            <StyledButton variant='primary' onClick={async () => {
              await startRecorder();
            }} name={'Re-record'}></StyledButton>
          </Col>
          <Col className={centeredColumn}>
            <StyledButton variant='primary' onClick={() => {

              if ( audioRef.current ) {
                audioRef.current.pause();
                audioRef.current = null;
              }
              else {
                audioRef.current = new Audio( audioURL );

                const startTime = startTrimmerPos * elapsedRecordingTime;
                const endTime = endTrimmerPos * elapsedRecordingTime;

                // Monitor timeupdate event to stop audio at endTime
                audioRef.current.addEventListener( 'timeupdate', () => {

                  // I believe we may run into when the audioRef is removed because we get a timeupdate event after
                  // the audio has ended. This is a quick fix to prevent that from happening.
                  if ( audioRef.current && audioRef.current.currentTime >= endTime ) {
                    audioRef.current.pause();
                    audioRef.current = null;
                  }
                } );

                // This is how we play within the trimmed section - when data is loaded, set the current time
                // to the start time and then request the play.
                audioRef.current.addEventListener( 'loadedmetadata', () => {
                  audioRef.current.currentTime = startTime;

                  audioRef.current.play().catch( error => {
                    console.error( error );
                    audioRef.current = null;
                  } );
                } );

                // When over, clear the reference to the audio element
                audioRef.current.onended = () => {
                  audioRef.current = null;
                };
              }
            }} name='▶'></StyledButton>
          </Col>
          <Col className={centeredColumn}>
            <StyledButton variant='primary' onClick={async () => {
              // Save the recording

              // Trim the audio buffer to the selected range
              const startTime = startTrimmerPos * elapsedRecordingTime;
              const endTime = endTrimmerPos * elapsedRecordingTime;

              const trimmedBuffer = trimAudioBuffer( audioBuffer, audioContextRef.current, startTime, endTime );
              const encodedWav = encodeWAV( trimmedBuffer );

              const formData = new FormData();
              const file = new File( [ encodedWav ], `${fileName}.wav`, { type: 'audio/wav' } );
              formData.append( 'file', file );

              xhr.post( '/api/creator/uploadSound', { body: formData }, ( error, response ) => {
                if ( error ) {
                  console.error( error );
                }
                else {
                  if ( response.body ) {
                    try {
                      const responseJSON = JSON.parse( response.body );
                      const fileName = responseJSON.soundFileName;
                      handleRecordingFinished( fileName );
                    }
                    catch( error ) {
                      console.log( 'Problem parsing server response after file upload.' );
                    }
                  }
                }
              } );

              handleClose( false );

            }} name={'Save Recording'}></StyledButton>
          </Col>
        </Row>
      </Container>
    </>
  );
}

function WaveformDisplay( props ) {
  const canvasRef = useRef( null );
  const audioBuffer = props.audioBuffer;
  const startTrimmerPos = props.startTrimmerPos;
  const setStartTrimmerPos = props.setStartTrimmerPos;
  const endTrimmerPos = props.endTrimmerPos;
  const setEndTrimmerPos = props.setEndTrimmerPos;
  const elapsedRecordingTime = props.elapsedRecordingTime;

  const canvasWidth = 600;
  const canvasHeight = 300;

  // Limmted so that there is room to decorate with time stamps or other text
  const horizontalPadding = 100;
  const plotWidth = canvasWidth - horizontalPadding;
  const plotHeight = canvasHeight / 2;
  const plotStartX = horizontalPadding / 2;

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

    // In case there is no audio data yet
    if ( !audioBuffer ) {
      return;
    }

    // Draw the actual audio data as a wave
    const data = audioBuffer.getChannelData( 0 );

    ctx.lineWidth = 2;
    ctx.beginPath();

    const step = Math.ceil( data.length / canvasWidth );
    const amp = plotHeight / 2;
    for ( let i = plotStartX; i < plotStartX + plotWidth; i++ ) {
      const min = Math.max( ...data.subarray( i * step, ( i + 1 ) * step ) ) * amp + plotHeight / 2;
      const max = Math.min( ...data.subarray( i * step, ( i + 1 ) * step ) ) * amp + plotHeight / 2;

      if ( i === 0 ) {
        ctx.moveTo( i, min );
      }
      else {
        ctx.lineTo( i, min );
      }
      ctx.lineTo( i, max );
    }

    ctx.stroke();

    // 0 seconds on the left side of the plot
    ctx.fillStyle = ViewConstants.textFillColor.toCSS();
    ctx.font = '24px Verdana';
    ctx.fillText( '0', plotStartX, plotHeight + 36 );

    // will be replaced with the actual duration of the recording on the right
    const formattedRecordingTime = elapsedRecordingTime.toFixed( 2 );
    ctx.fillText( formattedRecordingTime, plotStartX + plotWidth - 36, plotHeight + 36 );

    // Draw trimmers
    drawTrimmer( ctx, trimmerToPlotPosition( startTrimmerPos ), plotHeight );
    drawTrimmer( ctx, trimmerToPlotPosition( endTrimmerPos ), plotHeight );

  }, [ startTrimmerPos, endTrimmerPos, audioBuffer ] );

  useEffect( () => {
    const handleMouseMove = ( e ) => {
      if ( isDraggingStart || isDraggingEnd ) {
        const canvas = canvasRef.current;
        const rect = canvas.getBoundingClientRect();
        const x = e.clientX - rect.left;

        if ( isDraggingStart ) {
          const constrainedX = Math.min( Math.max( x, plotStartX ), trimmerToPlotPosition( endTrimmerPos ) - 10 );
          setStartTrimmerPos( plotToTrimmerPosition( constrainedX ) );
        }
        else if ( isDraggingEnd ) {
          const constrainedX = Math.min( Math.max( x, trimmerToPlotPosition( startTrimmerPos ) + 10 ), plotWidth + plotStartX );
          setEndTrimmerPos( plotToTrimmerPosition( constrainedX ) );
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
    const startTrimmerCanvasX = trimmerToPlotPosition( startTrimmerPos );
    const endTrimmerCanvasX = trimmerToPlotPosition( endTrimmerPos );

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

//------------------------------------------------------------------------------
// Functions supporting audio recording
//------------------------------------------------------------------------------
async function requestAudioPermissions() {
  try {
    return await navigator.mediaDevices.getUserMedia( { audio: true } );
  }
  catch( error ) {
    console.error( 'Error accessing audio devices:', error );
    return null;
  }
}

async function getAudioDevices() {
  const devices = await navigator.mediaDevices.enumerateDevices();
  return devices.filter( device => device.kind === 'audioinput' );
}

async function initRecorder( audioContextRef, analyserRef, dataArrayRef ) {
  const stream = await requestAudioPermissions();
  if ( !stream ) {
    return false;
  }

  // Set up AudioContext and AnalyserNode to process realtime data
  const audioContext = new ( window.AudioContext || window.webkitAudioContext )();
  const analyser = audioContext.createAnalyser();
  const source = audioContext.createMediaStreamSource( stream );
  source.connect( analyser );
  analyser.fftSize = 256;
  const bufferLength = analyser.frequencyBinCount;
  const dataArray = new Uint8Array( bufferLength );

  audioContextRef.current = audioContext;
  analyserRef.current = analyser;
  dataArrayRef.current = dataArray;

  // Create a media recorder to record and save the audio
  return new MediaRecorder( stream );
}

// Apparently, the root-mean-square of the data is a good approximation of the sound level.
function calculateSoundLevel( analyser, dataArray ) {
  analyser.getByteTimeDomainData( dataArray );

  let sumSquares = 0;
  for ( let i = 0; i < dataArray.length; i++ ) {
    const normalized = dataArray[ i ] / 128.0 - 1.0;
    sumSquares += normalized * normalized;
  }

  return Math.sqrt( sumSquares / dataArray.length );
}

// Returns an audio buffer decoded so that we can use it to draw the sound wave of the recorded audio
const getAudioBuffer = async ( audioURL, audioContext ) => {
  const response = await fetch( audioURL );
  const arrayBuffer = await response.arrayBuffer();
  return await audioContext.decodeAudioData( arrayBuffer );
}

// Creates a trimmed AudioBuffer from the original audio, between the start time and end time. Should be used before
// saving the audio to a local file.
function trimAudioBuffer( audioBuffer, audioContext, startTime, endTime ) {
  const duration = endTime - startTime;
  const sampleRate = audioBuffer.sampleRate;
  const newLength = duration * sampleRate;
  const trimmedBuffer = audioContext.createBuffer(
    audioBuffer.numberOfChannels,
    newLength,
    sampleRate
  );

  for ( let i = 0; i < audioBuffer.numberOfChannels; i++ ) {
    const channelData = audioBuffer.getChannelData( i );
    trimmedBuffer.copyToChannel( channelData.subarray( startTime * sampleRate, endTime * sampleRate ), i );
  }

  return trimmedBuffer;
}

// Encodes the audio buffer as a WAV file and returns a Blob that can be saved to the local file system.
function encodeWAV( audioBuffer ) {
  const numberOfChannels = audioBuffer.numberOfChannels;
  const sampleRate = audioBuffer.sampleRate;
  const format = 1; // PCM
  const bitDepth = 16;

  let result;

  if ( numberOfChannels === 2 ) {
    result = interleaveChannels( audioBuffer.getChannelData( 0 ), audioBuffer.getChannelData( 1 ) );
  }
  else {
    result = audioBuffer.getChannelData( 0 );
  }

  const wavBuffer = new ArrayBuffer( 44 + result.length * 2 );
  const view = new DataView( wavBuffer );

  /* Write WAV header */
  writeString( view, 0, 'RIFF' );
  view.setUint32( 4, 32 + result.length * 2, true );  // file length - 8
  writeString( view, 8, 'WAVE' );
  writeString( view, 12, 'fmt ' );
  view.setUint32( 16, 16, true );  // PCM format chunk length
  view.setUint16( 20, format, true );
  view.setUint16( 22, numberOfChannels, true );
  view.setUint32( 24, sampleRate, true );
  view.setUint32( 28, sampleRate * numberOfChannels * ( bitDepth / 8 ), true );  // byte rate
  view.setUint16( 32, numberOfChannels * ( bitDepth / 8 ), true );  // block align
  view.setUint16( 34, bitDepth, true );  // bits per sample
  writeString( view, 36, 'data' );
  view.setUint32( 40, result.length * 2, true );

  /* Write PCM samples */
  floatTo16BitPCM( view, 44, result );

  return new Blob( [ view ], { type: 'audio/wav' } );
}

// Utility function for encoding the audio buffer as a WAV file
function interleaveChannels( inputL, inputR ) {
  const length = inputL.length + inputR.length;
  const result = new Float32Array( length );

  let index = 0;
  let inputIndex = 0;

  while ( index < length ) {
    result[ index++ ] = inputL[ inputIndex ];
    result[ index++ ] = inputR[ inputIndex ];
    inputIndex++;
  }
  return result;
}

// Utility function for encoding the audio buffer as a WAV file
function writeString( view, offset, string ) {
  for ( let i = 0; i < string.length; i++ ) {
    view.setUint8( offset + i, string.charCodeAt( i ) );
  }
}

// Utility function for encoding the audio buffer as a WAV file
function floatTo16BitPCM( output, offset, input ) {
  for ( let i = 0; i < input.length; i++, offset += 2 ) {
    const s = Math.max( -1, Math.min( 1, input[ i ] ) );
    output.setInt16( offset, s < 0 ? s * 0x8000 : s * 0x7FFF, true );
  }
}