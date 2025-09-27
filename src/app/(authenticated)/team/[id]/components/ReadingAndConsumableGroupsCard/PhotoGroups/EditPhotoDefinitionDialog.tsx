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

import { PhotoDefinition, UpdatePhotoDefinitionRequest } from '@/ts/interfaces/PhotoGroups';

const updatePhotoDefinitionSchema = z.object({
  name: z.string().min(1, 'Name is required').max(100, 'Name must be less than 100 characters'),
  description: z.string().max(500, 'Description must be less than 500 characters').optional(),
  isRequired: z.boolean(),
  allowGallery: z.boolean(),
});

interface EditPhotoDefinitionDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  photoDefinition: PhotoDefinition | null;
  onSubmit: (data: UpdatePhotoDefinitionRequest) => void;
  isLoading: boolean;
}

export function EditPhotoDefinitionDialog({ 
  open, 
  onOpenChange, 
  photoDefinition, 
  onSubmit, 
  isLoading 
}: EditPhotoDefinitionDialogProps) {
  const form = useForm<z.infer<typeof updatePhotoDefinitionSchema>>({
    resolver: zodResolver(updatePhotoDefinitionSchema),
    defaultValues: {
      name: '',
      description: '',
      isRequired: false,
      allowGallery: false,
    }
  });

  useEffect(() => {
    if (photoDefinition) {
      form.reset({
        name: photoDefinition.name,
        description: photoDefinition.description || '',
        isRequired: photoDefinition.isRequired,
        allowGallery: photoDefinition.allowGallery,
      });
    }
  }, [photoDefinition, form]);

  const handleSubmit = (data: z.infer<typeof updatePhotoDefinitionSchema>) => {
    const requestData: UpdatePhotoDefinitionRequest = {
      name: data.name,
      description: data.description || undefined,
      isRequired: data.isRequired,
      allowGallery: data.allowGallery,
    };
    onSubmit(requestData);
  };

  const handleClose = () => {
    form.reset();
    onOpenChange(false);
  };

  if (!photoDefinition) {
    return null;
  }

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Edit Photo Definition</DialogTitle>
          <DialogDescription>
            Update the photo definition information.
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
                    <Input placeholder="e.g., Before Photo, Equipment Photo" {...field} />
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
                      placeholder="Brief description of what this photo should capture..."
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
              name="isRequired"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                  <div className="space-y-0.5">
                    <FormLabel className="text-base">
                      Required
                    </FormLabel>
                    <p className="text-sm text-muted-foreground">
                      Mark this photo as required for service completion
                    </p>
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

            <FormField
              control={form.control}
              name="allowGallery"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                  <div className="space-y-0.5">
                    <FormLabel className="text-base">
                      Allow Gallery
                    </FormLabel>
                    <p className="text-sm text-muted-foreground">
                      Allow users to select photos from gallery for this definition
                    </p>
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
              <Button type="button" variant="outline" onClick={handleClose} disabled={isLoading}>
                Cancel
              </Button>
              <Button type="submit" disabled={isLoading}>
                {isLoading ? 'Updating...' : 'Update Definition'}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}

