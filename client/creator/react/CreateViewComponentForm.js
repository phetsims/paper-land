import React from 'react';
import Tab from 'react-bootstrap/Tab';
import Tabs from 'react-bootstrap/Tabs';
import styles from './../CreatorMain.css';
import StyledButton from './StyledButton.js';

export default function CreateViewComponentForm( props ) {

  if ( !props.onComponentCreated ) {
    throw new Error( 'The onComponentCreated prop is required.' );
  }

  const handleCreateComponent = () => {
    props.onComponentCreated();
  };

  return (
    <>
      <Tabs
        defaultActiveKey={'shapes'}
        className={styles.tabs}
        variant={'pill'}
        justify
      >
        <Tab eventKey='shapes' title='Shapes' tabClassName={styles.tab}>
          TODO: Select a model component, a shape, and describe how the model component will manipulate it (scale, position, fill, stroke, etc).
        </Tab>
        <Tab eventKey='background' title='Background' tabClassName={styles.tab}>
          TODO: Select a model component and describe how its values change the background color.
        </Tab>
        <Tab eventKey='images' title='Images' tabClassName={styles.tab}>
          TODO: Select a model component and describe how its values change an image (path, scale, position, rotation, etc...).
        </Tab>
        <Tab eventKey='sounds' title='Sounds' tabClassName={styles.tab}>
          TODO: Select a model component, a shape, and how that model component changes the shape view.
        </Tab>
        <Tab eventKey='description' title='Description' tabClassName={styles.tab}>
          TODO: Select a model component and describe how its values create a description. Select if the description will speak every change.
        </Tab>
        <Tab eventKey='vibration' title='Vibration' tabClassName={styles.tab}>
          TODO: Select a model component and describe how its values change vibration patterns. Select if vibration should happen every change.
        </Tab>
      </Tabs>
      <StyledButton disabled={true} name={'Create Component'} onClick={handleCreateComponent}></StyledButton></>
  );
}