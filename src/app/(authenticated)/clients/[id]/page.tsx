'use client';

import { api } from '@/services/api';
import ShowClient from './ShowClient';
import { clientAxios } from '@/services/clientAxios';
import { useEffect, useState } from 'react';
import Loading from '../../loading';

// export default function Page() {
//   return <DetailedClient />;
// }

export default function Page({ params: { id } }) {
  const [client, setClient] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const getData = async () => {
    setIsLoading(true);
    await clientAxios
      .get(`/client/${id}`)
      .then((res) => setClient(res.data))
      .finally(() => setIsLoading(false));
  };

  useEffect(() => {
    getData();
  }, []);

  if (isLoading) return <Loading />;

  return <ShowClient client={client} />;
}
