import React from 'react/addons';

export function merge(initial, ...toMerge) {
  let result = initial;
  if (toMerge) {
    for (let i = 0; i < toMerge.length; i++) {
      if (toMerge[i]) {
        result = React.addons.update(result, {$merge: toMerge[i]});
      }
    }
  }
  return result;
}
