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

import React from 'react';
import styles from './style.css';
import EditorButton from '../editor-button';
const INLINE_STYLES = [
  {icon: 'fa-bold', style: 'BOLD'},
  {icon: 'fa-italic', style: 'ITALIC'},
  {icon: 'fa-underline', style: 'UNDERLINE'}
];

export default function InlineStyleControls(props) {
  const currentStyle = props.editorState.getCurrentInlineStyle();
  return (
    <div className={styles.controls}>
      {INLINE_STYLES.map(type =>
        <EditorButton
          key={type.style}
          active={currentStyle.has(type.style)}
          icon={type.icon}
          onToggle={props.onToggle}
          style={type.style}
        />
      )}
    </div>
  );
}
