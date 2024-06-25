import { ICity, IState } from 'country-state-city';
import Fuse from 'fuse.js';

// Uma simples busca onde passamos um array de strings dos valores e o nome a ser buscado
export const simpleFuseSearch = (data: string[], name: string) => {
  const fuseOptions = {
    minMatchCharLength: 3,
    threshold: 0.4,
    distance: 100
  };
  return new Fuse(data, fuseOptions).search(name).map((p) => p.item);
};

export const fuseSearchStatesAndCities = (data: (IState | ICity)[], name: string) => {
  const fuseOptions = {
    keys: ['name', 'isoCode'],
    minMatchCharLength: 3,
    threshold: 0.4,
    distance: 100
  };
  return new Fuse(data, fuseOptions).search(name).map((p) => p.item);
};
