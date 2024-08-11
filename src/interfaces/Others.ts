export type ImageFile = {
  dataURL: string;
  file: {
    name: string;
    size: number;
    type: string;
    lastModified: number;
    lastModifiedDate: Date;
    webkitRelativePath: string;
  };
};

export type SelectOption = {
  value: string;
  name: string;
  key: string;
};
