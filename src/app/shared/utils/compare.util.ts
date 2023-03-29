export const objectDeepEquals = (a: any, b: any): boolean => {
  if (a === b) {
    return true;
  }

  if (a && b && typeof a === 'object' && typeof b === 'object') {
    const keys = Object.keys(a as object);

    if (keys.length !== Object.keys(b as object).length) {
      return false;
    }

    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
    return keys.every((k) => objectDeepEquals(a[k], b[k]));
  }

  return false;
};
