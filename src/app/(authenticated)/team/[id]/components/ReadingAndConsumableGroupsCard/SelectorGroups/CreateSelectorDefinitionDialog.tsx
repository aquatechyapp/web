'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useEffect } from 'react';

import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';

import { CreateSelectorDefinitionRequest } from '@/ts/interfaces/SelectorGroups';

const createSelectorDefinitionSchema = z.object({
  question: z.string().min(1, 'Question is required').max(200, 'Question must be less than 200 characters'),
  isRequired: z.boolean(),
});

type CreateSelectorDefinitionFormData = z.infer<typeof createSelectorDefinitionSchema>;

interface CreateSelectorDefinitionDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (data: CreateSelectorDefinitionRequest) => void;
  isLoading?: boolean;
  selectorGroupName: string;
}

export function CreateSelectorDefinitionDialog({
  open,
  onOpenChange,
  onSubmit,
  isLoading = false,
  selectorGroupName,
}: CreateSelectorDefinitionDialogProps) {
  const form = useForm<CreateSelectorDefinitionFormData>({
    resolver: zodResolver(createSelectorDefinitionSchema),
    defaultValues: {
      question: '',
      isRequired: false,
    },
  });

  // Reset form when dialog opens
  useEffect(() => {
    if (open) {
      form.reset({
        question: '',
        isRequired: false,
      });
    }
  }, [open, form]);

  const handleSubmit = (data: CreateSelectorDefinitionFormData) => {
    onSubmit({
      question: data.question,
      isRequired: data.isRequired,
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Create Selector Definition</DialogTitle>
          <DialogDescription>
            Add a new question with multiple choice options to "{selectorGroupName}".
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="question"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Question *</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g., What is the pool condition?" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="isRequired"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm">
                  <div className="space-y-0.5">
                    <FormLabel>Required Question</FormLabel>
                    <div className="text-sm text-muted-foreground">
                      Make this question mandatory for service completion
                    </div>
                  </div>
                  <FormControl>
                    <Switch
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                </FormItem>
              )}
            />
            <DialogFooter className="flex flex-col sm:flex-row gap-2 sm:justify-end">
              <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
                Cancel
              </Button>
              <Button type="submit" disabled={isLoading}>
                {isLoading ? 'Creating...' : 'Create Question'}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
