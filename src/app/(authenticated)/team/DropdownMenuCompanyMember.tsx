import React from 'react';
import { BsThreeDotsVertical } from 'react-icons/bs';
import { MdDeleteOutline, MdEdit } from 'react-icons/md';

import { LoadingSpinner } from '../../../components/LoadingSpinner';
import { Button } from '../../../components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogTitle, DialogTrigger } from '../../../components/ui/dialog';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuShortcut,
  DropdownMenuTrigger
} from '../../../components/ui/dropdown-menu';

import { useDeleteCompanyMember } from '@/hooks/react-query/companies/deleteCompanyMember';
import { ModalEditCompanyMember } from './ModalEditCompanyMember';
import { CompanyMember } from '@/ts/interfaces/Company';

export default function DropdownMenuCompanyMember({
  id,
  company,
  firstName,
  lastName,
  email,
  phone,
  role
}: CompanyMember) {
  const { isPending, mutate } = useDeleteCompanyMember();

  const handleDelete = () => {
    mutate({
      companyId: company.id,
      memberId: id
    });
  };

  if (isPending) return <LoadingSpinner />;

  return (
    <>
      <Dialog>
        <DropdownMenu>
          <DropdownMenuTrigger asChild className="absolute right-0 top-0 self-center">
            <Button size="icon" variant="ghost">
              <BsThreeDotsVertical className="text-stone-500" />
            </Button>
          </DropdownMenuTrigger>

          <DropdownMenuContent>
            <ModalEditCompanyMember
              company={company}
              id={id}
              firstName={firstName}
              lastName={lastName}
              email={email}
              phone={phone}
              role={role}
            >
              <div className="flex w-full items-center rounded p-1 text-gray-700 hover:bg-blue-50">
                Edit
                <DropdownMenuShortcut>
                  <MdEdit className="ml-1" />
                </DropdownMenuShortcut>
              </div>
            </ModalEditCompanyMember>

            <DialogTrigger asChild>
              <div className="flex w-full items-center rounded p-1 text-red-500 hover:bg-blue-50">
                Delete
                <DropdownMenuShortcut>
                  <MdDeleteOutline size={14} />
                </DropdownMenuShortcut>
              </div>
            </DialogTrigger>
          </DropdownMenuContent>
        </DropdownMenu>

        <DialogContent>
          <DialogTitle className="text-center">Are you sure?</DialogTitle>
          <DialogDescription>Once you remove this member, you will lose all the information.</DialogDescription>
          <div className="flex justify-around">
            <DialogTrigger asChild>
              <Button variant={'destructive'} onClick={handleDelete}>
                Delete
              </Button>
            </DialogTrigger>
            <DialogTrigger asChild>
              <Button variant={'outline'}>Cancel</Button>
            </DialogTrigger>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
