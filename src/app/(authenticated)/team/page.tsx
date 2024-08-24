'use client';

import { PlusIcon } from '@radix-ui/react-icons';
import Link from 'next/link';
import { useState } from 'react';

import { Input } from '@/components/ui/input';
import { WorkRelation } from '@/ts/interfaces/User';
import { useUserStore } from '@/store/user';

import { Button } from '../../../components/ui/button';
import { WorkRelationCard } from './WorkRelationCard'; // Import the unified component

export default function Page() {
  const user = useUserStore((state) => state.user);
  const [searchTerm, setSearchTerm] = useState('');

  const filteredSubcontractors = user?.workRelationsAsAEmployer.filter((subcontractor) =>
    `${subcontractor.subcontractor.firstName} ${subcontractor.subcontractor.lastName}`
      .toLowerCase()
      .includes(searchTerm.toLowerCase())
  );

  const filteredEmployers = user?.workRelationsAsASubcontractor.filter((employee) =>
    `${employee.company.firstName} ${employee.company.lastName}`.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div>
      <div className="flex flex-col items-start justify-start gap-4 border-b py-3 md:flex-row">
        <Link href="/team/newSubcontractor" className="w-full md:w-fit">
          <Button className="w-full text-nowrap">
            <PlusIcon className="mr-1p" />
            Add Sub-contractor
          </Button>
        </Link>
        <Input
          placeholder="Filter by name..."
          value={searchTerm}
          onChange={(event) => setSearchTerm(event.target.value)}
          className="w-full md:max-w-sm"
        />
      </div>

      <div className="mt-3">
        <div className="flex flex-wrap justify-center gap-6 self-stretch md:justify-normal">
          {filteredSubcontractors?.length === 0 && filteredEmployers?.length === 0 && (
            <span>No contractors found.</span>
          )}
          {filteredSubcontractors && (
            <div className="flex flex-wrap justify-center gap-2">
              {filteredSubcontractors.map((subcontractor: WorkRelation) => (
                <WorkRelationCard
                  key={subcontractor.subcontractor.email}
                  type="subcontractor"
                  name={`${subcontractor.subcontractor.firstName} ${subcontractor.subcontractor.lastName}`}
                  phone={subcontractor.subcontractor.phone}
                  email={subcontractor.subcontractor.email}
                  status={subcontractor.status}
                  workRelationId={subcontractor.id}
                />
              ))}
            </div>
          )}
          {filteredEmployers && (
            <div className="flex gap-2">
              {filteredEmployers.map((employee: WorkRelation) => (
                <WorkRelationCard
                  key={employee.company.email}
                  type="employer"
                  name={`${employee.company.firstName} ${employee.company.lastName}`}
                  phone={employee.company.phone}
                  email={employee.company.email}
                  status={employee.status}
                  workRelationId={employee.id}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
