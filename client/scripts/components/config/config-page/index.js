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

import styles from './style';
import classNames from 'classnames';
import React from 'react';
import {AppHeader} from '../../app-header';
import Sidebar from '../sidebar';
import ActionPanel from '../action-panel';

export default function ConfigPage(props) {
  return (
    <div className={'flexbox column'} style={{minHeight: '100%'}}>
      <AppHeader className={`${styles.override} ${styles.header}`} moduleName={'Conflict Of Interest'} />
      <span className={classNames('fill', 'flexbox', 'row', styles.container, props.className)}>
        <Sidebar active={props.routeName} />
        <span className={`inline-flexbox column fill ${styles.content}`}>
          <div className={styles.stepTitle}>
            {props.title}
          </div>
          <div className={`fill flexbox row ${styles.configurationArea}`}>
            <span className={'fill'} style={{display: 'inline-block'}}>
              {props.children}
            </span>
            <ActionPanel visible={props.dirty} />
          </div>
        </span>
      </span>
    </div>
  );

}
