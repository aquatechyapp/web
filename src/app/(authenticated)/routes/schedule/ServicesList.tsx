import { useState } from 'react';
import { BsThreeDotsVertical } from 'react-icons/bs';
import { MdDragIndicator } from 'react-icons/md';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';
import { useServicesContext } from '@/context/services';
import useWindowDimensions from '@/hooks/useWindowDimensions';
import { useMembersStore } from '@/store/members';
import { useUserStore } from '@/store/user';
import { getInitials } from '@/utils/others';
import { Service } from '@/ts/interfaces/Service';

export function ServicesList() {
  const user = useUserStore((state) => state.user);

  const { services } = useServicesContext();

  const assignedToId = useMembersStore((state) => state.assignedToId);

  const { width = 0 } = useWindowDimensions();

  const [openDialogDelete, setOpenDialogDelete] = useState(false);
  const [openDialogTransfer, setOpenDialogTransfer] = useState(false);

  const [service, setService] = useState<Service>();

  const shouldPermitChangeOrder = assignedToId !== user?.id || width < 900;

  // const [ active, setActive ] = useState<number | null>(null);

  if (services.length === 0) {
    return (
      <div className="flex w-full justify-center">
        <span>No services found for this weekday</span>
      </div>
    );
  }

  return (
    <>
      {services.map((service) => (
        <div className="flex" key={service.id}>
          <ServiceItem
            service={service}
            id={service.id}
            key={service.id}
            shouldPermitChangeOrder={shouldPermitChangeOrder}
          />
          <DropdownMenu>
            <DropdownMenuTrigger asChild className="self-center">
              <Button size="icon" variant="ghost">
                <BsThreeDotsVertical className="text-stone-500" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuItem
                onClick={() => {
                  setService(service);
                  setOpenDialogTransfer(true);
                }}
              >
                Transfer Service
              </DropdownMenuItem>
              <DropdownMenuItem
                className="text-red-500"
                onClick={() => {
                  setService(service);
                  setOpenDialogDelete(true);
                }}
              >
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      ))}
      {/* <DialogDeleteService open={openDialogDelete} setOpen={setOpenDialogDelete} service={service} /> */}

      {/* <DialogTransferRoute open={openDialogTransfer} setOpen={setOpenDialogTransfer} service={service} /> */}
    </>
  );
}

type ServiceItemProps = {
  id: string;
  service: Service;
  shouldPermitChangeOrder: boolean;
};

export function ServiceItem({ id, service, shouldPermitChangeOrder }: ServiceItemProps) {
  const name = `${service?.clientOwner?.firstName} ${service?.clientOwner?.lastName}`;
  const address = `${service?.clientOwner?.address}, ${service?.clientOwner?.city}, ${service?.clientOwner?.state}, ${service?.clientOwner?.zip}`;

  return (
    <div className="inline-flex w-full items-center justify-start self-stretch border-b border-gray-100 bg-gray-50 px-1">
      <div className="flex h-[60px] shrink grow basis-0 items-center justify-start gap-2 border-b border-gray-100 px-1 py-2">
        <div className="flex items-center justify-start gap-2">
          {!shouldPermitChangeOrder && (
            <div className="min-w-4">
              <MdDragIndicator size={16} />
            </div>
          )}
          <Avatar className="cursor-pointer text-sm">
            <AvatarImage src={''} />
            <AvatarFallback>{getInitials(name!)}</AvatarFallback>
          </Avatar>
          <div className="inline-flex flex-col items-start justify-center gap-1 text-pretty">
            <div className="text-pretty text-sm font-medium">{name}</div>
            <div className="overflow-hidden text-xs text-gray-500">{address}</div>
          </div>
        </div>
      </div>
      <div className="flex h-8 w-8 items-center justify-center gap-1 rounded-lg border border-gray-100">
        <div className="shrink grow basis-0 text-center text-sm font-semibold text-gray-800">{service.status}</div>
      </div>
    </div>
  );
}
