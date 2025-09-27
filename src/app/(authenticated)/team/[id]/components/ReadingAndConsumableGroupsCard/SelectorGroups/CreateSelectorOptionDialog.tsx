'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useEffect } from 'react';

import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';

import { CreateSelectorOptionRequest, SelectorDefinition, SelectorOption } from '@/ts/interfaces/SelectorGroups';

const createSelectorOptionSchema = z.object({
  text: z.string().min(1, 'Display text is required').max(100, 'Display text must be less than 100 characters'),
});

type CreateSelectorOptionFormData = z.infer<typeof createSelectorOptionSchema>;

interface CreateSelectorOptionDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (data: CreateSelectorOptionRequest) => void;
  isLoading?: boolean;
  selectorDefinition: SelectorDefinition;
  existingOptions: SelectorOption[];
}

export function CreateSelectorOptionDialog({
  open,
  onOpenChange,
  onSubmit,
  isLoading = false,
  selectorDefinition,
  existingOptions,
}: CreateSelectorOptionDialogProps) {
  const form = useForm<CreateSelectorOptionFormData>({
    resolver: zodResolver(createSelectorOptionSchema),
    defaultValues: {
      text: '',
    },
  });

  // Reset form when dialog opens
  useEffect(() => {
    if (open) {
      form.reset({
        text: '',
      });
    }
  }, [open, form]);

  // Helper function to generate value from text
  const generateValueFromText = (text: string): string => {
    return text
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9\s]/g, '') // Remove special characters except spaces
      .replace(/\s+/g, '_') // Replace spaces with underscores
      .replace(/_+/g, '_') // Replace multiple underscores with single underscore
      .replace(/^_|_$/g, ''); // Remove leading/trailing underscores
  };

  // Helper function to get next available order
  const getNextOrder = (): number => {
    if (existingOptions.length === 0) return 0;
    const maxOrder = Math.max(...existingOptions.map(option => option.order));
    return maxOrder + 1;
  };

  const handleSubmit = (data: CreateSelectorOptionFormData) => {
    const value = generateValueFromText(data.text);
    const order = getNextOrder();
    
    onSubmit({
      text: data.text,
      value: value,
      order: order,
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Create Selector Option</DialogTitle>
        <DialogDescription>
          Add a new option for: "{selectorDefinition?.question}"
            <br />
            <span className="text-xs text-muted-foreground">
              Enter the display text and the value will be auto-generated.
            </span>
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
                    <Input 
                      placeholder="e.g., Excellent, Good, Fair, Poor, Yes, No, High, Medium, Low" 
                      disabled={isLoading}
                      {...field} 
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => onOpenChange(false)} disabled={isLoading}>
                Cancel
              </Button>
              <Button type="submit" disabled={isLoading}>
                {isLoading ? 'Creating...' : 'Create Option'}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
