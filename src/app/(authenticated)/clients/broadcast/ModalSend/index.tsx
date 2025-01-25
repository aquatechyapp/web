import { Send } from 'lucide-react';
import { useState } from 'react';

import { Typography } from '@/components/Typography';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogTrigger } from '@/components/ui/dialog';

interface ModalSendProps {
  onSubmit: () => void;
  disabled: boolean;
}

export function ModalSend({ onSubmit, disabled }: ModalSendProps) {
  const [open, setOpen] = useState(false);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="w-full" disabled={disabled}>
          <Send className="mr-2 h-6 w-6" />
          Schedule broadcast
        </Button>
      </DialogTrigger>
      <DialogContent>
        <div className="flex flex-col items-center gap-2 text-center">
          <Typography>
            You are about to send an email to your selected customers. <br />
            <b className="font-semibold">Do you want to confirm shipping?</b>
          </Typography>
          <Button
            type="button"
            className="h-10w mt-2 w-fit"
            onClick={() => {
              onSubmit();
              setOpen(false);
              console.log('enviando');
            }}
          >
            Send
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
