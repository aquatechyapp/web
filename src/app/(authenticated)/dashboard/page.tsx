'use client';

import { format } from 'date-fns';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

import { LoadingSpinner } from '@/components/LoadingSpinner';
import { Typography } from '@/components/Typography';
import { useAssignmentsContext } from '@/context/assignments';
import useGetClients from '@/hooks/react-query/clients/getClients';
import { useMapUtils } from '@/hooks/useMapUtils';
import useWindowDimensions from '@/hooks/useWindowDimensions';
import { useUserStore } from '@/store/user';
import { Assignment } from '@/ts/interfaces/Assignments';
import { Client } from '@/ts/interfaces/Client';
import { isEmpty } from '@/utils';

import ActionButton from './_components/ActionButton';
import InfoCardScrollable from './_components/InfoCardScrollable';
import InfoItem from './_components/InfoItem';
import StatisticCard from './_components/StatisticCard';
import Map from './Map';

export default function Page() {
  const user = useUserStore((state) => state.user);
  const { allAssignments } = useAssignmentsContext();
  const { directions, distance, duration, isLoaded, loadError } = useMapUtils();

  const { data: clients, isLoading } = useGetClients();
  const { width = 0 } = useWindowDimensions();

  const router = useRouter();

  useEffect(() => {
    if (user.firstName === '') {
      router.push('/account');
    }
  }, [user]);

  if (isLoading) return <LoadingSpinner />;

  const poolsByCityAsCompany = clients?.reduce(
    (
      acc: {
        [key: string]: number;
      },
      client: Client
    ) => {
      client.pools.forEach((pool) => {
        if (acc[pool.city]) {
          acc[pool.city] += 1;
        } else {
          acc[pool.city] = 1;
        }
      });
      return acc;
    },
    {}
  );

  const poolsByCityAsSubcontractor = allAssignments.reduce(
    (
      acc: {
        [key: string]: number;
      },
      assignment: Assignment
    ) => {
      if (assignment.assignmentToId === user?.id && assignment.assignmentOwnerId !== user.id) {
        if (acc[assignment.pool.city]) {
          acc[assignment.pool.city] += 1;
        } else {
          acc[assignment.pool.city] = 1;
        }
      }
      return acc;
    },
    {}
  );

  const assignmentsBySubcontractors = allAssignments.reduce(
    (
      acc: {
        [key: string]: number;
      },
      assignment: Assignment
    ) => {
      const subcontractor = user?.workRelationsAsAEmployer?.find(
        (subcontractor) => subcontractor.subcontractorId === assignment.assignmentToId
      );
      if (subcontractor) {
        const fullName = `${subcontractor.subcontractor.firstName} ${subcontractor.subcontractor.lastName}`;
        if (acc[fullName]) {
          acc[fullName] += 1;
        } else {
          acc[fullName] = 1;
        }
      }
      return acc;
    },
    {}
  );

  if (width < 1024) {
    return (
      <div className="p-2">
        <Typography element="h2" className="my-2">
          {format(new Date(), 'LLLL yyyy')}
        </Typography>
        <div className="flex w-full flex-col gap-6 text-nowrap">
          <StatisticCard value={user?.incomeAsACompany} type="incomeCompany" />
          <StatisticCard value={user?.incomeAsASubcontractor} type="incomeSubcontractor" />
          <StatisticCard value={clients?.length} type="clients" />
          <ActionButton type="add_client" />
          <ActionButton type="route_dashboard" />
          <ActionButton type="my_team" />
          <InfoCardScrollable title="Pools by city" subtitle=" (as a company)">
            {isEmpty(poolsByCityAsCompany) ? (
              <div>No pools found</div>
            ) : (
              Object.entries(poolsByCityAsCompany!)
                .sort((a, b) => b[1] - a[1])
                .map(([city, pools]) => <InfoItem key={city} title={city} description={`${pools} pools`} />)
            )}
          </InfoCardScrollable>
          <InfoCardScrollable title="Pools by city" subtitle=" (as a subcontractor)">
            {isEmpty(poolsByCityAsSubcontractor) ? (
              <div>No pools found</div>
            ) : (
              Object.entries(poolsByCityAsSubcontractor)
                .sort((a, b) => b[1] - a[1])
                .map(([city, pools]) => <InfoItem key={city} title={city} description={`${pools} pools`} />)
            )}
          </InfoCardScrollable>
          <InfoCardScrollable title="My Team">
            {isEmpty(assignmentsBySubcontractors) ? (
              <div>No team found</div>
            ) : (
              Object.entries(assignmentsBySubcontractors)
                .sort((a, b) => b[1] - a[1])
                .map(([city, pools]) => <InfoItem key={city} title={city} description={`${pools} pools`} />)
            )}
          </InfoCardScrollable>
        </div>
      </div>
    );
  }

  return (
    <div className="p-2">
      <Typography element="h2" className="mb-2">
        {format(new Date(), 'LLLL yyyy')}
      </Typography>
      <div className="flex w-full flex-col flex-wrap gap-6 text-nowrap">
        <div className="flex flex-1 flex-row items-start gap-6">
          <StatisticCard value={user?.incomeAsACompany} type="incomeCompany" />
          <StatisticCard value={user?.incomeAsASubcontractor} type="incomeSubcontractor" />
          <StatisticCard value={clients?.length} type="clients" />
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
        <div className="flex flex-1 flex-row items-start gap-6">
          <InfoCardScrollable title="My Team">
            {isEmpty(assignmentsBySubcontractors) ? (
              <div>No team found</div>
            ) : (
              Object.entries(assignmentsBySubcontractors)
                .sort((a, b) => b[1] - a[1])
                .map(([city, pools]) => <InfoItem key={city} title={city} description={`${pools} pools`} />)
            )}
          </InfoCardScrollable>
          <InfoCardScrollable title="Pools by city" subtitle=" (as a subcontractor)">
            {isEmpty(poolsByCityAsSubcontractor) ? (
              <div>No pools found</div>
            ) : (
              Object.entries(poolsByCityAsSubcontractor)
                .sort((a, b) => b[1] - a[1])
                .map(([city, pools]) => <InfoItem key={city} title={city} description={`${pools} pools`} />)
            )}
          </InfoCardScrollable>
          <InfoCardScrollable title="Pools by city" subtitle=" (as a company)">
            {isEmpty(poolsByCityAsCompany) ? (
              <div>No pools found</div>
            ) : (
              Object.entries(poolsByCityAsCompany!)
                .sort((a, b) => b[1] - a[1])
                .map(([city, pools]) => <InfoItem key={city} title={city} description={`${pools} pools`} />)
            )}
          </InfoCardScrollable>
        </div>
      </div>
    </div>
  );
}
