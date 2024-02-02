import React from 'react';
import Button from 'react-bootstrap/Button';
import styles from './../CreatorMain.css';

export default function StyledButton( props ) {
  const disabled = props.disabled === true;
  const hidden = props.hidden === true;

  // Additional class names you can provide to further style the button
  const otherClassNames = props.otherClassNames || '';
  const overrideClassName = props.overrideClassName || '';

  // Use the override if provided, otherwise it will be a combination of default styling with additionals
  const className = overrideClassName || `${styles.controlElement} ${styles.inlineBlock} ${otherClassNames}`;
  return (
    <div className={className}>
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