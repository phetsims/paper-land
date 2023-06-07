/**
 * Main react component for the AI Harness page.
 */

import React, { useEffect, useState } from 'react';
import Form from 'react-bootstrap/Form';
import ListGroup from 'react-bootstrap/ListGroup';
import { combineClasses } from '../utils.js';
import styles from './AIHarnessMain.css';

export default function AIHarnessMain( props ) {

  // add react state for input an chatLog
  const [ input, setInput ] = useState( '' );

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

  const addChatMessage = async ( message, user, type ) => {
    const newChatLog = [ ...chatLog, { user: user, message: message, type: type } ];
    await setChatLog( newChatLog );
  };

  // Basically componentDidMount for functional React.
  useEffect( () => {

    // Test the connection to OpenAI
    async function checkConnection() {
      try {
        const response = await fetch( 'http://localhost:3000/openai/connect', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          }
        } );
        const jsonData = await response.json();
        await addChatMessage( jsonData.data.content, 'ai', 'chat' );
      }
      catch( error ) {
        await addChatMessage( 'Failure to connect.', 'system', 'error' );
      }
    }

    checkConnection();
  }, [] );

  const handleSubmit = async event => {

    // no page refresh on submit
    event.preventDefault();

    const newChatLog = [ ...chatLog, { user: 'me', message: input, type: 'chat' } ];
    await setChatLog( newChatLog );

    setInput( '' );

    // for chat, we feed all previous messages for a new response
    // const allMessages = newChatLog.map( message => message.message ).join( '\n' );

    const response = await fetch( 'http://localhost:3000/openai/query', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify( { prompt: input } )
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
  };

  return (
    <div className={styles.container}>
      <div className={combineClasses( styles.row, styles.panelClass, styles.chatRow )}>
        <div className={styles.chatForm}>
          <div className={styles.chatOutput}>
            <ListGroup variant='flush'>
              {
                chatLog.map( ( logItem, index ) => (
                  <ChatItem key={index} user={logItem.user} message={logItem.message} type={logItem.type}/>
                ) )
              }
            </ListGroup>
          </div>
          <div className={styles.chatInput}>
            <form onSubmit={handleSubmit}>
              <Form.Control
                type='text'
                rows={3}
                placeholder='Prompt...'
                value={input}
                onChange={event => setInput( event.target.value )}
              />
            </form>
          </div>
        </div>
      </div>
      <div className={combineClasses( styles.row, styles.panelClass, styles.controlsRow )}> Scenery</div>
    </div>
  );
}

function ChatItem( props ) {
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
        <span className={styles.chatMessage}>{props.message}</span>
      </div>
    </ListGroup.Item>
  );
}