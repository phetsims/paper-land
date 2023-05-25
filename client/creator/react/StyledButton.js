import React from 'react';
import Button from 'react-bootstrap/Button';
import styles from './../CreatorMain.css';

export default function StyledButton( props ) {
  const disabled = props.disabled === true;
  return (
    <div className={`${styles.controlElement} ${styles.inlineBlock}`}>
      <Button
        onClick={props.onClick}
        disabled={disabled}
        className={`${styles.customButton}`}
      >{props.name}</Button>
    </div>
  );
}