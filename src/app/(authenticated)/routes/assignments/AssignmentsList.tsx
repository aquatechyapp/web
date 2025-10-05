import {
  closestCenter,
  DndContext,
  DragEndEvent,
  DragOverlay,
  DragStartEvent,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors
} from '@dnd-kit/core';
import {
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { format } from 'date-fns';
import { toZonedTime } from 'date-fns-tz';
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
import { useAssignmentsContext } from '@/context/assignments';
import useWindowDimensions from '@/hooks/useWindowDimensions';
import { useMembersStore } from '@/store/members';
import { useUserStore } from '@/store/user';
import { Assignment } from '@/ts/interfaces/Assignments';
import { getInitials } from '@/utils/others';

import { DialogDeleteAssignment } from './ModalDeleteAssignment';
import { DialogTransferRoute } from './ModalTransferRoute';
import { AssignmentDropdownActions } from './components/AssignmentActions';

type Props = {
  handleDragEnd: (event: DragEndEvent, setActive: React.Dispatch<number | null>) => void;
};

export function AssignmentsList({ handleDragEnd }: Props) {
  const user = useUserStore((state) => state.user);

  const { assignments } = useAssignmentsContext();

  const assignmentToId = useMembersStore((state) => state.assignmentToId);

  const { width = 0 } = useWindowDimensions();

  const [openDialogDelete, setOpenDialogDelete] = useState(false);
  const [openDialogTransfer, setOpenDialogTransfer] = useState(false);

  const [assignment, setAssignment] = useState<Assignment>();

  // const shouldPermitChangeOrder = assignmentToId !== user?.id || width < 900;
  const shouldPermitChangeOrder = width < 900;

  const [active, setActive] = useState<number | null>(null);

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates
    })
  );

  function handleDragStart(event: DragStartEvent) {
    setActive(event.active.data.current?.sortable.index);
  }

  if (assignments.current.length === 0) {
    return (
      <div className="flex w-full justify-center">
        <span>No assignments found for this weekday</span>
      </div>
    );
  }

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragEnd={(e: DragEndEvent) => handleDragEnd(e, setActive)}
      onDragStart={handleDragStart}
    >
      <SortableContext
        items={assignments.current}
        strategy={verticalListSortingStrategy}
        disabled={shouldPermitChangeOrder}
      >
        {assignments.current.map((assignment) => (
          <div className="flex" key={assignment.order}>
            <AssignmentItem
              assignment={assignment}
              id={assignment.id}
              key={assignment.id}
              shouldPermitChangeOrder={shouldPermitChangeOrder}
            />
            <AssignmentDropdownActions assignment={assignment} />
          </div>
        ))}
        <DialogDeleteAssignment open={openDialogDelete} setOpen={setOpenDialogDelete} assignment={assignment} />
        <DialogTransferRoute open={openDialogTransfer} setOpen={setOpenDialogTransfer} assignment={assignment} />
      </SortableContext>
      <DragOverlay className="w-full">
        {active !== null ? (
          <div className="w-full">
            <AssignmentItem
              assignment={assignments.current[active]}
              id={assignments.current[active].id}
              key={assignments.current[active].id}
              shouldPermitChangeOrder={shouldPermitChangeOrder}
            />
          </div>
        ) : null}
      </DragOverlay>
    </DndContext>
  );
}

type AssignmentItemProps = {
  id: string;
  assignment: Assignment;
  shouldPermitChangeOrder: boolean;
};

export function AssignmentItem({ id, assignment, shouldPermitChangeOrder }: AssignmentItemProps) {
  const name = assignment.pool.name;

  const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ id });

  const zonedStartOn = toZonedTime(assignment.startOn, 'UTC');
  const startsOn = format(zonedStartOn, 'LLL, do, y');

  const zonedEndAfter = toZonedTime(assignment.endAfter, 'UTC');
  const endsAfter = zonedEndAfter.getFullYear() > 2030 ? 'No end' : format(zonedEndAfter, 'LLL, do, y');

  const isOnlyAt = startsOn === endsAfter;
  
  // Check if assignment is expired (endAfter is in the past and not "No end")
  const isExpired = zonedEndAfter.getFullYear() <= 2100 && zonedEndAfter < new Date();

  const frequencyMap = {
    WEEKLY: 'Weekly',
    E2WEEKS: 'Each 2 weeks',
    E3WEEKS: 'Each 3 weeks',
    E4WEEKS: 'Each 4 weeks',
    ONCE: 'Once'
  };

  const style = {
    transform: CSS.Transform.toString(transform),
    transition
  };
  return (
    <div
      className={`inline-flex w-full items-center justify-start self-stretch border-b border-gray-100 px-1 py-3 ${
        isExpired ? 'bg-red-50 opacity-75' : 'bg-gray-50'
      }`}
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
    >
      <div className="flex h-[60px] shrink grow basis-0 items-center justify-start gap-2 border-b border-gray-100 px-1 py-2">
        <div className="flex items-center justify-start gap-2 ">
          {!shouldPermitChangeOrder && (
            <div className="min-w-4">
              <MdDragIndicator size={16} />
            </div>
          )}
          {/* <Avatar className="cursor-pointer text-sm">
            <AvatarImage src={''} />
            <AvatarFallback>{getInitials(name)}</AvatarFallback>
          </Avatar> */}
          <div className="inline-flex flex-col items-start justify-center gap-1">
            <div className={`text-pretty text-sm font-medium ${isExpired ? 'text-gray-600' : ''}`}>
              {`${name} ${assignment.serviceType?.name ? `(${assignment.serviceType?.name})` : ''}`}
              {isExpired && <span className="ml-2 text-xs font-semibold text-red-600">(EXPIRED)</span>}
            </div>
            {isOnlyAt ? (
              <div className={`text-xs ${isExpired ? 'text-red-600' : 'text-red-500'}`}>{startsOn}</div>
            ) : (
              <div className={`text-xs ${isExpired ? 'text-red-600' : 'text-gray-500'}`}>
                {startsOn} - {endsAfter} - {frequencyMap[assignment.frequency as keyof typeof frequencyMap]}
              </div>
            )}
          </div>
        </div>
      </div>
      <div className={`flex h-8 w-8 items-center justify-center gap-1 rounded-lg border ${
        isExpired ? 'border-red-200 bg-red-100' : 'border-gray-100'
      }`}>
        <div className={`shrink grow basis-0 text-center text-sm font-semibold ${
          isExpired ? 'text-red-700' : 'text-gray-800'
        }`}>{assignment.order}</div>
      </div>
    </div>
  );
}
