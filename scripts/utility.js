function getDocFrag(id) {
  return window.data.index[id];
}

function sortObjectByKey(obj) {
  const sortedKeys = Object.keys(obj).sort();
  const sortedByKeys = {};
  sortedKeys.forEach((key) => {
    sortedByKeys[key] = obj[key];
  });
  return sortedByKeys;
}
