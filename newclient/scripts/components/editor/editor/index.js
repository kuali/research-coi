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
import { Editor, RichUtils, Entity } from 'draft-js';
import BlockStyleControls from '../block-style-controls';
import InlineStyleControls from '../inline-style-controls';

const MAX_LIST_DEPTH = 2;

export default class _Editor extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      showURLInput: false,
      urlValue: ''
    };

    this.onChange = this.onChange.bind(this);
    this.handleKeyCommand = this.handleKeyCommand.bind(this);
    this.toggleInlineStyle = (style) => this._toggleInlineStyle(style);
    this.toggleBlockType = (type) => this._toggleBlockType(type);
    this._onTab = this._onTab.bind(this);
    this.promptForLink = this._promptForLink.bind(this);
    this.onURLChange = (e) => this.setState({urlValue: e.target.value});
    this.confirmLink = this._confirmLink.bind(this);
    this.cancelLink = this._cancelLink.bind(this);
    this.onLinkInputKeyDown = this._onLinkInputKeyDown.bind(this);
    this.removeLink = this._removeLink.bind(this);
  }

  onChange(editorState) {
    this.props.onChange(this.props.mapKey, editorState);
  }

  handleKeyCommand(command) {
    const newState = RichUtils.handleKeyCommand(this.props.editorState, command);
    if (newState) {
      this.onChange(newState);
      return true;
    }
    return false;
  }

  _toggleInlineStyle(inlineStyle) {
    this.onChange(
      RichUtils.toggleInlineStyle(
        this.props.editorState,
        inlineStyle
      )
    );
  }

  _toggleBlockType(blockType) {
    this.onChange(
      RichUtils.toggleBlockType(
        this.props.editorState,
        blockType
      )
    );
  }

  _onTab(evt) {
    const editorState = this.props.editorState;
    const newEditorState = RichUtils.onTab(evt, editorState, MAX_LIST_DEPTH);
    if (newEditorState !== editorState) {
      this.onChange(newEditorState);
    }
  }

  _promptForLink(e) {
    e.preventDefault();
    const selection = this.props.editorState.getSelection();
    if (!selection.isCollapsed()) {
      this.setState({
        showURLInput: true,
        urlValue: ''
      }, () => {
        setTimeout(() => this.refs.url.focus(), 0);
      });
    }
  }

  _confirmLink(e) {
    e.preventDefault();
    const {urlValue} = this.state;

    const entityKey = Entity.create('LINK', 'MUTABLE', {url: urlValue});
    this.onChange(RichUtils.toggleLink(
      this.props.editorState,
      this.props.editorState.getSelection(),
      entityKey
    ));

    this.setState({
      showURLInput: false,
      urlValue: ''
    }, () => {
      setTimeout(() => this.refs.editor.focus(), 0);
    });
  }

  _cancelLink(e) {
    e.preventDefault();
    this.setState({
      showURLInput: false,
      urlValue: ''
    }, () => {
      setTimeout(() => this.refs.editor.focus(), 0);
    });
  }

  _onLinkInputKeyDown(e) {
    if (e.which === 13) {
      this._confirmLink(e);
    }
  }

  _removeLink(e) {
    e.preventDefault();
    const selection = this.props.editorState.getSelection();
    if (!selection.isCollapsed()) {
      this.onChange(
         RichUtils.toggleLink(this.props.editorState, selection, null)
      );
    }
  }

  render() {
    let urlInput;
    if (this.state.showURLInput) {
      urlInput = (
        <div className={styles.urlInputContainer}>
          <input
            onChange={this.onURLChange}
            ref="url"
            className={styles.urlInput}
            type="text"
            value={this.state.urlValue}
            onKeyDown={this.onLinkInputKeyDown}
            placeholder="https://example.com/"
          />
          <div style={{display: 'inline-block', width: '30%', paddingLeft: '5px'}}>
            <button onMouseDown={this.confirmLink}>
              <i className={'fa fa-check'} />
            </button>
            <button onMouseDown={this.cancelLink}>
              <i className={'fa fa-times'} />
            </button>
          </div>
        </div>
      );
    }

    return (
      <div>
        <InlineStyleControls
          editorState={this.props.editorState}
          onToggle={this.toggleInlineStyle}
        />
        <BlockStyleControls
          editorState={this.props.editorState}
          onToggle={this.toggleBlockType}
        />
        <div className={styles.buttons}>
          <button
            onMouseDown={this.promptForLink}
            className={styles.button}
          >
            <i className={'fa fa-link'} />
          </button>
          <button
            onMouseDown={this.removeLink}
            className={styles.button}
          >
            <i className={'fa fa-unlink'} />
          </button>
          {urlInput}
        </div>

        <div id='editorTextArea' className={styles.textArea}>
          <Editor
            editorState={this.props.editorState}
            handleKeyCommand={this.handleKeyCommand}
            onChange={this.onChange}
            onTab={this._onTab}
            ref="editor"
          />
        </div>
      </div>
    );
  }
}