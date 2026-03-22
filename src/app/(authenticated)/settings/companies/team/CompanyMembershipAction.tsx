'use client';

import { useQueryClient } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { useAcceptCompanyInvitation } from '@/hooks/react-query/companies/acceptCompanyInvitation';
import { useDeleteCompanyMember } from '@/hooks/react-query/companies/deleteCompanyMember';
import useGetCompanies from '@/hooks/react-query/companies/getCompanies';
import { useUserStore } from '@/store/user';

const QUIT_CONFIRMATION = 'QUIT';

type Props = {
  companyId: string;
  companyName: string;
  membershipStatus: 'Active' | 'Inactive';
};

export function CompanyMembershipAction({ companyId, companyName, membershipStatus }: Props) {
  const queryClient = useQueryClient();
  const router = useRouter();
  const { data: companies } = useGetCompanies();
  const user = useUserStore((state) => state.user);

  const company = companies?.find((c) => c.id === companyId);
  const role = company?.role;

  const [open, setOpen] = useState(false);
  const [quitConfirmText, setQuitConfirmText] = useState('');

  const { mutate: acceptInvitation, isPending: isAccepting } = useAcceptCompanyInvitation();
  const { mutate: removeMember, isPending: isQuitting } = useDeleteCompanyMember();

  if (!company || role === 'Owner' || role === 'Admin') {
    return null;
  }

  const isActive = membershipStatus === 'Active';
  const isBusy = isAccepting || isQuitting;

  const handleOpenChange = (next: boolean) => {
    setOpen(next);
    if (!next) setQuitConfirmText('');
  };

  const handleQuit = () => {
    removeMember(
      { companyId, memberId: user.id },
      {
        onSuccess: () => {
          queryClient.removeQueries({ queryKey: ['companies', companyId] });
          handleOpenChange(false);
          router.replace('/settings/companies');
        }
      }
    );
  };

  const handleAccept = () => {
    if (!company.userCompanyId) return;
    acceptInvitation(
      { userCompanyId: company.userCompanyId, status: 'Active' },
      { onSuccess: () => handleOpenChange(false) }
    );
  };

  return (
    <>
      <div className="flex w-full justify-center" onClick={(e) => e.stopPropagation()}>
        <Button type="button" variant={isActive ? 'outline' : 'default'} size="sm" onClick={() => setOpen(true)}>
          {isActive ? 'Quit company' : 'Accept invitation'}
        </Button>
      </div>

      <Dialog open={open} onOpenChange={handleOpenChange}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>{isActive ? 'Leave this company?' : 'Accept invitation'}</DialogTitle>
            <DialogDescription>
              {isActive ? (
                <>
                  You will lose access to {companyName} and its clients, pools, and services tied to your membership.
                </>
              ) : (
                <>
                  You will join {companyName} as {company.role}.
                </>
              )}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            {isActive ? (
              <>
                <p className="text-sm text-muted-foreground">
                  Type <span className="font-semibold">{QUIT_CONFIRMATION}</span> to confirm you want to leave.
                </p>
                <Input
                  value={quitConfirmText}
                  onChange={(e) => setQuitConfirmText(e.target.value)}
                  placeholder={QUIT_CONFIRMATION}
                  autoComplete="off"
                  aria-label="Type QUIT to confirm leaving the company"
                />
              </>
            ) : (
              <p className="text-sm text-muted-foreground">
                Confirm below to activate your membership. You can change this later from company settings if needed.
              </p>
            )}
          </div>

          <DialogFooter className="flex w-full flex-col gap-2 sm:flex-row sm:justify-end">
            <Button type="button" variant="outline" onClick={() => handleOpenChange(false)} disabled={isBusy}>
              Cancel
            </Button>
            {isActive ? (
              <Button
                type="button"
                variant="destructive"
                disabled={quitConfirmText !== QUIT_CONFIRMATION || isBusy}
                onClick={handleQuit}
              >
                {isQuitting ? 'Leaving…' : 'Leave company'}
              </Button>
            ) : (
              <Button type="button" disabled={isBusy} onClick={handleAccept}>
                {isAccepting ? 'Accepting…' : 'Accept invitation'}
              </Button>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
