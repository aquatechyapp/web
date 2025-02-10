'use client';

import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

import { LoadingSpinner } from '@/components/LoadingSpinner';
import { useAssignmentsContext } from '@/context/assignments';
import useGetClients from '@/hooks/react-query/clients/getClients';
import { useMapAssignmentsUtils } from '@/hooks/useMapAssignmentsUtils';
import useWindowDimensions from '@/hooks/useWindowDimensions';
import { useUserStore } from '@/store/user';
import { Assignment } from '@/ts/interfaces/Assignments';
import { Client } from '@/ts/interfaces/Client';

import ActionButton from './_components/ActionButton';
import StatisticCard from './_components/StatisticCard';
import Map from './Map';
import { useServicesContext } from '@/context/services';
import useGetAllClients from '@/hooks/react-query/clients/getAllClients';

export default function Page() {
  const router = useRouter();

  const user = useUserStore((state) => state.user);

  const { services } = useServicesContext();
  const { allAssignments } = useAssignmentsContext();
  const { directions, distance, duration, isLoaded, loadError } = useMapAssignmentsUtils();

  const { data: allClients, isLoading: isLoadingAllClients } = useGetAllClients();
  const { width = 0 } = useWindowDimensions();

  useEffect(() => {
    if (user.firstName === '') {
      router.push('/account');
    }
  }, [user, router]);

  const totalClientsCount = allClients?.length;

  if (isLoadingAllClients) return <LoadingSpinner />;

  if (width < 1024) {
    return (
      <div className="p-2">
        <div className="flex w-full flex-col gap-6 text-nowrap">
          <ActionButton type="add_client" />
          <ActionButton type="route_dashboard" />
          <ActionButton type="my_team" />
          <StatisticCard value={totalClientsCount} type="clients" />
        </div>
      </div>
    );
  }

  return (
    <div className="p-2">
      <div className="flex w-full flex-col flex-wrap gap-6 text-nowrap">
        <div className="flex flex-1 flex-row items-start gap-6">
          <StatisticCard value={totalClientsCount} type="clients" />
        </div>
        <div className={'w-full'}>
          <Map
            assignments={allAssignments}
            directions={directions}
            distance={distance}
            duration={duration}
            isLoaded={isLoaded}
            loadError={loadError}
          />
        </div>
        <div className="flex flex-1 flex-row items-start gap-6">
          <ActionButton type="route_dashboard" />
          <ActionButton type="add_client" />
          <ActionButton type="my_team" />
        </div>
        <div className="flex flex-1 flex-row items-start gap-6"></div>
      </div>
    </div>
  );
}
