/*
    The Conflict of Interest (COI) module of Kuali Research
    Copyright © 2005-2016 Kuali, Inc.

    This program is free software: you can redistribute it and/or modify
    it under the terms of the GNU Affero General Public License as
    published by the Free Software Foundation, either version 3 of the
    License, or (at your option) any later version.

    This program is distributed in the hope that it will be useful,
    but WITHOUT ANY WARRANTY; without even the implied warranty of
    MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
    GNU Affero General Public License for more details.

    You should have received a copy of the GNU Affero General Public License
    along with this program.  If not, see <http://www.gnu.org/licenses/>
*/

import ReactModal from 'react-modal';
import React from 'react';
import styles from './style';

export default function(props) {
  const onClose = props.onRequestClose !== undefined ? props.onRequestClose : () => {};
  return (
    <ReactModal
      isOpen={props.isOpen !== undefined ? props.isOpen : true}
      onRequestClose={onClose}
      className={styles.modal}
      overlayClassName={styles.overlay}
      style={props.style !== undefined ? props.style : undefined}
    >
      <div className={styles.top}>
        <i
          className={`fa fa-times ${styles.closeIcon}`}
          aria-hidden="true"
          onClick={onClose}
        />
      </div>
      {props.children ? props.children : null}
    </ReactModal>
  );
}
