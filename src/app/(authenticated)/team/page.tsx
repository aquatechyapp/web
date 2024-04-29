'use client';

import Link from 'next/link';
import { Button } from '../../../components/ui/button';
import { PlusIcon } from '@radix-ui/react-icons';
import { SubcontractorCard } from './SubcontractorCard';
import { EmployerCard } from './EmployerCard';
import { useUserContext } from '../../../context/user';

export default function Page() {
  const { user } = useUserContext();

  return (
    <div>
      <div className="h-16 items-start justify-start py-3">
        <Link href={'/team/newSubcontractor'}>
          <Button>
            <PlusIcon className="mr-1" />
            Add Sub-contractor
          </Button>
        </Link>
      </div>
      <div className="grid grid-cols-2">
        <div className="flex flex-col gap-6 self-stretch">
          <div className="text-xl font-semibold leading-[30px]  text-gray-800">
            Subcontractors
          </div>
          {!user?.subcontractors || user?.subcontractors?.length === 0 ? (
            <span>Not found subcontractors</span>
          ) : (
            <div className="flex gap-2">
              {user?.subcontractors.map((subcontractor) => {
                const fullName = `${subcontractor.subcontractor.firstName} ${subcontractor.subcontractor.lastName}`;
                return (
                  <SubcontractorCard
                    type={'subcontractor'}
                    key={subcontractor.subcontractor.email}
                    name={fullName}
                    phone={subcontractor.subcontractor.phone}
                    email={subcontractor.subcontractor.email}
                    status={subcontractor.status}
                    workRelationId={subcontractor.id}
                  />
                );
              })}
            </div>
          )}
        </div>
        <div className="flex flex-col gap-6 self-stretch">
          <div className="text-xl font-semibold leading-[30px]  text-gray-800">
            Employers
          </div>
          {!user?.subcontractors || user?.employers?.length === 0 ? (
            <span>Not found employers</span>
          ) : (
            user?.employers?.map((employee) => {
              const fullName = `${employee.company.firstName} ${employee.company.lastName}`;
              return (
                <EmployerCard
                  key={fullName}
                  name={fullName}
                  phone={employee.company.phone}
                  email={employee.company.email}
                  status={employee.status}
                  workRelationId={employee.id}
                />
              );
            })
          )}
        </div>
      </div>
    </div>
  );
}
