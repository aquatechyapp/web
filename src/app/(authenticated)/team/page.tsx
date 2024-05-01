// Use client
"use client";

import { useState } from 'react';
import Link from 'next/link';
import { Button } from '../../../components/ui/button';
import { PlusIcon } from '@radix-ui/react-icons';
import { SubcontractorCard } from './SubcontractorCard';
import { EmployerCard } from './EmployerCard';
import { useUserContext } from '../../../context/user';
import { Input } from '@/components/ui/input';

export default function Page() {
  const { user } = useUserContext();
  const [searchTerm, setSearchTerm] = useState('');

  const filteredSubcontractors = user?.subcontractors.filter(subcontractor =>
    `${subcontractor.subcontractor.firstName} ${subcontractor.subcontractor.lastName}`
      .toLowerCase()
      .includes(searchTerm.toLowerCase())
  );

  const filteredEmployers = user?.employers.filter(employee =>
    `${employee.company.firstName} ${employee.company.lastName}`
      .toLowerCase()
      .includes(searchTerm.toLowerCase())
  );

  return (
    <div>
      <div className="h-16 flex items-start justify-start py-3 border-b">
        <Link href="/team/newSubcontractor">
          <Button>
            <PlusIcon className="mr-1" />
            Add Sub-contractor
          </Button>
        </Link>
        <Input
          placeholder="Filter contractor..."
          value={searchTerm}
          onChange={event => setSearchTerm(event.target.value)}
          className="max-w-sm ml-4"
        />
      </div>

      <div className="mt-3">
        <div className="flex gap-6 self-stretch flex-wrap">
          {(filteredSubcontractors?.length === 0 && filteredEmployers?.length === 0) && (
            <span>No contractors found.</span>
          )}
          {filteredSubcontractors && (
            <div className="flex gap-2">
              {filteredSubcontractors.map(subcontractor => (
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
            </div>
          )}
          {filteredEmployers && (
            <div className="flex gap-2">
              {filteredEmployers.map(employee => (
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
      </div>
    </div>
  );
}
