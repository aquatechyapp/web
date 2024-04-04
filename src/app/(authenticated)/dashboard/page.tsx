'use client';

import StatisticCard from './_components/StatisticCard';
import ActionButton from './_components/ActionButton';
import InfoCardScrollable from './_components/InfoCardScrollable';
import InfoItem from './_components/InfoItem';
import { format } from 'date-fns';
import { useUserContext } from '@/context/user';
import useGetClients from '@/hooks/react-query/clients/getClients';
import { LoadingSpinner } from '@/app/_components/LoadingSpinner';
import { useAssignmentsContext } from '@/context/assignments';
import { isEmpty } from '@/utils';

export default function Page() {
  const { user } = useUserContext();
  const { allAssignments, assignments } = useAssignmentsContext();
  const { data: clients, isLoading, isSuccess } = useGetClients();

  if (isLoading) return <LoadingSpinner />;

  const poolsByCityAsCompany = clients.reduce((acc, client) => {
    client.pools.forEach((pool) => {
      if (acc[pool.city]) {
        acc[pool.city] += 1;
      } else {
        acc[pool.city] = 1;
      }
    });
    return acc;
  }, {});

  const poolsByCityAsSubcontractor = allAssignments.reduce(
    (acc, assignment) => {
      if (
        assignment.assignmentToId === user.id &&
        assignment.assignmentOwnerId !== user.id
      ) {
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
    (acc, assignment) => {
      const subcontractor = user.subcontractors.find(
        (subcontractor) =>
          subcontractor.subcontractor.id === assignment.assignmentToId
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

  return (
    <div>
      <div className="my-7 text-2xl font-semibold text-gray-800">
        {format(new Date(), 'LLLL yyyy')}
      </div>
      <div className="Frame211 inline-flex flex-col items-start justify-start gap-6">
        <div className="Row inline-flex items-start justify-start gap-6 self-stretch">
          <StatisticCard value={user?.incomeAsACompany} type="incomeCompany" />
          <StatisticCard
            value={user?.incomeAsASubcontractor}
            type="incomeSubcontractor"
          />
          <StatisticCard value={clients.length} type="clients" />
        </div>
        <div className="Row inline-flex items-start justify-start gap-6 self-stretch">
          <ActionButton type="add_client" />
          <ActionButton type="route_dashboard" />
          <ActionButton type="my_team" />
        </div>
        <div className="Frame212 inline-flex w-[1147px] items-start justify-start gap-6">
          <InfoCardScrollable title="Pools by city" subtitle=" (as a company)">
            {isEmpty(poolsByCityAsCompany) ? (
              <div>No pools found</div>
            ) : (
              Object.entries(poolsByCityAsCompany)
                .sort((a, b) => b[1] - a[1])
                .map(([city, pools]) => (
                  <InfoItem
                    key={city}
                    title={city}
                    description={`${pools} pools`}
                  />
                ))
            )}
          </InfoCardScrollable>
          <InfoCardScrollable
            title="Pools by city"
            subtitle=" (as a subcontractor)"
          >
            {isEmpty(poolsByCityAsSubcontractor) ? (
              <div>No pools found</div>
            ) : (
              Object.entries(poolsByCityAsSubcontractor)
                .sort((a, b) => b[1] - a[1])
                .map(([city, pools]) => (
                  <InfoItem
                    key={city}
                    title={city}
                    description={`${pools} pools`}
                  />
                ))
            )}
          </InfoCardScrollable>
          <InfoCardScrollable title="My Team">
            {isEmpty(assignmentsBySubcontractors) ? (
              <div>No pools found</div>
            ) : (
              Object.entries(assignmentsBySubcontractors)
                .sort((a, b) => b[1] - a[1])
                .map(([city, pools]) => (
                  <InfoItem
                    key={city}
                    title={city}
                    description={`${pools} pools`}
                  />
                ))
            )}
          </InfoCardScrollable>
        </div>
      </div>
    </div>
  );
}
