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

export type Menu = {
  text: string;
  href: string;
  submenu?: Record<string, { text: string; href: string; title: string; description?: string; icon?: React.FC }>;
  icon: React.FC;
  title: string;
  description?: string;
};
