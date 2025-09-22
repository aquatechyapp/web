'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import React from 'react';

import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';

import { SelectorDefinition, UpdateSelectorDefinitionRequest } from '@/ts/interfaces/SelectorGroups';

const updateSelectorDefinitionSchema = z.object({
  question: z.string().min(1, 'Question is required').max(200, 'Question must be less than 200 characters'),
  isRequired: z.boolean(),
});

type UpdateSelectorDefinitionFormData = z.infer<typeof updateSelectorDefinitionSchema>;

interface EditSelectorDefinitionDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  selectorDefinition: SelectorDefinition | null;
  onSubmit: (data: UpdateSelectorDefinitionRequest) => void;
  isLoading?: boolean;
  selectorGroupName: string;
}

export function EditSelectorDefinitionDialog({
  open,
  onOpenChange,
  selectorDefinition,
  onSubmit,
  isLoading = false,
  selectorGroupName,
}: EditSelectorDefinitionDialogProps) {
  const form = useForm<UpdateSelectorDefinitionFormData>({
    resolver: zodResolver(updateSelectorDefinitionSchema),
    defaultValues: {
      question: selectorDefinition?.question || '',
      isRequired: selectorDefinition?.isRequired ?? false,
    },
  });

  // Update form when selectorDefinition changes
  React.useEffect(() => {
    if (selectorDefinition) {
      form.reset({
        question: selectorDefinition.question,
        isRequired: selectorDefinition.isRequired,
      });
    }
  }, [selectorDefinition, form]);

  const handleSubmit = (data: UpdateSelectorDefinitionFormData) => {
    onSubmit({
      question: data.question,
      isRequired: data.isRequired,
    });
  };

  if (!selectorDefinition) {
    return null;
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Edit Selector Definition</DialogTitle>
          <DialogDescription>
            Update the question in "{selectorGroupName}".
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
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
                Cancel
              </Button>
              <Button type="submit" disabled={isLoading}>
                {isLoading ? 'Updating...' : 'Update Question'}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
