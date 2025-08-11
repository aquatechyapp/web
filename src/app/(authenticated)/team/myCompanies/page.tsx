'use client';

import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

import { Input } from '@/components/ui/input';
import { useUserStore } from '@/store/user';

import useGetCompanies from '@/hooks/react-query/companies/getCompanies';
import { CompanyWithMyRole } from '@/ts/interfaces/Company';
import { CompanyCard } from '../CompanyCard';
import { ModalAddCompany } from '../ModalAddCompany';

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
      <div className="flex flex-col items-start justify-start gap-4 md:flex-row">
        <ModalAddCompany />

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
            <div className="flex flex-wrap justify-center gap-2">
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
