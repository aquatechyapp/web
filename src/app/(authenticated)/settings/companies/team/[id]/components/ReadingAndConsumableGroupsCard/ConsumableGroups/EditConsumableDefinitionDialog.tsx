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

import { ConsumableDefinition, UpdateConsumableDefinitionRequest } from '@/ts/interfaces/ConsumableGroups';

const updateConsumableDefinitionSchema = z.object({
  name: z.string().min(1, 'Name is required').max(100, 'Name must be less than 100 characters'),
  unit: z.string().min(1, 'Unit is required').max(20, 'Unit must be less than 20 characters'),
  minValue: z.coerce.number().optional(),
  maxValue: z.coerce.number().optional(),
  step: z.coerce.number().positive('Step must be positive').optional(),
  isRequired: z.boolean(),
  description: z.string().max(500, 'Description must be less than 500 characters').optional(),
  pricePerUnit: z.coerce.number().min(0, 'Price must be non-negative').optional()
}).refine((data) => {
  if (data.minValue !== undefined && data.maxValue !== undefined) {
    return data.minValue <= data.maxValue;
  }
  return true;
}, {
  message: 'Minimum value must be less than or equal to maximum value',
  path: ['maxValue']
});

interface EditConsumableDefinitionDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  consumableDefinition: ConsumableDefinition | null;
  onSubmit: (data: UpdateConsumableDefinitionRequest) => void;
  isLoading: boolean;
}

export function EditConsumableDefinitionDialog({ open, onOpenChange, consumableDefinition, onSubmit, isLoading }: EditConsumableDefinitionDialogProps) {
  const form = useForm<z.infer<typeof updateConsumableDefinitionSchema>>({
    resolver: zodResolver(updateConsumableDefinitionSchema),
    defaultValues: {
      name: '',
      unit: '',
      minValue: undefined,
      maxValue: undefined,
      step: undefined,
      isRequired: false,
      description: '',
      pricePerUnit: undefined
    }
  });

  useEffect(() => {
    if (consumableDefinition) {
      form.reset({
        name: consumableDefinition.name,
        unit: consumableDefinition.unit,
        description: consumableDefinition.description || '',
        isRequired: consumableDefinition.isRequired,
        minValue: consumableDefinition.minValue,
        maxValue: consumableDefinition.maxValue,
        step: consumableDefinition.step,
        pricePerUnit: consumableDefinition.pricePerUnit
      });
    }
  }, [consumableDefinition, form]);

  const handleSubmit = (data: z.infer<typeof updateConsumableDefinitionSchema>) => {
    const submitData: UpdateConsumableDefinitionRequest = {
      name: data.name,
      unit: data.unit,
      description: data.description || undefined,
      isRequired: data.isRequired,
      ...(data.minValue !== undefined && { minValue: data.minValue }),
      ...(data.maxValue !== undefined && { maxValue: data.maxValue }),
      ...(data.step !== undefined && { step: data.step }),
      ...(data.pricePerUnit !== undefined && { pricePerUnit: data.pricePerUnit })
    };
    onSubmit(submitData);
  };

  const handleClose = () => {
    form.reset();
    onOpenChange(false);
  };

  if (!consumableDefinition) {
    return null;
  }

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[500px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Edit Consumable Definition</DialogTitle>
          <DialogDescription>
            Update the consumable definition information and validation rules.
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
                      <Input placeholder="e.g., Liquid Chlorine" {...field} />
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
                      <Input placeholder="e.g., gallons" {...field} />
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
                      placeholder="Brief description of this consumable..."
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
                name="step"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Step Size</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        step="any"
                        placeholder="e.g., 0.25"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="pricePerUnit"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Price per Unit</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        step="0.01"
                        placeholder="e.g., 15.00"
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
                      Required consumable
                    </FormLabel>
                    <p className="text-sm text-muted-foreground">
                      This consumable must be recorded for every service report
                    </p>
                  </div>
                </FormItem>
              )}
            />

            <DialogFooter className="flex flex-col sm:flex-row gap-2 sm:justify-end w-full">
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

