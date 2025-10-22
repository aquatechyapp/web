'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import React from 'react';

import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';

import { SelectorOption, UpdateSelectorOptionRequest, SelectorDefinition } from '@/ts/interfaces/SelectorGroups';

const updateSelectorOptionSchema = z.object({
  text: z.string().min(1, 'Text is required').max(100, 'Text must be less than 100 characters'),
  value: z.string().min(1, 'Value is required').max(50, 'Value must be less than 50 characters'),
  order: z.number().min(0, 'Order must be 0 or greater'),
});

type UpdateSelectorOptionFormData = z.infer<typeof updateSelectorOptionSchema>;

interface EditSelectorOptionDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  selectorOption: SelectorOption | null;
  onSubmit: (data: UpdateSelectorOptionRequest) => void;
  isLoading?: boolean;
  selectorDefinition: SelectorDefinition;
}

export function EditSelectorOptionDialog({
  open,
  onOpenChange,
  selectorOption,
  onSubmit,
  isLoading = false,
  selectorDefinition,
}: EditSelectorOptionDialogProps) {
  const form = useForm<UpdateSelectorOptionFormData>({
    resolver: zodResolver(updateSelectorOptionSchema),
    defaultValues: {
      text: selectorOption?.text || '',
      value: selectorOption?.value || '',
      order: selectorOption?.order || 0,
    },
  });

  // Update form when selectorOption changes
  React.useEffect(() => {
    if (selectorOption) {
      form.reset({
        text: selectorOption.text,
        value: selectorOption.value,
        order: selectorOption.order,
      });
    }
  }, [selectorOption, form]);

  const handleSubmit = (data: UpdateSelectorOptionFormData) => {
    onSubmit({
      text: data.text,
      value: data.value,
      order: data.order,
    });
  };

  if (!selectorOption) {
    return null;
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Edit Selector Option</DialogTitle>
          <DialogDescription>
            Update the option for: "{selectorDefinition.question}"
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="text"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Display Text *</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g., Excellent, Good, Fair, Poor" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />


            <DialogFooter className="flex flex-col sm:flex-row gap-2 sm:justify-end">
              <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
                Cancel
              </Button>
              <Button type="submit" disabled={isLoading}>
                {isLoading ? 'Updating...' : 'Update Option'}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
