

export default (obj1, obj2) => {
  let propertiesChanged = [];
  function deepEqual (x, y, first) {
    const ok = Object.keys, tx = typeof x, ty = typeof y;
    return x && y && tx === 'object' && tx === ty ? (
      ok(x).length === ok(y).length &&
        ok(x).every(key => {
          const equal = deepEqual(x[key], y[key]);
          if (!equal) propertiesChanged.push(key);
          return equal;
        })
    ) : (x === y);
  }

  const eq = deepEqual(obj1, obj2, true);

  return { equals: eq, propertiesChanged };
};
