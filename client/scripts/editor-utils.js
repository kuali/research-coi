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

import { EditorState, ContentState, convertToRaw, convertFromRaw, CompositeDecorator, Entity } from 'draft-js';
import { Link } from './components/editor/editor-link';

function findLinkEntities(contentBlock, callback) {
  contentBlock.findEntityRanges(
    (character) => {
      const entityKey = character.getEntity();
      return (
        entityKey !== null &&
        Entity.get(entityKey).getType() === 'LINK'
      );
    },
    callback
  );
}

export const decorator = new CompositeDecorator([
  {
    strategy: findLinkEntities,
    component: Link
  }
]);

export function prepareInstructionsForSave(editorStates) {
  const richTextInstructions = {};
  for (const key in editorStates) {
    if (editorStates.hasOwnProperty(key)) {
      richTextInstructions[key] = convertToRaw(editorStates[key].getCurrentContent());
    }
  }
  return richTextInstructions;
}

function createEditorStatesFromText(instructions) {
  const editorStates = {};
  for (const key in instructions) {
    if (instructions.hasOwnProperty(key)) {
      const instruction = instructions[key];
      if (instruction) {
        editorStates[key] = EditorState.createWithContent(ContentState.createFromText(instruction), decorator);
      } else {
        editorStates[key] = EditorState.createEmpty(decorator);
      }
    }
  }
  return editorStates;
}

function createEditorStatesFromContentState(instructions) {
  const editorStates = {};
  for (const key in instructions) {
    if (instructions.hasOwnProperty(key)) {
      const instruction = instructions[key];
      if (instruction) {
        const blocks = convertFromRaw(instruction);
        editorStates[key] = EditorState.createWithContent(ContentState.createFromBlockArray(blocks),decorator);
      } else {
        editorStates[key] = EditorState.createEmpty(decorator);
      }
    }
  }
  return editorStates;
}

export function createEditorStates(instructions, richTextInstructions) {
  if (richTextInstructions) {
    return createEditorStatesFromContentState(richTextInstructions);
  }
  return createEditorStatesFromText(instructions);
}