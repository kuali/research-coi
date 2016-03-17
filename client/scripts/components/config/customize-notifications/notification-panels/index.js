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
import React from 'react';
import ConfigActions from '../../../../actions/config-actions';
import Panel from '../../panel';
import NotificationToggle from '../notification-toggle';
import Textarea from '../../textarea';
import Text from '../../text';
import Link from '../../link';
import CancelButton from '../cancel-button';
import DoneButton from '../done-button';

export default class NotificationPanels extends React.Component {
  constructor() {
    super();

    this.createTemplateMap = this.createTemplateMap.bind(this);
  }

  createTemplateMap() {
    const templateMap = {};

    this.props.notificationTemplates.forEach((template, index) => {
      template.index = index;
      if (!templateMap[template.type]) {
        templateMap[template.type] = [template];
      } else {
        templateMap[template.type].push(template);
      }
    });

    return templateMap;
  }

  render() {
    const panels = [];
    const templateMap = this.createTemplateMap();
    for(const key in templateMap) {
      if (templateMap.hasOwnProperty(key)) {
        const toggles = templateMap[key].map(template => { //eslint-disable-line no-loop-func
          let link;
          let buttons;
          let templateContent;

          if (template.active === 1) {
            let path;
            let subject;
            let body;
            if (!template.editing && !template.error) {

              path = `config.notificationTemplates[${template.index}]`;
              subject = this.props.notificationTemplates[template.index].subject;
              body = this.props.notificationTemplates[template.index].body;
              link = (
                <Link
                  path={path}
                  onClick={ConfigActions.editNotificationTemplate}
                  value="EDIT"
                  className={styles.editLink}
                />
              );
            } else if (!template.error) {
              path = `applicationState.notificationEdits[${template.templateId}]`;
              subject = this.props.notificationEdits[template.templateId].subject;
              body = this.props.notificationEdits[template.templateId].body;
              buttons = (
                <div style={{float: 'right'}}>
                  <CancelButton
                    path={`config.notificationTemplates[${template.index}].editing`}
                    onClick={ConfigActions.cancelNotificationTemplate}
                    templateId={template.templateId}
                  >
                    Cancel
                  </CancelButton>
                  <DoneButton
                    path={`config.notificationTemplates[${template.index}]`}
                    onClick={ConfigActions.doneNotificationTemplate}
                    templateId={template.templateId}
                  >
                    DONE
                  </DoneButton>
                </div>
              );
            }

            if (template.error) {
              templateContent = (
                <div style={{color: 'red'}}>
                  Notification Service is down please contanct system admin
                </div>
              );
            } else {
              templateContent = (
                <div className={styles.template}>
                  <Text
                    path={`${path}.subject`}
                    label="SUBJECT"
                    value={subject}
                    labelStyle={styles.label}
                    readOnly={!template.editing}
                    dirty={false}
                  />
                  <Textarea
                    path={`${path}.body`}
                    label="BODY"
                    value={body}
                    className={styles.textarea}
                    labelStyle={styles.label}
                    readOnly={!template.editing}
                    dirty={false}
                  />
                </div>
              );
            }
          }
          return (
            <div key={template.index} className={styles.container}>
              <NotificationToggle
                onChange={ConfigActions.toggle}
                propertyPath={`config.notificationTemplates[${template.index}].active`}
                defaultValue={template.active === 1 ? true : false}
              />
              <div style={{width: '75%', display: 'inline-block'}}>
                <div className={styles.description}>
                  {template.description}
                </div>
                {templateContent}
                {buttons}
              </div>
              <div style={{width: '10%', display: 'inline-block', verticalAlign: 'top'}}>
                {link}
              </div>
            </div>
          );
        });

        panels.push(
          <Panel title={key} key={key}>
            {toggles}
          </Panel>
        );
      }
    }

    return(
      <div>
        {panels}
      </div>
    );
  }
}
