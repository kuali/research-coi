import fs from 'fs';
import path from 'path';

export default function viewRenderer(req, res) {
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
    res.status(404).end();
    return;
  }

  fs.stat(path.join('views', view + '.html'), err => {
    if (err) {
      res.status(404).end();
    }
    else {
      res.sendFile(view + '.html', {
        root: 'views'
      });
    }
  });
}
