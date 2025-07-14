/* eslint-disable react-hooks/rules-of-hooks */
'use client';

import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { PlusIcon } from '@radix-ui/react-icons';

import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useUserStore } from '@/store/user';

import { CompanyMember } from '@/ts/interfaces/Company';

import { CompanyMemberCard } from './CompanyMemberCard';
import useGetMembersOfAllCompaniesByUserId from '@/hooks/react-query/companies/getMembersOfAllCompaniesByUserId';

export default function Page() {
  const user = useUserStore((state) => state.user);
  const router = useRouter();

  const { data: members } = useGetMembersOfAllCompaniesByUserId(user.id);

  const [searchTerm, setSearchTerm] = useState('');

  const filteredMembers = members?.filter((member: CompanyMember) =>
    `${member.firstName + member.lastName}`.toLowerCase().includes(searchTerm.toLowerCase())
  );

  useEffect(() => {
    if (user.firstName === '') {
      return router.push('/account');
    }
  }, [user]);

  return (
    <div className="p-2">
      <div className="flex flex-col items-start justify-start gap-4 md:flex-row">
        <Button onClick={() => router.push('/team/add-member')}>
          <PlusIcon className="mr-2" />
          Add member
        </Button>
        <Input
          placeholder="Filter by name"
          value={searchTerm}
          onChange={(event) => setSearchTerm(event.target.value)}
          className="w-full md:max-w-sm"
        />
      </div>

      <div className="mt-3">
        <div className="flex flex-wrap justify-center gap-2 self-stretch md:justify-normal">
          {filteredMembers && (
            <div className="flex flex-wrap justify-start gap-2">
              {filteredMembers.map((member: CompanyMember) => (
                <CompanyMemberCard
                  status={member.status}
                  key={member.id}
                  company={member.company}
                  id={member.id}
                  firstName={member.firstName}
                  lastName={member.lastName}
                  email={member.email}
                  phone={member.phone}
                  role={member.role}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
