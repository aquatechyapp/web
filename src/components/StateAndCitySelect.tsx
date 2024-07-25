import { City, ICity, State } from 'country-state-city';
import { useEffect, useState } from 'react';
import { UseFormReturn } from 'react-hook-form';

import SelectField from './SelectField';

type Props = {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  form: UseFormReturn<any>;
  stateName?: string;
  cityName?: string;
  disabled?: boolean;
};

const states = State.getStatesOfCountry('US');

export default function StateAndCitySelect({
  form,
  stateName = 'clientState',
  cityName = 'clientCity',
  ...props
}: Props) {
  const [cities, setCities] = useState<ICity[]>([]);
  const state = form.watch(stateName);
  const city = form.watch(cityName);

  const handleStateChange = (selectedState: string) => {
    if (!selectedState) return;
    form.setValue(stateName, selectedState);
    const citiesOfSelectedState = City.getCitiesOfState('US', selectedState);
    setCities(citiesOfSelectedState);
  };

  useEffect(() => {
    handleStateChange(state);
  }, [state]);

  return (
    <div className="inline-flex w-full items-start justify-start gap-4 self-stretch">
      <SelectField
        form={form}
        name={stateName}
        label="State"
        value={state}
        placeholder="State"
        data={states.map((state) => {
          return {
            key: state.isoCode,
            value: state.isoCode,
            name: state.name
          };
        })}
        {...props}
      />
      <SelectField
        // disabled={!state || cities.length === 0}
        form={form}
        label="City"
        name={cityName}
        value={city}
        placeholder={'City'}
        data={cities.map((city) => {
          return {
            key: city.name,
            value: city.name,
            name: city.name
          };
        })}
        {...props}
      />
    </div>
  );
}
