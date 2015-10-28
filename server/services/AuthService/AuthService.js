import * as authClient from './authClient';
import * as mockAuthClient from './mockAuthClient';

let client;

try {
  let extensions = require('research-extensions');
  client = authClient;
} catch (e) {
  client = process.env.AUTH_ENABLED === true ? authClient : mockAuthClient;
}


export function getUserInfo(dbInfo, hostname, authToken) {
  return client.getUserInfo(dbInfo, hostname, authToken);
}

export function getAuthLink(req) {
  return client.getAuthLink(req);
}

export function authView(req, res) {
  return client.authView(req, res);
}