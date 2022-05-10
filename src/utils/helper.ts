import appRoot from 'app-root-path';

export const skipEmpty = (value: unknown) => {
  if (value == null || (typeof value === 'string' && value.length === 0)) {
    return undefined;
  }
  return value;
};

export const appPath = () => {
  return appRoot;
};

export function numberPad(num: number, size = 2) {
  let newNumber = num.toString();
  while (newNumber.length < size) newNumber = '0' + newNumber;
  return newNumber;
}

export function makeArray<T>(length: number, generator: () => T): T[] {
  return Array.from({ length }, generator);
}
