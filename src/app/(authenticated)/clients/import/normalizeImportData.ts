import { City, IState, State } from 'country-state-city';

import { fuseSearchStatesAndCities, simpleFuseSearch } from '@/lib/fusejs';
import { ClientType, PoolType } from '@/ts/enums/enums';
import { onlyNumbers } from '@/utils';

import { FormDataImportClients } from './page';

const states = State.getStatesOfCountry('US');

export function normalizeImportData(data: FormDataImportClients): FormDataImportClients {
  if (data.clientState) {
    const state = fuseSearchStatesAndCities(states, data.clientState).filter(
      (item): item is IState => 'isoCode' in item
    )[0]?.isoCode;

    if (!state) {
      data.clientState = '';
      data.clientCity = '';
    } else {
      data.clientState = state;
      data.clientCity = fuseSearchStatesAndCities(City.getCitiesOfState('US', state), data.clientCity!)[0]?.name || '';
    }
  }

  if (data.poolState) {
    const state = fuseSearchStatesAndCities(states, data.poolState).filter(
      (item): item is IState => 'isoCode' in item
    )[0]?.isoCode;

    if (!state) {
      data.poolState = '';
      data.poolCity = '';
    } else {
      data.poolState = state;
      data.poolCity = fuseSearchStatesAndCities(City.getCitiesOfState('US', state), data.poolCity!)[0]?.name || '';
    }
  }
  data.clientType =
    (simpleFuseSearch(['Residential', 'Commercial'], data.clientType || '')[0] as ClientType) || ClientType.Residential;
  data.poolType =
    (simpleFuseSearch(['Chlorine', 'Salt', 'Other'], data.poolType || '')[0] as PoolType) || PoolType.Chlorine;
  data.phone = onlyNumbers(data.phone || '').toString();
  data.animalDanger = !!data.animalDanger;
  data.monthlyPayment = onlyNumbers(data.monthlyPayment || '');
  return data;
}
