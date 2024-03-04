'use client';

import Link from 'next/link';
import { Card } from './Card';
import { Button } from '@/components/ui/button';
import { PlusIcon } from '@radix-ui/react-icons';
import { useEffect, useState } from 'react';
import { clientAxios } from '@/services/clientAxios';
import Loading from '../loading';
import useLocalStorage from '@/hooks/useLocalStorage';
import { Separator } from '@/components/ui/separator';
import { SubcontractorCard } from './SubcontractorCard';
import { EmployerCard } from './EmployerCard';
import { useUserContext } from '@/context/user';

export default function Page() {
  const { user, setUser } = useUserContext();
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
          <div className="text-xl font-semibold leading-[30px] tracking-tight text-neutral-800">
            Subcontractors
          </div>
          {!user?.subcontractors || user?.subcontractors?.length === 0 ? (
            <span>Not found subcontractors</span>
          ) : (
            <div className="flex gap-2">
              {user?.subcontractors.map((subcontractor) => (
                <SubcontractorCard
                  key={subcontractor.subcontractor.name}
                  name={subcontractor.subcontractor.name}
                  phone={subcontractor.subcontractor.phone}
                  email={subcontractor.subcontractor.email}
                  status={subcontractor.status}
                  workRelationId={subcontractor.id}
                />
              ))}
            </div>
          )}
        </div>
        <div className="flex flex-col gap-6 self-stretch">
          <div className="text-xl font-semibold leading-[30px] tracking-tight text-neutral-800">
            Employers
          </div>
          {!user?.subcontractors || user?.employers?.length === 0 ? (
            <span>Not found employers</span>
          ) : (
            user?.employers?.map((employee) => (
              <EmployerCard
                key={employee.company.name}
                name={employee.company.name}
                phone={employee.company.phone}
                email={employee.company.email}
                status={employee.status}
                workRelationId={employee.id}
              />
            ))
          )}
        </div>
      </div>
    </div>
  );
}
