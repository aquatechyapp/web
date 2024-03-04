'use client';
import { RoutesList } from './_components/RoutesList';
import Map from './_components/Map';
import { getClientsWithAssignments } from '../../../../server/actions';
import {
  HydrationBoundary,
  QueryClient,
  dehydrate,
  useQuery
} from '@tanstack/react-query';
import { clientAxios } from '@/services/clientAxios';
import Loading from '../loading';

export default function Page() {
  // const queryClient = new QueryClient();
  // await queryClient.prefetchQuery({
  //   queryKey: ['assignments'],
  //   queryFn: getClientsWithAssignments
  // });

  const { data, isLoading, isError } = useQuery({
    queryKey: ['assignments'],
    queryFn: async () => {
      const response = await clientAxios('/assignments');
      return response.data;
    }
  });

  if (isLoading) return <Loading />;
  return (
    <div className="inline-flex h-[100%] w-full items-start justify-start gap-3 bg-white p-2.5 shadow-inner">
      {/* <HydrationBoundary state={dehydrate(queryClient)}> */}
      <RoutesList assignments={data} />

      {/* </HydrationBoundary> */}
    </div>
  );
}
