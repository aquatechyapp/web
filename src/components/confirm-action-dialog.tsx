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
import { open } from 'fs';

export type ConfirmActionDialogProps = {
  open?: boolean;
  trigger?: React.ReactNode;
  title?: string;
  description?: string;
  confirmText?: string;
  cancelText?: string;
  onConfirm?: () => Promise<void>;
  onOpenChange?: (open: boolean) => void;
} & VariantProps<typeof buttonVariants>;

export default function ConfirmActionDialog({
  open = false,
  trigger: TriggerElement,
  title = 'Are you sure?',
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  description,
  onConfirm,
  onOpenChange,
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
    if (isLoading) {
      setIsLoading(false);
    }
    if (onOpenChange) {
      onOpenChange(open);
    }
  };

  return (
    <AlertDialog open={_open || open} defaultOpen={_open || open} onOpenChange={handleOpenChange}>
      {TriggerElement ? <AlertDialogTrigger asChild>{TriggerElement}</AlertDialogTrigger> : null}
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>{title}</AlertDialogTitle>
          <AlertDialogDescription>{description}</AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter className="flex flex-col sm:flex-row sm:justify-end gap-2">
          <Button variant={variant} size={size} onClick={handleConfirm} disabled={isLoading}>
            {isLoading && <Loader2Icon className="mr-2 h-4 w-4 animate-spin" />}
            <span>{confirmText}</span>
          </Button>
          <Button type="button" variant="outline" size={size} onClick={() => handleOpenChange(false)}>
            {cancelText}
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
