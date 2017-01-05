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

export class SizeAwareComponent extends React.Component {
  handleResize() {
    window.size = window.innerWidth < 100 ? 'SMALL' : 'LARGE'; // disabled for now, 800 probably a good size
    this.updateBodyOverflow();
    this.forceUpdate();
  }

  updateBodyOverflow() {
    document.body.style.overflow = window.size === 'SMALL' ? 'hidden' : 'initial';
  }

  componentWillMount() {
    this.handleResize();
    window.addEventListener('resize', this.handleResize.bind(this));
  }
}
