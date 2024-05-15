import { FieldValues } from 'react-hook-form';

export function buildSelectOptions(data: any[], { key, name, value }: { key: string; name: string; value: string }) {
  const options = data.map((item) => {
    return {
      key: item[key],
      name: item[name],
      value: item[value]
    };
  });
  // filter out duplicates
  return options.filter((item, index, currentArr) => {
    return index === currentArr.findIndex((t) => t.key === item.key);
  });
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function createFormData(data: Record<string, any>) {
  const formData = new FormData();
  for (const key in data) {
    switch (key) {
      case 'createdBy':
        formData.append(key, JSON.stringify(data[key]));
        break;
      case 'firstName' || 'lastName':
        formData.append('clientName', `${data.firstName} ${data.lastName}`);
        break;
      case 'photo':
        data[key].forEach((photo: { file: string | Blob }) => formData.append(key, photo.file));
        break;
      case 'monthlyPayment':
        // convert to number
        formData.append('monthlyPayment', data.monthlyPayment.toString());
        break;
      default:
        formData.append(key, data[key]);
        break;
    }
  }
  return formData;
}

export const filterChangedFormFields = <T extends FieldValues>(
  allFields: T,
  dirtyFields: Partial<Record<keyof T, boolean>>
): Partial<T> => {
  const changedFieldValues = Object.keys(dirtyFields).reduce((acc, currentField) => {
    return {
      ...acc,
      [currentField]: allFields[currentField]
    };
  }, {} as Partial<T>);

  return changedFieldValues;
};
