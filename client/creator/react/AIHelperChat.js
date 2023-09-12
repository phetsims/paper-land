import React, { useState } from 'react';
import { Accordion, Form } from 'react-bootstrap';
import { Light as SyntaxHighlighter } from 'react-syntax-highlighter';
import js from 'react-syntax-highlighter/dist/esm/languages/hljs/javascript';
import { atomOneDark } from 'react-syntax-highlighter/dist/esm/styles/hljs';
import { createSetterFunctionString, getComponentDocumentation } from '../../utils.js';
import styles from './../CreatorMain.css';
import StyledButton from './StyledButton.js';

// a light build of syntax highlighter has a lower
SyntaxHighlighter.registerLanguage( 'javascript', js );

const generateChatResponse = async inputString => {
  try {
    const response = await fetch( `${window.location.origin}/openai`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify( { promptString: inputString } )
    } );

    const data = await response.json();
    if ( data.response && data.response.message && data.response.message.content ) {
      return data.response.message.content;
    }
    else {
      return 'Failure to get response. Make sure your OpenAI key is correct.';
    }
  }
  catch( error ) {
    console.error( error );
    return 'Failure to get response.';
  }
};

const createInitialPromptString = ( settableComponents, variableComponents, additionalContent, userPrompt ) => {

  // The setter functions, combined into a single string separated by new lines
  let setterFunctionDocumentation = 'NONE_AVAILABLE';
  if ( settableComponents.length > 0 ) {
    setterFunctionDocumentation = settableComponents.map( component => {
      return createSetterFunctionString( component );
    } ).join( '\n' );
  }

  // The variable documentation, combined into a single string separated by new lines
  let variableFunctionDocumentation = 'NONE_AVAILABLE';
  if ( variableComponents.length > 0 ) {
    variableFunctionDocumentation = variableComponents.map( component => {
      return getComponentDocumentation( component );
    } ).join( '\n' );
  }

  return `I have the following functions.
${setterFunctionDocumentation}

And the following variables, which can be used in your implementation. But they cannot be changed directly.
${variableFunctionDocumentation}

${additionalContent}

${userPrompt}

I can only write code inside of a function body so if you have to use new variables, please assign them to the 'window' object. DO NOT assign provided variables to the window.

Please make the code as simple and short as possible and only use the functions and variables that you need. Then, can you briefly explain each line as if I were a novice developer?
  `;
};

const AIHelperChat = props => {

  // These are the messages that are displayed in the chat
  // Array of { text: string, isUser: boolean }
  const [ messages, setMessages ] = useState( [] );

  // The state for the input text
  const [ inputText, setInputText ] = useState( '' );

  const [ waitingForResponse, setWaitingForResponse ] = useState( false );

  // {string[]} The actual messages that are sent to OpenAI - the same as messages for the most part,
  // but with some extra content to make the AI output more helpful.
  const [ decoratedMessages, setDecoratedMessages ] = useState( [] );

  // Function to handle user input and generate a response
  const handleSendMessage = async () => {
    if ( inputText.trim() === '' ) {
      return;
    }

    // Create a copy of the current messages array and update it with the new user message
    const newMessage = { text: inputText, isUser: true };
    const updatedMessages = [ ...messages, newMessage ];
    setMessages( updatedMessages );

    // The first message is decorated with extra prompting that is not displayed to the user
    const updatedDecoratedMessages = [ ...decoratedMessages ];
    if ( decoratedMessages.length === 0 ) {
      const initialPrompt = ( createInitialPromptString(
        props.settableComponents || [],
        props.variableComponents || [],
        props.additionalPromptContent || '',
        inputText
      ) );

      updatedDecoratedMessages.push( initialPrompt );
    }
    else {

      // Add the user message to the decorated messages array
      updatedDecoratedMessages.push( inputText );
    }

    // Clear the text input right away
    setInputText( '' );

    // combine all decorated messages into a single string to send to OpenAI
    const prompt = updatedDecoratedMessages.join( '\n' );
    console.log( updatedDecoratedMessages );

    // Set the waiting for response flag
    setWaitingForResponse( true );

    // Generate response using ChatGPT and update UI
    const response = await generateChatResponse( prompt ); // Replace with your integration

    // Create a copy of the updated messages array and update it with the new response message
    const updatedResponseMessage = { text: response, isUser: false };
    const updatedMessagesWithResponse = [ ...updatedMessages, updatedResponseMessage ];
    setMessages( updatedMessagesWithResponse );

    // add the response to decorated messages, since that is what we feed to the AI
    updatedDecoratedMessages.push( response );

    // set state for updated decorated messages
    setDecoratedMessages( updatedDecoratedMessages );

    // no longer waiting for a response
    setWaitingForResponse( false );
  };

  return (
    <div>
      <Accordion defaultActiveKey={null}>
        <Accordion.Item>
          <Accordion.Header>AI Assistance &#x2728;</Accordion.Header>
          <Accordion.Body>
            <div>
              {messages.map( ( message, index ) => (
                <div
                  key={index}
                  className={`message ${message.isUser ? 'user' : 'response'}`}
                >{
                  message.isUser ? (
                    <>
                      <strong>User: </strong>
                      <p>{message.text}</p>
                    </>
                  ) : (
                    <div>
                      <strong>AI: </strong>
                      {message.text.split( '```' ).map( ( part, partIndex ) => {
                        if ( partIndex % 2 === 0 ) {
                          return <div className={styles.aiResponse} key={partIndex}>{part}</div>;
                        }
                        else {
                          return (
                            <SyntaxHighlighter
                              key={partIndex}
                              language='JavaScript'
                              style={atomOneDark}
                            >
                              {

                                // remove any javascript annotations from the code snippet
                                part.replace( 'javascript', '' )
                              }
                            </SyntaxHighlighter>
                          );
                        }
                      } )}
                    </div>
                  )}
                  <hr></hr>
                </div>
              ) )}
              <div hidden={!waitingForResponse}>
                <strong>Thinking...</strong>
                <hr></hr>
              </div>
              <Form onSubmit={async event => {
                event.preventDefault();
                await handleSendMessage();
              }}>
                <Form.Control
                  type='text'
                  value={inputText}
                  placeholder='How can I help you?'
                  disabled={waitingForResponse}
                  onChange={event => setInputText( event.target.value )}
                />
              </Form>
              <div>
                <StyledButton
                  name='Send'
                  onClick={handleSendMessage}
                  otherClassNames={styles.horizontalPadding}>
                </StyledButton>
                <StyledButton
                  name='Clear'
                  onClick={() => {
                    setMessages( [] );
                    setDecoratedMessages( [] );
                  }}
                  otherClassNames={styles.horizontalPadding}>
                </StyledButton>
              </div>
            </div>
          </Accordion.Body>
        </Accordion.Item>
      </Accordion>
    </div>
  );
};

export default AIHelperChat;