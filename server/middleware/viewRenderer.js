import fs from 'fs';
import path from 'path';

export default function viewRenderer(req, res, next) {
  try {
    let view = req.path;
    if (view === '' || view === '/') {
      view = 'index';
    }
    else if (view.endsWith('/')) {
      res.redirect(req.originalUrl.substring(0, req.originalUrl.length - 1));
      return;
    }

    // Prevent path traversal
    view = view.replace(/\//g, '');
    if (view.search(/[%.]/) >= 0) {
      sendUnauthorized(res);
      return;
    }

    fs.stat(path.join('views', view + '.html'), err => {
      try {
        if (err) {
          if (req.userInfo.coiRole === 'admin') {
            fs.stat(path.join('views', 'admin', view + '.html'), adminErr => {
              try {
                if (adminErr) {
                  sendUnauthorized(res);
                  return;
                }
                else {
                  res.sendFile(path.join('admin', view + '.html'), {
                    root: 'views'
                  });
                }
              }
              catch (e) {
                next(e);
              }
            });
          }
          else {
            sendUnauthorized(res);
            return;
          }
        }
        else {
          res.sendFile(view + '.html', {
            root: 'views'
          });
        }
      }
      catch (e) {
        next(e);
      }
    });
  }
  catch(e) {
    next(e);
  }
}

let sendUnauthorized = (res) => {
  res.status(403).sendFile('unauthorized.html', {
    root: 'views'
  });
};
