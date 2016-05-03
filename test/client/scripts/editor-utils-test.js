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

/*global describe, it, beforeEach */
/* eslint-disable no-magic-numbers */
import assert from 'assert';
import { EditorState, ContentState, convertToRaw } from 'draft-js';
import { prepareInstructionsForSave, createEditorStates} from '../../../client/scripts/editor-utils';

describe('EditorUtils', () => {
  describe('prepareInstructionsForSave', () => {
    it('should remove the element from the array', () => {
      const editorStates = {
        one: EditorState.createWithContent(ContentState.createFromText('one')),
        two: EditorState.createWithContent(ContentState.createFromText('two'))
      };
      const instructions = prepareInstructionsForSave(editorStates);
      assert.equal('one', instructions.one.blocks[0].text = 'one');
      assert.equal('two', instructions.two.blocks[0].text = 'two');
    });
  });

  describe('createEditorState', () => {
    const text = {
      one: 'one',
      two: 'two'
    };

    const richText = {
      one: convertToRaw(ContentState.createFromText('richOne')),
      two: convertToRaw(ContentState.createFromText('richTwo'))
    };

    it('should create editor states from text instructions', () => {
      const editorStates = createEditorStates(text, undefined);
      assert('one',editorStates.one.getCurrentContent().getBlocksAsArray()[0].text);
      assert('two',editorStates.two.getCurrentContent().getBlocksAsArray()[0].text);
    });

    it('should create editor states from rich text instructions', () => {
      const editorStates = createEditorStates(text, richText);
      assert('richOne',editorStates.one.getCurrentContent().getBlocksAsArray()[0].text);
      assert('richTwo',editorStates.two.getCurrentContent().getBlocksAsArray()[0].text);
    });
  });
});
