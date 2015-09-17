import _ from 'lodash';

function izeJson(attrs, caseFunc) {
  if (!caseFunc) {
    throw new Error('must provide a case function');
  }

  if (!attrs) {
    return attrs;
  }

  return _.reduce(attrs, function(obj, val, key) {
    if (val instanceof Array) {
      val = _.map(val, function(e) {
        return izeJson(e, caseFunc);
      });
    } else if (val instanceof Date) {
      obj[caseFunc(key)] = val;
    } else if (val instanceof Object) {
      val = izeJson(val, caseFunc);
    }
    obj[caseFunc(key)] = val;
    return obj;
  }, {});
}

/**
 * This takes json object in a non-camel case format and camel cases it.  It handles nested objects and arrays.  Passing null will return null.
 *
 * Example: input - {foo_bar: 'baz'}, output - {fooBar: 'baz'}
 */
export function camelizeJson(attrs) {
  return izeJson(attrs, _.camelCase);
}

/**
 * This takes json object in a non-snake case format and snake cases it.  It handles nested objects and arrays.  Passing null will return null.
 *
 * Example: input - {fooBar: 'baz'}, output - {foo_bar: 'baz'}
 */
export function snakeizeJson(attrs) {
  return izeJson(attrs, _.snakeCase);
}


