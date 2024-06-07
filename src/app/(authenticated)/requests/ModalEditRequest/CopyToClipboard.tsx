import { IoCopy } from 'react-icons/io5';

import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';

type Props = {
  value: string;
  Icon: React.FC;
};

export function CopyToClipboard({ value, Icon }: Props) {
  const { toast } = useToast();

  return (
    <div className="flex w-full items-center gap-2 text-gray-400">
      <Icon />
      <span>{value}</span>
      <Button
        type="button"
        onClick={() => {
          navigator.clipboard.writeText(value);
          toast({
            title: 'Copied successfully!',
            className: 'bg-green-500 text-white',
            duration: 2000
          });
        }}
        variant="ghost"
        size="icon"
        className="ml-auto"
      >
        <IoCopy />
      </Button>
    </div>
  );
}
