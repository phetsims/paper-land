/**
 * Main react component for the AI Harness page.
 */

import React, { useEffect, useRef, useState } from 'react';
import Alert from 'react-bootstrap/Alert';
import Form from 'react-bootstrap/Form';
import ListGroup from 'react-bootstrap/ListGroup';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { darcula } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { combineClasses } from '../utils.js';
import styles from './AIHarnessMain.css';

// utility function to get the ai connection url at the current origin
// @param {requestType} string after the /openai/ route
function getAIConnectionUrl( requestType ) {
  return new URL( `openai/${requestType}`, window.location.origin ).toString();
}

export default function AIHarnessMain( props ) {

  // State for when we are waiting for a response from OpenAI
  const [ waiting, setWaiting ] = useState( false );

  // State for the list of available OpenAI engines
  const [ engines, setEngines ] = useState( [] );

  // state for the selected engine
  const [ selectedEngine, setSelectedEngine ] = useState( '' );

  // Stage for the temperature of the AI response
  const [ temperature, setTemperature ] = useState( 0 );

  // add react state for input an chatLog
  const [ input, setInput ] = useState( '' );

  // state for the alert content
  const [ alertContent, setAlertContent ] = useState( '' );

  // state for whether the alert should be shown
  const [ showAlert, setShowAlert ] = useState( false );

  // state for chunk size
  const [ chunkSize, setChunkSize ] = useState( 600 );

  // state for chunk overlap
  const [ chunkOverlap, setChunkOverlap ] = useState( 20 );

  // state for a pre-train message
  const [ preTrainMessage, setPreTrainMessage ] = useState( '' );

  // state for a post-train message
  const [ postTrainMessage, setPostTrainMessage ] = useState( '' );

  // state for whether we are using contextual compression
  const [ useContextualCompression, setUseContextualCompression ] = useState( false );

  // Items of the log, with values { user: 'me' | 'ai' | 'system', message: String, type: 'chat' | 'error' }
  const [ chatLog, setChatLog ] = useState( [
    {
      user: 'system',
      message: 'Welcome to the AI Test Harness! For now, this is not a chat. ' +
               'Each prompt creates a fresh request with the provided settings. ' +
               'Change the training documents and settings to see how the model responds.',
      type: 'chat'
    },
    {
      user: 'system',
      message: 'Checking OpenAI connection...',
      type: 'chat'
    }
  ] );

  // A ref to the last chat item, so we can scroll it into view
  const lastItemRef = useRef( null );

  const showAlertPopup = contentString => {
    setAlertContent( contentString );
    setShowAlert( true );

    setTimeout( () => {
      setShowAlert( false );
    }, 2000 );
  };

  // Whenever an item is added to the chat log, scroll it into view
  useEffect( () => {
    if ( lastItemRef.current ) {
      lastItemRef.current.scrollIntoView();
    }
  }, [ chatLog ] );

  const addChatMessage = async ( message, user, type ) => {
    const newChatLog = [ ...chatLog, { user: user, message: message, type: type } ];
    await setChatLog( newChatLog );
  };

  // Basically componentDidMount for functional React.
  useEffect( () => {

    // Test the connection to OpenAI
    async function checkConnection() {
      setWaiting( true );

      try {
        const connectionResponse = await fetch( getAIConnectionUrl( 'connect' ), {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          }
        } );
        const jsonData = await connectionResponse.json();
        await addChatMessage( jsonData.text, 'ai', 'chat' );

        // If connection is successful, get the list of available engines
        const engineResponse = await fetch( getAIConnectionUrl( 'engines' ), {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json'
          }
        } );
        const engineResponseData = await engineResponse.json();
        setEngines( engineResponseData );

        // Set the default to the best chat engine
        if ( engineResponseData.includes( 'gpt-3.5-turbo' ) ) {
          setSelectedEngine( 'gpt-3.5-turbo' );
        }
      }
      catch( error ) {
        await addChatMessage( 'Failure to connect.', 'system', 'error' );
      }

      setWaiting( false );
    }

    checkConnection();
  }, [] );

  const uploadTrainingDocuments = async event => {
    const files = [ ...event.target.files ];

    const formData = new FormData();
    files.forEach( file => {
      formData.append( 'files', file );
    } );

    // use the getAIConnectionUrl function to get the correct url
    const response = await fetch( getAIConnectionUrl( 'uploadDocuments' ), {
      method: 'POST',
      body: formData
    } );

    const responseData = await response.json();

    if ( responseData.success ) {
      showAlertPopup( `Upload success - ${responseData.numberOfFiles} files` );
    }
    else {
      showAlertPopup( 'Upload failure' );
    }
  };

  const handleSubmit = async event => {

    // no page refresh on submit
    event.preventDefault();

    setWaiting( true );

    const newChatLog = [ ...chatLog, { user: 'me', message: input, type: 'chat' } ];
    await setChatLog( newChatLog );

    setInput( '' );

    // for chat, we feed all previous messages for a new response
    // const allMessages = newChatLog.map( message => message.message ).join( '\n' );

    const response = await fetch( getAIConnectionUrl( 'query' ), {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify( {
        prompt: input,
        temperature: temperature,
        modelName: selectedEngine,
        splitterChunkSize: chunkSize,
        splitterChunkOverlap: chunkOverlap,
        useContextualCompression: useContextualCompression,
        preTrainMessage: preTrainMessage,
        postTrainMessage: postTrainMessage
      } )
      // body: JSON.stringify( { prompt: allMessages } )
    } );

    const data = await response.json();
    console.log( data );

    if ( data.text ) {
      await setChatLog( [ ...newChatLog, { user: 'ai', message: data.text, type: 'chat' } ] );
    }
    else {
      const errorMessage = ( data && data.error && data.error.message ) || 'Unknown error.';
      await setChatLog( [ ...newChatLog, { user: 'system', message: errorMessage, type: 'error' } ] );
    }

    setWaiting( false );
  };

  return (
    <div>
      <div className={styles.alert}>
        <Alert
          show={showAlert}
          variant={'secondary'}
          style={{

            // makes the alert only as big as its contents
            display: 'inline-block'
          }}
        >
          <Alert.Heading>{alertContent}</Alert.Heading>
        </Alert>
      </div>
      <div className={styles.container}>
        <div className={combineClasses( styles.row, styles.panelClass, styles.chatRow )}>
          <div className={styles.chatForm}>
            <div className={styles.chatOutput}>
              <ListGroup variant='flush'>
                {
                  chatLog.map( ( logItem, index ) => (
                    <span key={index} ref={index === chatLog.length - 1 ? lastItemRef : null}>
                      <ChatItem user={logItem.user} message={logItem.message} type={logItem.type}/>
                    </span>
                  ) )
                }
              </ListGroup>
            </div>
            <div className={styles.chatInput}>
              <form onSubmit={handleSubmit}>
                <Form.Control
                  type='text'
                  rows={3}
                  disabled={waiting}
                  placeholder={waiting ? 'Waiting for response...' : 'Enter a prompt...'}
                  value={input}
                  onChange={event => setInput( event.target.value )}
                />
              </form>
            </div>
          </div>
        </div>
        <div className={combineClasses( styles.row, styles.panelClass, styles.controlsRow )}>
          <div className={styles.controlsColumn}>
            <div>
              <Form.Check
                type={'checkbox'}
                checked={useContextualCompression}
                onChange={
                  event => {
                    setUseContextualCompression( event.target.checked );

                    // if not using contextual compression, gpt-3.5-turbo is the only model we can use
                    if ( !event.target.checked ) {
                      setSelectedEngine( 'gpt-3.5-turbo' );
                    }
                  }
                }
                id={'use-contextual-compression'}
                label={'Use Contextual Compression'}
              />
            </div>
            <div hidden={!useContextualCompression}>
              <Form.Label>Engine</Form.Label>
              <Form.Select
                value={selectedEngine}
                onChange={event => setSelectedEngine( event.target.value )}
              >
                {
                  engines.map( ( engine, index ) => <option key={`${engine}-${index}`}>{engine}</option> )
                }
              </Form.Select>
            </div>
            <div>
              <Form.Label>{`Temperature: ${temperature}`}</Form.Label>
              <Form.Range
                value={temperature}
                min={0.2}
                max={1}
                step={0.01}
                onChange={event => setTemperature( event.target.value )}/>
            </div>
          </div>
          <div className={styles.controlsColumn}>
            <div>
              <Form.Group>
                <Form.Label>Training documents</Form.Label>
                <Form.Control
                  type='file'
                  accept='.md, .js'
                  multiple={true}
                  onChange={uploadTrainingDocuments}/>
              </Form.Group>
            </div>
            <div>
              <Form.Label>{`Chunk Size: ${chunkSize}`}</Form.Label>
              <Form.Range
                value={chunkSize}
                min={40}
                max={4000}
                step={1}
                onChange={event => setChunkSize( event.target.value )}/>
            </div>
            <div>
              <Form.Label>{`Chunk Overlap: ${chunkOverlap}`}</Form.Label>
              <Form.Range
                value={chunkOverlap}
                min={0}
                max={1000}
                step={1}
                onChange={event => setChunkOverlap( event.target.value )}/>
            </div>
          </div>
          <div className={styles.controlsColumn} hidden={useContextualCompression}>
            <div>
              <Form.Label>Pre-train message</Form.Label>
              <Form.Control
                as={'textarea'}
                onChange={event => setPreTrainMessage( event.target.value )}
                value={preTrainMessage}
              />
            </div>
            <div>
              <Form.Label>Post-train message</Form.Label>
              <Form.Control
                as={'textarea'}
                onChange={event => setPostTrainMessage( event.target.value )}
                value={postTrainMessage}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function splitCodeSnippets( inputString ) {

  // Define the regular expression pattern
  const pattern = /(```[\s\S]*?```|\n\n)/;

  // Split the string using the pattern
  const substrings = inputString.split( pattern );

  // Remove empty substrings
  const filteredStrings = substrings.filter( substring => substring.trim() !== '' );

  return filteredStrings;
}

function ChatItem( props ) {

  const subStrings = splitCodeSnippets( props.message );

  return (
    <ListGroup.Item className={props.user === 'me' ? styles.meChatItem : styles.botChatItem}>
      <div className={styles.iconWithMessage}>
        <div>
          {
            props.user === 'me' ? <img className={styles.chatIcon} src={'./media/images/person-icon.svg'}></img> :
            props.user === 'system' ? <img className={styles.chatIcon} src={'./favicon/favicon-16x16.png'}></img> :
            <img className={styles.chatIcon} src={'./media/images/ai-icon.svg'}></img>
          }
        </div>
        <div>
          {
            subStrings.map( ( subString, index ) => {
              if ( subString.includes( '```' ) ) {
                const withoutTicks = subString.replaceAll( '```js', '' ).replaceAll( '```', '' ).trim();
                return ( <div key={index}>
                  <SyntaxHighlighter language='javascript' style={darcula}>
                    {withoutTicks}
                  </SyntaxHighlighter>
                </div> );
              }
              else {
                return subString;
              }
            } )
          }
        </div>
      </div>
    </ListGroup.Item>
  );
}