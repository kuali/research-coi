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

import * as FileService from '../services/file-service/file-service';
import {ROLES, FILE_TYPE} from '../../coi-constants';
import {isDisclosureUsers} from './common-db';

export async function getFile(knex, userInfo, id) {
  const criteria = {
    id
  };
  const query = knex
    .first(
      'name',
      'key',
      'file_type'
    )
    .from('file')
    .where(criteria);

  if (userInfo.coiRole === ROLES.ADMIN || userInfo.coiRole === ROLES.REVIEWER) {
    return query;
  }

  const file = await query;
  if (file && file.file_type === FILE_TYPE.MANAGEMENT_PLAN) {
    return await knex
      .first('f.name', 'f.key')
      .from('file as f')
      .innerJoin('disclosure as d', 'd.id', 'f.ref_id')
      .where(function() {
        this.where({'f.user_id': userInfo.schoolId})
          .orWhere({'d.user_id': userInfo.schoolId});
      })
      .andWhere({'f.id': id});
  }
  return await query.andWhere({
    user_id: userInfo.schoolId
  });
}

export function getFiles(knex, userInfo, refId, fileType) {
  const query = knex
    .select('name', 'key')
    .from('file')
    .where({
      file_type: fileType,
      ref_id: refId
    });

  if (userInfo.coiRole === ROLES.ADMIN || userInfo.coiRole === ROLES.REVIEWER) {
    return query;
  }

  if (fileType === FILE_TYPE.MANAGEMENT_PLAN) {
    return knex
      .select(
        'f.name',
        'f.key'
      )
      .from('file as f')
      .innerJoin('disclosure as d', 'd.id', 'f.ref_id')
      .where(function() {
        this.where({'f.user_id': userInfo.schoolId})
          .orWhere({'d.user_id': userInfo.schoolId});
      })
      .andWhere({
        'f.file_type': fileType,
        'f.ref_id': refId
      });
  }
  return query.andWhere({
    user_id: userInfo.schoolId
  });
}

export async function saveNewFiles(knex, body, files, userInfo) {
  if (
    body.type !== FILE_TYPE.DISCLOSURE &&
    body.type !== FILE_TYPE.MANAGEMENT_PLAN &&
    body.type !== FILE_TYPE.FINANCIAL_ENTITY &&
    body.type !== FILE_TYPE.ADMIN
  ) {
    throw Error(
      `Attempt by ${userInfo.username} to upload an unknown file type`
    );
  }

  const isSubmitter = await isDisclosureUsers(
    knex,
    body.disclosureId,
    userInfo.schoolId
  );

  if (!isSubmitter && userInfo.coiRole !== ROLES.ADMIN) {
    throw Error(`Attempt by ${userInfo.username} to upload a file for disclosure ${body.disclosureId} which isnt theirs`); // eslint-disable-line max-len
  }

  const fileData = [];

  for (const file of files) {
    const fileDatum = {
      fileType: body.type,
      refId: body.refId,
      type: file.mimetype,
      key: file.filename,
      name: file.originalname,
      userId: userInfo.schoolId,
      uploadedBy: userInfo.name,
      uploadDate: new Date()
    };
    const fileId = await knex('file')
      .insert({
        file_type: fileDatum.fileType,
        ref_id: fileDatum.refId,
        type: fileDatum.type,
        key: fileDatum.key,
        name: fileDatum.name,
        user_id: fileDatum.userId,
        uploaded_by: fileDatum.uploadedBy,
        upload_date: fileDatum.uploadDate
      }, 'id');
    
    fileDatum.id = fileId[0];
    fileData.push(fileDatum);
  }

  return fileData;
}

export async function deleteFiles(dbInfo, knex, userInfo, fileId) {
  const criteria = {
    id: fileId
  };

  if (userInfo.coiRole !== ROLES.ADMIN) {
    criteria.user_id = userInfo.schoolId;
  }

  const file = await knex('file')
    .first('key')
    .where(criteria);

  await knex('file')
    .del()
    .where(criteria);

  await new Promise((resolve, reject) => {
    FileService.deleteFile(dbInfo, file.key, err => {
      if (err) {
        reject(err);
      } else {
        resolve();
      }
    });
  });
}
