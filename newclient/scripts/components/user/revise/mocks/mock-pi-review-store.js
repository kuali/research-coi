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

import {MockPIReviewActions} from './mock-pi-review-actions';
import alt from '../../../../../../../client/scripts/alt';

class _MockPIReviewStore {
  constructor() {
    this.bindActions(MockPIReviewActions);

    this.exportPublicMethods({
    });

    this.reviseId = 0;
    this.responseId = 0;
  }

  reviseDeclaration([reviewId]) {
    this.reviseId = reviewId;
  }

  respond([reviewId]) {
    this.responseId = reviewId;
  }
}

export const MockPIReviewStore = alt.createStore(_MockPIReviewStore, 'MockPIReviewStore');
