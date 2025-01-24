import { useState } from 'react';
import { Button, buttonVariants } from './ui/button';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger
} from './ui/alert-dialog';
import { VariantProps } from 'class-variance-authority';
import { Loader2Icon } from 'lucide-react';
import { type } from 'os';

export type ConfirmActionDialogProps = {
  open?: boolean;
  trigger?: React.ReactNode;
  title?: string;
  description?: string;
  confirmText?: string;
  cancelText?: string;
  onConfirm?: () => Promise<void>;
} & VariantProps<typeof buttonVariants>;

export default function ConfirmActionDialog({
  open = false,
  trigger: TriggerElement,
  title = 'Are you sure?',
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  description,
  onConfirm,
  variant = 'default',
  size = 'default'
}: ConfirmActionDialogProps) {
  const [_open, _setOpen] = useState(open);
  const [isLoading, setIsLoading] = useState(false);

  const handleConfirm = async () => {
    setIsLoading(true);
    if (onConfirm) {
      await onConfirm();
    }
    setIsLoading(false);
    _setOpen(false);
  };

  const handleOpenChange = (open: boolean) => {
    _setOpen(open);
  };

  return (
    <AlertDialog open={_open} defaultOpen={_open} onOpenChange={handleOpenChange}>
      <AlertDialogTrigger asChild>{TriggerElement || <Button variant="ghost">Open</Button>}</AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>{title}</AlertDialogTitle>
          <AlertDialogDescription>{description}</AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <Button variant={variant} size={size} onClick={handleConfirm} disabled={isLoading}>
            {isLoading && <Loader2Icon className="mr-2 h-4 w-4 animate-spin" />}
            <span>{confirmText}</span>
          </Button>
          <AlertDialogCancel size={size}>{cancelText}</AlertDialogCancel>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
