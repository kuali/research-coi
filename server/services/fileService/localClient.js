import fs from 'fs';

export function getFile(key, callback) {
  let stream = fs.createReadStream(key);
  stream.on('error', err=>{
    callback(err);
  });
  return stream;
}

export function deleteFile(key, callback) {
  fs.unlink(key, err=>{
    callback(err);
  });
}
