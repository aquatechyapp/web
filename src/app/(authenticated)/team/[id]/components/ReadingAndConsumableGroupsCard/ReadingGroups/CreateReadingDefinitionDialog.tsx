'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';

import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';

import { CreateReadingDefinitionRequest } from '@/ts/interfaces/ReadingGroups';

const createReadingDefinitionSchema = z.object({
  name: z.string().min(1, 'Name is required').max(100, 'Name must be less than 100 characters'),
  unit: z.string().min(1, 'Unit is required').max(20, 'Unit must be less than 20 characters'),
  minValue: z.coerce.number(),
  maxValue: z.coerce.number(),
  goalValue: z.coerce.number().optional(),
  step: z.coerce.number().positive('Step must be positive'),
  isRequired: z.boolean().default(false),
  description: z.string().max(500, 'Description must be less than 500 characters').optional()
}).refine((data) => {
  if (data.minValue !== 0 && data.maxValue !== 0) {
    return data.minValue <= data.maxValue;
  }
  return true;
}, {
  message: 'Minimum value must be less than or equal to maximum value',
  path: ['maxValue']
});

interface CreateReadingDefinitionDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (data: CreateReadingDefinitionRequest) => void;
  isLoading: boolean;
}

export function CreateReadingDefinitionDialog({ open, onOpenChange, onSubmit, isLoading }: CreateReadingDefinitionDialogProps) {
  const form = useForm<z.infer<typeof createReadingDefinitionSchema>>({
    resolver: zodResolver(createReadingDefinitionSchema),
    defaultValues: {
      name: '',
      unit: '',
      minValue: 0,
      maxValue: 0,
      goalValue: undefined,
      step: 0,
      isRequired: false,
      description: ''
    }
  });

  const handleSubmit = (data: z.infer<typeof createReadingDefinitionSchema>) => {
    const submitData: CreateReadingDefinitionRequest = {
      name: data.name,
      unit: data.unit,
      description: data.description || undefined,
      isRequired: data.isRequired,
      ...(data.minValue !== 0 && { minValue: data.minValue }),
      ...(data.maxValue !== 0 && { maxValue: data.maxValue }),
      ...(data.goalValue !== undefined && { goalValue: data.goalValue }),
      ...(data.step !== 0 && { step: data.step })
    };
    onSubmit(submitData);
  };

  const handleClose = () => {
    form.reset();
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[500px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Create Reading Definition</DialogTitle>
          <DialogDescription>
            Create a new reading definition to specify what readings can be recorded for this group.
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
                    {/* <FormMessage /> */}
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
                    {/* <FormMessage /> */}
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
                  {/* <FormMessage /> */} 
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
                    {/* <FormMessage /> */}
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
                    {/* <FormMessage /> */}
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
                    {/* <FormMessage /> */}
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
                    {/* <FormMessage /> */}
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
                {isLoading ? 'Creating...' : 'Create Definition'}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}

