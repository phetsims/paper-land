/**
 * Main react component for the CreatorAI page.
 */

import React, { useState } from 'react';
import Form from 'react-bootstrap/Form';
import ListGroup from 'react-bootstrap/ListGroup';
import { combineClasses } from '../utils.js';
import styles from './CreatorAIMain.css';

export default function CreatorAIMain( props ) {

  // add react state for input an chatLog
  const [ input, setInput ] = useState( '' );

  // Items of the log, with values { user: 'me' | 'ai', message: String, type: 'chat' | 'error' }
  const [ chatLog, setChatLog ] = useState( [] );

  const handleSubmit = async event => {

    // no page refresh on submit
    event.preventDefault();

    const newChatLog = [ ...chatLog, { user: 'me', message: input, type: 'chat' } ];
    await setChatLog( newChatLog );

    setInput( '' );


    // for chat, we feed all previous messages for a new response
    const allMessages = newChatLog.map( message => message.message ).join( '\n' );

    const response = await fetch( 'http://localhost:3000/openai', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify( { prompt: allMessages } )
    } );

    const data = await response.json();

    if ( data.error ) {
      await setChatLog( [ ...newChatLog, { user: 'ai', message: data.error.message, type: 'error' } ] );
    }
    else if ( data.choices.length > 0 ) {
      await setChatLog( [ ...newChatLog, { user: 'ai', message: data.choices[ 0 ].text, type: 'chat' } ] );
    }
  };

  return (
    <div className={styles.container}>
      <div className={combineClasses( styles.row, styles.panelClass )}>
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
                placeholder='What do you want to create?'
                value={input}
                onChange={event => setInput( event.target.value )}
              />
            </form>
          </div>
        </div>
      </div>
      <div className={combineClasses( styles.row, styles.panelClass )}> Scenery</div>
    </div>
  );
}

function ChatItem( props ) {
  return (
    <ListGroup.Item className={props.user === 'me' ? styles.meChatItem : styles.botChatItem}>
      <div className={styles.iconWithMessage}>
        <div>
          {
            props.user === 'me' ?
            <img className={styles.chatIcon} src={'./media/images/person-icon.svg'}></img> :
            <img className={styles.chatIcon} src={'./media/images/ai-icon.svg'}></img>
          }
        </div>
        <p className={styles.chatMessage}>{props.message}</p>
      </div>
    </ListGroup.Item>
  );
}