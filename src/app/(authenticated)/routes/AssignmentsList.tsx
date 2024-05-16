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
import Image from 'next/image';
import { useState } from 'react';
import { BsThreeDotsVertical } from 'react-icons/bs';
import { MdDragIndicator } from 'react-icons/md';

import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';
import { useAssignmentsContext } from '@/context/assignments';
import { useTechniciansContext } from '@/context/technicians';
import { useUserContext } from '@/context/user';
import useWindowDimensions from '@/hooks/useWindowDimensions';
import { Assignment } from '@/interfaces/Assignments';

import { DialogDeleteAssignment } from './dialog-delete-assignment';
import { DialogTransferRoute } from './dialog-transfer-route';

type Props = {
  handleDragEnd: (event: DragEndEvent, setActive: React.Dispatch<number | null>) => void;
};

export function AssignmentsList({ handleDragEnd }: Props) {
  const { user } = useUserContext();
  const { assignments, setAssignmentToTransfer } = useAssignmentsContext();
  const { assignmentToId } = useTechniciansContext();
  const [openDialogDelete, setOpenDialogDelete] = useState(false);
  const [openDialogTransfer, setOpenDialogTransfer] = useState(false);
  const [assignment, setAssignment] = useState<Assignment>();
  const { width = 0 } = useWindowDimensions();

  const shouldPermitChangeOrder = assignmentToId !== user?.id || width < 900;

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
            <DropdownMenu>
              <DropdownMenuTrigger asChild className="self-center">
                <Button size="icon" variant="ghost">
                  <BsThreeDotsVertical className="text-stone-500" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuItem
                  onClick={() => {
                    setAssignment(assignment);
                    setAssignmentToTransfer([assignment]);
                    setOpenDialogTransfer(true);
                  }}
                >
                  Transfer Assignment
                </DropdownMenuItem>
                <DropdownMenuItem
                  className="text-red-500"
                  onClick={() => {
                    setAssignment(assignment);
                    setOpenDialogDelete(true);
                  }}
                >
                  Delete
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        ))}
        <DialogDeleteAssignment open={openDialogDelete} setOpen={setOpenDialogDelete} assignment={assignment} />

        <DialogTransferRoute
          open={openDialogTransfer}
          setOpen={setOpenDialogTransfer}
          assignmentToId={assignmentToId}
          assignment={assignment}
        />
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

  const photo = assignment.pool.photos[0] || 'https://via.placeholder.com/44x44';
  const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ id });

  const startsOn = format(new Date(assignment.startOn), 'LLL, do, y');
  const endsAfter = format(new Date(assignment.endAfter), 'LLL, do, y');

  const isOnlyAt = startsOn === endsAfter;

  const style = {
    transform: CSS.Transform.toString(transform),
    transition
  };
  return (
    <div
      className="inline-flex w-full items-center justify-start self-stretch border-b border-gray-100 bg-gray-50 px-1"
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
    >
      <div className="flex h-[60px] shrink grow basis-0 items-center justify-start gap-2 border-b border-gray-100  px-1 py-2">
        <div className="flex items-center justify-start gap-2">
          {!shouldPermitChangeOrder && (
            <div className="min-w-4">
              <MdDragIndicator size={16} />
            </div>
          )}
          <Image width={11} height={11} alt="location photo" className="h-11 w-11 rounded-lg" src={photo} />
          <div className="inline-flex flex-col items-start  justify-center gap-1">
            <div className="text-pretty text-sm font-medium">{name}</div>
            {isOnlyAt ? (
              <div className="text-xs text-red-500">{startsOn}</div>
            ) : (
              <div className="text-xs text-gray-500">
                {startsOn} - {endsAfter}
              </div>
            )}
          </div>
        </div>
      </div>
      <div className="flex h-8 w-8 items-center justify-center gap-1 rounded-lg border border-gray-100 ">
        <div className="shrink grow basis-0 text-center text-sm font-semibold   text-gray-800">{assignment.order}</div>
      </div>
    </div>
  );
}
