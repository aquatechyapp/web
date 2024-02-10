'use client';

import ActionButtons from './_components/ActionButtons';
import FilterBar from './_components/FilterBar';
import ClientsList from './_components/ClientsList';
import { clientAxios } from '@/services/clientAxios';
import Cookies from 'js-cookie';
import { useEffect, useState } from 'react';
import Loading from '../loading';

export default function Page() {
  const [data, setData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const getData = async () => {
    setIsLoading(true);
    await clientAxios
      .get('/clients')
      .then((res) => setData(res.data))
      .finally(() => setIsLoading(false));
  };
  useEffect(() => {
    getData();
  }, []);

  if (isLoading) return <Loading />;

  return (
    <div className="flex flex-col gap-6">
      <ActionButtons />
      <FilterBar />
      <ClientsList data={data} />
    </div>
  );
}
