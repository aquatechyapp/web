import { IoCopy } from 'react-icons/io5';

import { Button } from '@/components/ui/button';

type Props = {
  value: string;
  Icon: React.FC;
};

export function CopyToClipboard({ value, Icon }: Props) {
  return (
    <div className="flex w-full items-center gap-4 text-gray-400">
      <Icon />
      <span>{value}</span>
      <Button onClick={() => navigator.clipboard.writeText(value)} variant="outline" size="icon" className="ml-auto">
        <IoCopy />
      </Button>
    </div>
  );
}
