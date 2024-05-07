'use client';

import { PlusIcon } from '@radix-ui/react-icons';
import Link from 'next/link';
import { useState } from 'react';

import { Input } from '@/components/ui/input';

import { Button } from '../../../components/ui/button';
import { useUserContext } from '../../../context/user';
import { EmployerCard } from './EmployerCard';
import { SubcontractorCard } from './SubcontractorCard';

export default function Page() {
  const { user } = useUserContext();
  const [searchTerm, setSearchTerm] = useState('');

  const filteredSubcontractors = user?.subcontractors.filter((subcontractor) =>
    `${subcontractor.subcontractor.firstName} ${subcontractor.subcontractor.lastName}`
      .toLowerCase()
      .includes(searchTerm.toLowerCase())
  );

  const filteredEmployers = user?.employers.filter((employee) =>
    `${employee.company.firstName} ${employee.company.lastName}`.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div>
      <div className="flex h-16 items-start justify-start border-b py-3">
        <Link href="/team/newSubcontractor">
          <Button>
            <PlusIcon className="mr-1" />
            Add Sub-contractor
          </Button>
        </Link>
        <Input
          placeholder="Filter by name..."
          value={searchTerm}
          onChange={(event) => setSearchTerm(event.target.value)}
          className="ml-4 max-w-sm"
        />
      </div>

      <div className="mt-3">
        <div className="flex flex-wrap gap-6 self-stretch">
          {filteredSubcontractors?.length === 0 && filteredEmployers?.length === 0 && (
            <span>No contractors found.</span>
          )}
          {filteredSubcontractors && (
            <div className="flex gap-2">
              {filteredSubcontractors.map((subcontractor) => (
                <SubcontractorCard
                  type="subcontractor"
                  key={subcontractor.subcontractor.email}
                  name={`${subcontractor.subcontractor.firstName} ${subcontractor.subcontractor.lastName}`}
                  phone={subcontractor.subcontractor.phone}
                  email={subcontractor.subcontractor.email}
                  status={subcontractor.status}
                  workRelationId={subcontractor.id}
                />
              ))}
              {filteredEmployers && (
                <div className="flex gap-2">
                  {filteredEmployers.map((employee) => (
                    <EmployerCard
                      key={employee.company.email}
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
          )}
        </div>
      </div>
    </div>
  );
}
