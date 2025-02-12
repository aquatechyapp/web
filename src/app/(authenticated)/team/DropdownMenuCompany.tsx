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
import { useDeleteCompany } from '@/hooks/react-query/companies/deleteCompany';
import { ModalEditCompany } from './ModalEditCompany';
import useGetCompanies from '@/hooks/react-query/companies/getCompanies';
import { ModalViewCompany } from './ModalViewCompany';
import { EyeOpenIcon } from '@radix-ui/react-icons';
import { ModalEditCompanyRelation } from './ModalEditCompanyRelation';

type Props = {
  companyId: string;
};

export default function DropdownMenuCompany({ companyId }: Props) {
  const { isPending, mutate } = useDeleteCompany();
  const { data: companies } = useGetCompanies();

  const userRole = companies?.find((company) => company.id === companyId)?.role;

  const handleDelete = () => {
    mutate({ companyId });
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
            {userRole === 'Owner' ? (
              <>
                <ModalEditCompany companyId={companyId}>
                  <div className="flex w-full items-center rounded p-1 text-gray-700 hover:bg-blue-50">
                    Edit
                    <DropdownMenuShortcut>
                      <MdEdit className="ml-1" />
                    </DropdownMenuShortcut>
                  </div>
                </ModalEditCompany>
                <DialogTrigger asChild>
                  <div className="flex w-full items-center rounded p-1 text-red-500 hover:bg-blue-50">
                    Delete
                    <DropdownMenuShortcut>
                      <MdDeleteOutline size={14} />
                    </DropdownMenuShortcut>
                  </div>
                </DialogTrigger>
              </>
            ) : (
              <>
                <ModalViewCompany companyId={companyId}>
                  <div className="flex w-full items-center rounded p-1 text-gray-700 hover:bg-blue-50">
                    View
                    <DropdownMenuShortcut>
                      <EyeOpenIcon className="ml-1" />
                    </DropdownMenuShortcut>
                  </div>
                </ModalViewCompany>
                <ModalEditCompanyRelation companyId={companyId}>
                  <div className="flex w-full items-center rounded p-1 text-gray-700 hover:bg-blue-50">
                    Accept/Revoke
                    <DropdownMenuShortcut>
                      <MdEdit className="ml-1" />
                    </DropdownMenuShortcut>
                  </div>
                </ModalEditCompanyRelation>
              </>
            )}
          </DropdownMenuContent>
        </DropdownMenu>

        <DialogContent>
          <DialogTitle>Are you sure?</DialogTitle>
          <DialogDescription>
            Once you delete this company, you will lose all the information about clients, pools{' '}
          </DialogDescription>
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
