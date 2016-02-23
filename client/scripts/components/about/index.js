/*
    The Conflict of Interest (COI) module of Kuali Research
    Copyright © 2015 Kuali, Inc.

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
import React from 'react';

export default class About extends React.Component {
  render() {
    return (
      <div className={styles.content}>
        <h1 className={styles.heading}>Acknowledgements</h1>
        <p className={styles.paragraph}>
          Copyright 2005-2016 Kuali, Inc. All rights reserved. Kuali Research is licensed for use
          pursuant to the Affero General Public License, version 3. Portions of this software are
          copyrighted by other parties, including the parties listed below. Questions about licensing
          should be directed to legal@kuali.co.
        </p>

        <h1 className={styles.heading}>Third Party Contributions</h1>
        <p className={styles.paragraph}>
          This product includes software developed by:<br />
          The Apache Software Foundation (http://www.apache.org), licensed under the Apache
          Software License versions 1.0, and 2.0
        </p>
      </div>
    );
  }
}
