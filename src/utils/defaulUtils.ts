type AnyObject = {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [key: string]: any;
};

export function findDifferenceBetweenTwoObjects(obj1: AnyObject, obj2: AnyObject): AnyObject {
  const diffObj: AnyObject = {};

  // Iterate over keys in obj1
  for (const key in obj1) {
    if (!(key in obj2) || obj1[key] !== obj2[key]) {
      diffObj[key] = obj2[key];
    }
  }

  // Iterate over keys in obj2
  for (const key in obj2) {
    if (!(key in obj1) || obj1[key] !== obj2[key]) {
      if (!Object.prototype.hasOwnProperty.call(diffObj, key)) {
        diffObj[key] = obj2[key];
      }
    }
  }

  return diffObj;
}
