/*
    The Conflict of Interest (COI) module of Kuali Research
    Copyright © 2015 Kuali, Inc.

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
