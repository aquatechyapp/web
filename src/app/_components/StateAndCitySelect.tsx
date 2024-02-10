import { City, ICity, State } from 'country-state-city';
import { useEffect, useState } from 'react';
import SelectField from './SelectField';

type Props = {
  form: any;
  stateName?: string;
  cityName?: string;
};

const states = State.getStatesOfCountry('US');

export default function StateAndCitySelect({
  form,
  stateName = 'clientState',
  cityName = 'clientCity'
}: Props) {
  const [cities, setCities] = useState<ICity[]>([]);
  const state = form.watch('state');

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
    <div className="inline-flex items-start justify-start gap-4 self-stretch w-full">
      <SelectField
        form={form}
        name={stateName}
        placeholder="State"
        onValueChange={handleStateChange}
        data={states.map((state) => {
          return {
            key: state.isoCode,
            value: state.isoCode,
            name: state.name
          };
        })}
      />
      <SelectField
        disabled={cities.length === 0}
        form={form}
        name={cityName}
        placeholder={'City'}
        data={cities.map((city) => {
          return {
            key: city.name,
            value: city.name,
            name: city.name
          };
        })}
      />
    </div>
  );
}
