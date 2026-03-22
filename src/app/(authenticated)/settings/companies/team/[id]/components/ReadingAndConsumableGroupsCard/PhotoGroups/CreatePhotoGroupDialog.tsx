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

import { CreatePhotoGroupRequest } from '@/ts/interfaces/PhotoGroups';

const createPhotoGroupSchema = z.object({
  name: z.string().min(1, 'Name is required').max(100, 'Name must be less than 100 characters'),
  description: z.string().max(500, 'Description must be less than 500 characters').optional(),
  isDefault: z.boolean().optional(),
});

type CreatePhotoGroupFormData = z.infer<typeof createPhotoGroupSchema>;

interface CreatePhotoGroupDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (data: CreatePhotoGroupRequest) => void;
  isLoading?: boolean;
}

export function CreatePhotoGroupDialog({
  open,
  onOpenChange,
  onSubmit,
  isLoading = false,
}: CreatePhotoGroupDialogProps) {
  const form = useForm<CreatePhotoGroupFormData>({
    resolver: zodResolver(createPhotoGroupSchema),
    defaultValues: {
      name: '',
      description: '',
      isDefault: false,
    },
  });

  // Reset form when dialog opens
  useEffect(() => {
    if (open) {
      form.reset({
        name: '',
        description: '',
        isDefault: false,
      });
    }
  }, [open, form]);

  const handleSubmit = (data: CreatePhotoGroupFormData) => {
    onSubmit({
      name: data.name,
      description: data.description || undefined,
      isDefault: data.isDefault,
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Create Photo Group</DialogTitle>
          <DialogDescription>
            Create a new photo group to organize photos for your services.
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
                    <Input placeholder="e.g., Before Photos, Equipment Photos" {...field} />
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
                      placeholder="Optional description for this photo group"
                      className="resize-none"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
                Cancel
              </Button>
              <Button type="submit" disabled={isLoading}>
                {isLoading ? 'Creating...' : 'Create Photo Group'}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}