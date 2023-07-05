import React from 'react';
import Button from 'react-bootstrap/Button';
import styles from './../CreatorMain.css';

export default function StyledButton( props ) {
  const disabled = props.disabled === true;
  const hidden = props.hidden === true;
  return (
    <div className={`${styles.controlElement} ${styles.inlineBlock}`}>
      <Button
        onClick={props.onClick}
        disabled={disabled}
        hidden={hidden}
        className={`${styles.customButton}`}
        type={props.type || 'button'}
      >{props.name}</Button>
    </div>
  );
}