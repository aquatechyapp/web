'use client';

import { format } from 'date-fns';

import { LoadingSpinner } from '@/components/LoadingSpinner';
import { useAssignmentsContext } from '@/context/assignments';
import useGetClients from '@/hooks/react-query/clients/getClients';
import useWindowDimensions from '@/hooks/useWindowDimensions';
import { Assignment } from '@/interfaces/Assignments';
import { Client } from '@/interfaces/Client';
import { useUserStore } from '@/store/user';
import { isEmpty } from '@/utils';

import ActionButton from './_components/ActionButton';
import InfoCardScrollable from './_components/InfoCardScrollable';
import InfoItem from './_components/InfoItem';
import StatisticCard from './_components/StatisticCard';

export default function Page() {
  const user = useUserStore((state) => state.user);
  const { allAssignments } = useAssignmentsContext();
  const { data: clients, isLoading } = useGetClients();
  const { width = 0 } = useWindowDimensions();

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
      <div>
        <div className="my-7 text-2xl font-semibold text-gray-800">{format(new Date(), 'LLLL yyyy')}</div>
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
              <div>No pools found</div>
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
    <div>
      <div className="my-7 text-2xl font-semibold text-gray-800">{format(new Date(), 'LLLL yyyy')}</div>
      <div className="flex w-full flex-wrap gap-6 text-nowrap">
        <div className="flex flex-1 flex-col items-start gap-6">
          <StatisticCard value={user?.incomeAsACompany} type="incomeCompany" />
          <ActionButton type="add_client" />
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
        <div className="flex flex-1 flex-col items-start gap-6">
          <StatisticCard value={user?.incomeAsASubcontractor} type="incomeSubcontractor" />
          <ActionButton type="route_dashboard" />
          <InfoCardScrollable title="Pools by city" subtitle=" (as a subcontractor)">
            {isEmpty(poolsByCityAsSubcontractor) ? (
              <div>No pools found</div>
            ) : (
              Object.entries(poolsByCityAsSubcontractor)
                .sort((a, b) => b[1] - a[1])
                .map(([city, pools]) => <InfoItem key={city} title={city} description={`${pools} pools`} />)
            )}
          </InfoCardScrollable>
        </div>
        <div className="flex flex-1 flex-col items-start gap-6">
          <StatisticCard value={clients?.length} type="clients" />
          <ActionButton type="my_team" />
          <InfoCardScrollable title="My Team">
            {isEmpty(assignmentsBySubcontractors) ? (
              <div>No pools found</div>
            ) : (
              Object.entries(assignmentsBySubcontractors)
                .sort((a, b) => b[1] - a[1])
                .map(([city, pools]) => <InfoItem key={city} title={city} description={`${pools} pools`} />)
            )}
          </InfoCardScrollable>
        </div>
      </div>
    </div>
  );
}
