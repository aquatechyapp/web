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

const SELECTOR_LIMITS = {
  optionText: { min: 1, max: 50 },
  optionValue: { min: 1, max: 50 },
} as const;

function generateSelectorOptionValueFromText(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s]/g, '')
    .replace(/\s+/g, '_')
    .replace(/_+/g, '_')
    .replace(/^_|_$/g, '');
}

function getGeneratedOptionValueFromTextError(displayText: string): string | undefined {
  const value = generateSelectorOptionValueFromText(displayText);
  if (value.length < SELECTOR_LIMITS.optionValue.min) {
    return 'Display text must yield a non-empty value (use letters or numbers).';
  }
  if (value.length > SELECTOR_LIMITS.optionValue.max) {
    return `Value is too long (${value.length} characters). Use a shorter display text (max ${SELECTOR_LIMITS.optionValue.max} characters in the generated value).`;
  }
  return undefined;
}

const selectorOptionTextSchema = z
  .string()
  .trim()
  .min(SELECTOR_LIMITS.optionText.min, 'Display text is required')
  .max(SELECTOR_LIMITS.optionText.max, `Display text must be at most ${SELECTOR_LIMITS.optionText.max} characters`);

const createSelectorOptionSchema = z
  .object({
    text: selectorOptionTextSchema,
  })
  .superRefine((data, ctx) => {
    const msg = getGeneratedOptionValueFromTextError(data.text);
    if (msg) {
      ctx.addIssue({ code: z.ZodIssueCode.custom, message: msg, path: ['text'] });
    }
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

  // Helper function to get next available order
  const getNextOrder = (): number => {
    if (existingOptions.length === 0) return 0;
    const maxOrder = Math.max(...existingOptions.map(option => option.order));
    return maxOrder + 1;
  };

  const handleSubmit = (data: CreateSelectorOptionFormData) => {
    const value = generateSelectorOptionValueFromText(data.text);
    const order = getNextOrder();

    onSubmit({
      text: data.text.trim(),
      value,
      order,
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
                      maxLength={SELECTOR_LIMITS.optionText.max}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />


            <DialogFooter className="flex flex-col sm:flex-row gap-2 sm:justify-end">
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
