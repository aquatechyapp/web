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

import { ConsumableGroup, UpdateConsumableGroupRequest } from '@/ts/interfaces/ConsumableGroups';

const updateConsumableGroupSchema = z.object({
  name: z.string().min(1, 'Name is required').max(100, 'Name must be less than 100 characters'),
  description: z.string().max(500, 'Description must be less than 500 characters').optional(),
  isActive: z.boolean()
});

interface EditConsumableGroupDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  consumableGroup: ConsumableGroup | null;
  onSubmit: (data: UpdateConsumableGroupRequest) => void;
  isLoading: boolean;
}

export function EditConsumableGroupDialog({ open, onOpenChange, consumableGroup, onSubmit, isLoading }: EditConsumableGroupDialogProps) {
  const form = useForm<z.infer<typeof updateConsumableGroupSchema>>({
    resolver: zodResolver(updateConsumableGroupSchema),
    defaultValues: {
      name: '',
      description: '',
      isActive: true
    }
  });

  useEffect(() => {
    if (consumableGroup) {
      form.reset({
        name: consumableGroup.name,
        description: consumableGroup.description || '',
        isActive: consumableGroup.isActive
      });
    }
  }, [consumableGroup, form]);

  const handleSubmit = (data: z.infer<typeof updateConsumableGroupSchema>) => {
    onSubmit(data);
  };

  const handleClose = () => {
    form.reset();
    onOpenChange(false);
  };

  if (!consumableGroup) {
    return null;
  }

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Edit Consumable Group</DialogTitle>
          <DialogDescription>
            Update the consumable group information. Note that default groups cannot be deactivated.
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
                    <Input placeholder="e.g., Chemicals" {...field} />
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
                      placeholder="Brief description of what consumables this group contains..."
                      className="resize-none"
                      rows={3}
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
                <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                  <div className="space-y-0.5">
                    <FormLabel className="text-base">
                      Active
                    </FormLabel>
                    <p className="text-sm text-muted-foreground">
                      {consumableGroup.isDefault 
                        ? 'This is a default group and cannot be deactivated'
                        : 'Deactivate to hide this group from new service reports'
                      }
                    </p>
                  </div>
                  <FormControl>
                    <Switch
                      checked={field.value}
                      onCheckedChange={field.onChange}
                      disabled={consumableGroup.isDefault}
                    />
                  </FormControl>
                </FormItem>
              )}
            />

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

