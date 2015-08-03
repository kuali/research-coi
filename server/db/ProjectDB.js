import {saveSingleRecord, getExistingSingleRecord, saveExistingSingleRecord, deleteExistingSingleRecord} from './CommonDB';

export let saveProject = (dbInfo, record, callback, optionalTrx) => {
  saveSingleRecord(dbInfo, record, callback, {table: 'project', pk: 'id'}, optionalTrx);
};

export let getExistingProject = (dbInfo, record, callback, optionalTrx) => {
  getExistingSingleRecord(dbInfo, record, callback, {table: 'project', pk: 'id'}, optionalTrx);
};

export let saveExistingProject = (dbInfo, record, callback, optionalTrx) => {
  saveExistingSingleRecord(dbInfo, record, callback, {table: 'project', pk: 'id'}, optionalTrx);
};

export let deleteExistingProject = (dbInfo, record, callback, optionalTrx) => {
  deleteExistingSingleRecord(dbInfo, record, callback, {table: 'project', pk: 'id'}, optionalTrx);
};
