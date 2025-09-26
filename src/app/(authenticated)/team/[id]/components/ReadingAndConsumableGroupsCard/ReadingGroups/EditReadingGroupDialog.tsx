'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useEffect } from 'react';

import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';

import { ReadingGroup, UpdateReadingGroupRequest } from '@/ts/interfaces/ReadingGroups';

const updateReadingGroupSchema = z.object({
  name: z.string().min(1, 'Name is required').max(100, 'Name must be less than 100 characters'),
  description: z.string().max(500, 'Description must be less than 500 characters').optional(),
  isActive: z.boolean()
});

interface EditReadingGroupDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  readingGroup: ReadingGroup | null;
  onSubmit: (data: UpdateReadingGroupRequest) => void;
  isLoading: boolean;
}

export function EditReadingGroupDialog({ open, onOpenChange, readingGroup, onSubmit, isLoading }: EditReadingGroupDialogProps) {
  const form = useForm<z.infer<typeof updateReadingGroupSchema>>({
    resolver: zodResolver(updateReadingGroupSchema),
    defaultValues: {
      name: '',
      description: '',
      isActive: true
    }
  });

  useEffect(() => {
    if (readingGroup) {
      form.reset({
        name: readingGroup.name,
        description: readingGroup.description || '',
        isActive: readingGroup.isActive
      });
    }
  }, [readingGroup, form]);

  const handleSubmit = (data: z.infer<typeof updateReadingGroupSchema>) => {
    onSubmit(data);
  };

  const handleClose = () => {
    form.reset();
    onOpenChange(false);
  };

  if (!readingGroup) {
    return null;
  }

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Edit Reading Group</DialogTitle>
          <DialogDescription>
            Update the reading group information. Note that default groups cannot be deactivated.
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name *</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g., Water Chemistry" {...field} />
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
                      placeholder="Brief description of what readings this group contains..."
                      className="resize-none"
                      rows={3}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* <FormField
              control={form.control}
              name="isActive"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                  <div className="space-y-0.5">
                    <FormLabel className="text-base">
                      Active
                    </FormLabel>
                    <p className="text-sm text-muted-foreground">
                      {readingGroup.isDefault 
                        ? 'This is a default group and cannot be deactivated'
                        : 'Deactivate to hide this group from new service reports'
                      }
                    </p>
                  </div>
                  <FormControl>
                    <Switch
                      checked={field.value}
                      onCheckedChange={field.onChange}
                      disabled={readingGroup.isDefault}
                    />
                  </FormControl>
                </FormItem>
              )}
            /> */}

            <DialogFooter>
              <Button type="button" variant="outline" onClick={handleClose} disabled={isLoading}>
                Cancel
              </Button>
              <Button type="submit" disabled={isLoading}>
                {isLoading ? 'Updating...' : 'Update Group'}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}

