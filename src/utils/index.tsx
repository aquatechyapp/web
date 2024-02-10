export function CreateFormData(data: Record<string, string>) {
  const formData = new FormData();
  for (const key in data) {
    switch (key) {
      default:
        formData.append(key, data[key]);
        break;
    }
  }
  return formData;
}
