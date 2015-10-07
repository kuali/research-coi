import fs from 'fs';
import path from 'path';

let filePath = process.env.LOCAL_FILE_DESTINATION || 'uploads/';

export function getFile(dbInfo, key, callback) {
  let stream = fs.createReadStream(path.join(filePath, key));
  stream.on('error', err=>{
    callback(err);
  });
  return stream;
}

export function deleteFile(key, callback) {
  fs.unlink(path.join(filePath, key), err=>{
    callback(err);
  });
}
