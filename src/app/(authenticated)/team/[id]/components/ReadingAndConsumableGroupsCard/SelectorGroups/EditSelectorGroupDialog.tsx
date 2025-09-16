'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import React from 'react';

import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';

import { SelectorGroup, UpdateSelectorGroupRequest } from '@/ts/interfaces/SelectorGroups';

const updateSelectorGroupSchema = z.object({
  name: z.string().min(1, 'Name is required').max(100, 'Name must be less than 100 characters'),
  description: z.string().max(500, 'Description must be less than 500 characters').optional(),
  isActive: z.boolean(),
});

type UpdateSelectorGroupFormData = z.infer<typeof updateSelectorGroupSchema>;

interface EditSelectorGroupDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  selectorGroup: SelectorGroup | null;
  onSubmit: (data: UpdateSelectorGroupRequest) => void;
  isLoading?: boolean;
}

export function EditSelectorGroupDialog({
  open,
  onOpenChange,
  selectorGroup,
  onSubmit,
  isLoading = false,
}: EditSelectorGroupDialogProps) {
  const form = useForm<UpdateSelectorGroupFormData>({
    resolver: zodResolver(updateSelectorGroupSchema),
    defaultValues: {
      name: selectorGroup?.name || '',
      description: selectorGroup?.description || '',
      isActive: selectorGroup?.isActive ?? true,
    },
  });

  // Update form when selectorGroup changes
  React.useEffect(() => {
    if (selectorGroup) {
      form.reset({
        name: selectorGroup.name,
        description: selectorGroup.description || '',
        isActive: selectorGroup.isActive,
      });
    }
  }, [selectorGroup, form]);

  const handleSubmit = (data: UpdateSelectorGroupFormData) => {
    onSubmit({
      name: data.name,
      description: data.description || undefined,
      isActive: data.isActive,
    });
  };

  if (!selectorGroup) {
    return null;
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Edit Selector Group</DialogTitle>
          <DialogDescription>
            Update the selector group information.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g., Basic Questions, Equipment Status" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Optional description for this selector group"
                      className="resize-none"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="isActive"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm">
                  <div className="space-y-0.5">
                    <FormLabel>Active</FormLabel>
                    <div className="text-sm text-muted-foreground">
                      Enable or disable this selector group
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
                {isLoading ? 'Updating...' : 'Update Selector Group'}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
