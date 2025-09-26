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

import { PhotoGroup, UpdatePhotoGroupRequest } from '@/ts/interfaces/PhotoGroups';

const updatePhotoGroupSchema = z.object({
  name: z.string().min(1, 'Name is required').max(100, 'Name must be less than 100 characters'),
  description: z.string().max(500, 'Description must be less than 500 characters').optional(),
  isActive: z.boolean().optional(),
});

type UpdatePhotoGroupFormData = z.infer<typeof updatePhotoGroupSchema>;

interface EditPhotoGroupDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  photoGroup: PhotoGroup | null;
  onSubmit: (data: UpdatePhotoGroupRequest) => void;
  isLoading?: boolean;
}

export function EditPhotoGroupDialog({
  open,
  onOpenChange,
  photoGroup,
  onSubmit,
  isLoading = false,
}: EditPhotoGroupDialogProps) {
  const form = useForm<UpdatePhotoGroupFormData>({
    resolver: zodResolver(updatePhotoGroupSchema),
    defaultValues: {
      name: '',
      description: '',
      isActive: true,
    },
  });

  useEffect(() => {
    if (photoGroup) {
      form.reset({
        name: photoGroup.name,
        description: photoGroup.description || '',
        isActive: photoGroup.isActive,
      });
    }
  }, [photoGroup, form]);

  const handleSubmit = (data: UpdatePhotoGroupFormData) => {
    onSubmit({
      name: data.name,
      description: data.description || undefined,
      isActive: data.isActive,
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Edit Photo Group</DialogTitle>
          <DialogDescription>
            Update the photo group details.
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
            {/* <FormField
              control={form.control}
              name="isActive"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm">
                  <div className="space-y-0.5">
                    <FormLabel>Active</FormLabel>
                    <div className="text-sm text-muted-foreground">
                      Enable or disable this photo group
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
            /> */}
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
                Cancel
              </Button>
              <Button type="submit" disabled={isLoading}>
                {isLoading ? 'Updating...' : 'Update Photo Group'}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}