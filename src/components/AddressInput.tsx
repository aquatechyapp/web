// src/components/AddressInput.tsx
import { useLoadScript } from '@react-google-maps/api';
import { useEffect, useRef, useState } from 'react';
import { useFormContext } from 'react-hook-form';
import { Input } from './ui/input';
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from './ui/form';

type AddressInputProps = {
  name: string;
  label?: string;
  placeholder?: string;
  className?: string;
  disabled?: boolean;
  onAddressSelect?: (address: { fullAddress: string; state: string; city: string; zipCode: string }) => void;
};

const GOOGLE_MAPS_LIBRARIES: Array<'places'> = ['places'];

export function AddressInput({ name, label, placeholder, className, disabled, onAddressSelect }: AddressInputProps) {
  const form = useFormContext();
  const autocompleteRef = useRef<HTMLInputElement | null>(null);
  const [autocomplete, setAutocomplete] = useState<google.maps.places.Autocomplete | null>(null);

  const { isLoaded } = useLoadScript({
    googleMapsApiKey: process.env.GOOGLE_MAPS_API_KEY as string,
    libraries: GOOGLE_MAPS_LIBRARIES
  });

  useEffect(() => {
    if (isLoaded && autocompleteRef.current && !autocomplete) {
      const newAutocomplete = new google.maps.places.Autocomplete(autocompleteRef.current, {
        componentRestrictions: { country: 'us' },
        fields: ['address_components', 'formatted_address']
      });
      setAutocomplete(newAutocomplete);
    }
  }, [isLoaded]);

  useEffect(() => {
    if (!isLoaded || !autocompleteRef.current) return;

    // Cleanup previous instance if it exists
    if (autocomplete) {
      google.maps.event.clearInstanceListeners(autocomplete);
    }

    const handlePlaceSelect = () => {
      const place = autocomplete?.getPlace();

      if (!place?.address_components) return;

      let streetNumber = '';
      let route = '';
      let city = '';
      let state = '';
      let zipCode = '';

      for (const component of place.address_components) {
        const type = component.types[0];
        switch (type) {
          case 'street_number':
            streetNumber = component.long_name;
            break;
          case 'route':
            route = component.long_name;
            break;
          case 'locality':
            city = component.long_name;
            break;
          case 'administrative_area_level_1':
            state = component.short_name;
            break;
          case 'postal_code':
            zipCode = component.long_name;
            break;
        }
      }

      const fullAddress = `${streetNumber} ${route}`.trim();

      // Update form values
      form.setValue(name, fullAddress, { shouldValidate: true });

      // If callback provided, send all address data
      if (onAddressSelect) {
        onAddressSelect({
          fullAddress,
          state,
          city,
          zipCode
        });
      }
    };

    autocomplete?.addListener('place_changed', handlePlaceSelect);

    return () => {
      if (autocomplete) {
        google.maps.event.clearInstanceListeners(autocomplete);
      }
    };
  }, [isLoaded, form, name, onAddressSelect]);

  return (
    <FormField
      control={form.control}
      name={name}
      defaultValue=""
      render={({ field }) => (
        <FormItem className="flex h-full w-full flex-col gap-2">
          {label && <FormLabel className="text-nowrap">{label}</FormLabel>}
          <FormControl>
            <Input
              {...field}
              ref={(e) => {
                if (e) {
                  autocompleteRef.current = e;
                }
                if (typeof field.ref === 'function') {
                  field.ref(e);
                }
              }}
              type="text"
              placeholder={placeholder}
              disabled={disabled || !isLoaded}
              className={className}
              value={field.value || ''}
              onChange={(e) => {
                field.onChange(e.target.value);
              }}
            />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}
