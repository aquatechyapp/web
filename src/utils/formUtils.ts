import { FieldValues } from 'react-hook-form';

export function buildSelectOptions(
  data: any[],
  { id, name, value }: { id: string; name: string; value: string }
) {
  return data.map((item) => ({
    id: item[id],
    name: item[name],
    value: item[value]
  }));
}

export function createFormData(data: Record<string, string>) {
  const formData = new FormData();
  for (const key in data) {
    switch (key) {
      case 'firstName' || 'lastName':
        formData.append('clientName', `${data.firstName} ${data.lastName}`);
        break;
      case 'photo':
        data[key].forEach((photo) => formData.append(key, photo.file));
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
  const changedFieldValues = Object.keys(dirtyFields).reduce(
    (acc, currentField) => {
      return {
        ...acc,
        [currentField]: allFields[currentField]
      };
    },
    {} as Partial<T>
  );

  return changedFieldValues;
};
