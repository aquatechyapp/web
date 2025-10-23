'use client';

import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

import { Input } from '@/components/ui/input';
import { useUserStore } from '@/store/user';

import useGetCompanies from '@/hooks/react-query/companies/getCompanies';
import { CompanyWithMyRole } from '@/ts/interfaces/Company';
import { CompanyCard } from '../CompanyCard';
import { ModalAddCompany } from '../ModalAddCompany';
import { PlusIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function Page() {
  const user = useUserStore((state) => state.user);
  const { data: companies } = useGetCompanies();

  const [searchTerm, setSearchTerm] = useState('');
  const router = useRouter();

  const filteredCompanies = companies?.filter((company: CompanyWithMyRole) =>
    `${company.name}`.toLowerCase().includes(searchTerm.toLowerCase())
  );

  useEffect(() => {
    if (user.firstName === '') {
      router.push('/account');
    }
  }, [user]);

  return (
    <div className="p-2">
      <div className="flex flex-col items-stretch gap-4 md:flex-row md:items-center">
        <Button onClick={() => router.push('/team/add-company')}>
          <PlusIcon className="mr-2" />
          Add company
        </Button>

        <Input
          placeholder="Filter by name..."
          value={searchTerm}
          onChange={(event) => setSearchTerm(event.target.value)}
          className="w-full md:max-w-sm"
        />
      </div>

      <div className="mt-3">
        <div className="flex flex-wrap justify-center gap-2 self-stretch md:justify-normal">
          {filteredCompanies && (
            <div className="flex flex-col w-full gap-2 md:flex-row md:flex-wrap md:justify-start">
              {filteredCompanies.map((company: CompanyWithMyRole) => (
                <CompanyCard
                  key={company.id}
                  name={company.name}
                  email={company.email}
                  phone={company.phone}
                  companyId={company.id}
                  role={company.role}
                  status={company.status}
                  imageUrl={company.imageUrl}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
