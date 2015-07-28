import _ from 'lodash';

export function camelizeJson(attrs) {
  return _.reduce(attrs, function(obj, val, key) {
    if (val instanceof Array) {
      val = _.map(val, function(e) {
        return camelizeJson(e);
      });
    }
    obj[_.camelCase(key)] = val;
    return obj;
  }, {});
}
