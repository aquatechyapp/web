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
import { Checkbox } from '@/components/ui/checkbox';

import { ReadingDefinition, UpdateReadingDefinitionRequest } from '@/ts/interfaces/ReadingGroups';

const updateReadingDefinitionSchema = z.object({
  name: z.string().min(1, 'Name is required').max(100, 'Name must be less than 100 characters'),
  unit: z.string().min(1, 'Unit is required').max(20, 'Unit must be less than 20 characters'),
  minValue: z.coerce.number().optional(),
  maxValue: z.coerce.number().optional(),
  goalValue: z.coerce.number().optional(),
  step: z.coerce.number().positive('Step must be positive').optional(),
  isRequired: z.boolean(),
  description: z.string().max(500, 'Description must be less than 500 characters').optional()
}).refine((data) => {
  if (data.minValue !== undefined && data.maxValue !== undefined) {
    return data.minValue <= data.maxValue;
  }
  return true;
}, {
  message: 'Minimum value must be less than or equal to maximum value',
  path: ['maxValue']
});

interface EditReadingDefinitionDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  readingDefinition: ReadingDefinition | null;
  onSubmit: (data: UpdateReadingDefinitionRequest) => void;
  isLoading: boolean;
}

export function EditReadingDefinitionDialog({ open, onOpenChange, readingDefinition, onSubmit, isLoading }: EditReadingDefinitionDialogProps) {
  const form = useForm<z.infer<typeof updateReadingDefinitionSchema>>({
    resolver: zodResolver(updateReadingDefinitionSchema),
    defaultValues: {
      name: '',
      unit: '',
      minValue: undefined,
      maxValue: undefined,
      goalValue: undefined,
      step: undefined,
      isRequired: false,
      description: ''
    }
  });

  useEffect(() => {
    if (readingDefinition) {
      form.reset({
        name: readingDefinition.name,
        unit: readingDefinition.unit,
        description: readingDefinition.description || '',
        isRequired: readingDefinition.isRequired,
        minValue: readingDefinition.minValue,
        maxValue: readingDefinition.maxValue,
        goalValue: readingDefinition.goalValue,
        step: readingDefinition.step
      });
    }
  }, [readingDefinition, form]);

  const handleSubmit = (data: z.infer<typeof updateReadingDefinitionSchema>) => {
    const submitData: UpdateReadingDefinitionRequest = {
      name: data.name,
      unit: data.unit,
      description: data.description || undefined,
      isRequired: data.isRequired,
      ...(data.minValue !== undefined && { minValue: data.minValue }),
      ...(data.maxValue !== undefined && { maxValue: data.maxValue }),
      ...(data.goalValue !== undefined && { goalValue: data.goalValue }),
      ...(data.step !== undefined && { step: data.step })
    };
    onSubmit(submitData);
  };

  const handleClose = () => {
    form.reset();
    onOpenChange(false);
  };

  if (!readingDefinition) {
    return null;
  }

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[500px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Edit Reading Definition</DialogTitle>
          <DialogDescription>
            Update the reading definition information and validation rules.
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Name *</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g., Chlorine" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="unit"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Unit *</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g., ppm" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Textarea 
                      placeholder="Brief description of this reading..."
                      className="resize-none"
                      rows={2}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="minValue"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Minimum Value</FormLabel>
                    <FormControl>
                      <Input 
                        type="number" 
                        step="any"
                        placeholder="e.g., 0.0" 
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="maxValue"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Maximum Value</FormLabel>
                    <FormControl>
                      <Input 
                        type="number" 
                        step="any"
                        placeholder="e.g., 10.0" 
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="goalValue"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Goal Value</FormLabel>
                    <FormControl>
                      <Input 
                        type="number" 
                        step="any"
                        placeholder="e.g., 3.0" 
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="step"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Step Size</FormLabel>
                    <FormControl>
                      <Input 
                        type="number" 
                        step="any"
                        placeholder="e.g., 0.1" 
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="isRequired"
              render={({ field }) => (
                <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                  <FormControl>
                    <Checkbox
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                  <div className="space-y-1 leading-none">
                    <FormLabel>
                      Required reading
                    </FormLabel>
                    <p className="text-sm text-muted-foreground">
                      This reading must be recorded for every service report
                    </p>
                  </div>
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

