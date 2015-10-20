import LRU from 'lru-cache';

let config;
let options = {
  length: function(n) { return n.length; }
};
try {
  let extensions = require('research-extensions');
  config = extensions.config;
  options.max = config.cacheMax || 500;
  options.maxAge = config.cacheMaxAge || 60000;
}
catch (err) {
  options.max = process.env.CACHE_MAX || 500;
  options.maxAge = process.env.CACHE_MAX_AGE || 60000;
}

let cache = LRU(options); // eslint-disable-line new-cap

export default cache;
