import styles from './style';
import React from 'react';
import ConfigActions from '../../../../actions/ConfigActions';

export default function ExpandInstructionsToggle(props) {
  return (
    <div className={styles.container}>
      <input
        type="checkbox"
        id="expandInstructionByDefault"
        checked={props.checked}
        onChange={ConfigActions.toggleInstructionsExpanded}
        className={styles.checkbox}
      />
      <label htmlFor="expandInstructionByDefault" className={styles.label}>
        Expand instructions by default
      </label>
    </div>
  );
}
