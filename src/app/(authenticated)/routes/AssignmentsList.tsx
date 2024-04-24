import { Button } from '@/components/ui/button';
import {
  DndContext,
  DragOverlay,
  KeyboardSensor,
  PointerSensor,
  closestCenter,
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
import Image from 'next/image';
import { useState } from 'react';
import { MdDragIndicator } from 'react-icons/md';
import { useAssignmentsContext } from '@/context/assignments';
import { useTechniciansContext } from '@/context/technicians';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';
import { BsThreeDotsVertical } from 'react-icons/bs';
import { useUserContext } from '@/context/user';
import { Assignment } from '@/interfaces/Assignments';
import { DialogTransferRoute } from './dialog-transfer-route';
import { DialogDeleteAssignment } from './dialog-delete-assignment';

export function AssignmentsList({ handleDragEnd }) {
  const { user } = useUserContext();
  const { assignments, setAssignmentToTransfer } = useAssignmentsContext();
  const { assignmentToId } = useTechniciansContext();
  const [openDialogDelete, setOpenDialogDelete] = useState(false);
  const [openDialogTransfer, setOpenDialogTransfer] = useState(false);

  const shouldPermitChangeOrder = assignmentToId !== user?.id;

  const [active, setActive] = useState(null);
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates
    })
  );

  function handleDragStart(event) {
    setActive(event.active.data.current.sortable.index);
  }

  if (assignments.current.length === 0) {
    return (
      <div className="w-full flex justify-center">
        <span>No assignments found for this weekday</span>
      </div>
    );
  }

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragEnd={(e) => handleDragEnd(e, setActive)}
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
                    setAssignmentToTransfer([assignment]);
                    setOpenDialogTransfer(true);
                  }}
                >
                  Transfer Assignment
                </DropdownMenuItem>
                <DropdownMenuItem
                  className="text-red-500"
                  onClick={() => setOpenDialogDelete(true)}
                >
                  Delete
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
            <DialogDeleteAssignment
              open={openDialogDelete}
              setOpen={setOpenDialogDelete}
              assignment={assignment}
            />
            <DialogTransferRoute
              open={openDialogTransfer}
              setOpen={setOpenDialogTransfer}
              assignmentToId={assignmentToId}
              assignment={assignment}
            />
          </div>
        ))}
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

export function AssignmentItem({
  id,
  assignment,
  shouldPermitChangeOrder
}: AssignmentItemProps) {
  const address = `${assignment.pool.address} ${assignment.pool.city} ${assignment.pool.state} ${assignment.pool.zip}`;

  const name = assignment.pool.name;

  const photo =
    assignment.pool.photos[0] || 'https://via.placeholder.com/44x44';
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({ id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition
  };
  return (
    <div
      className="inline-flex items-center justify-start self-stretch border-b border-gray-100 w-full"
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
    >
      <div className="flex h-[60px] shrink grow basis-0 items-center justify-start gap-2 border-b border-gray-100 bg-white px-1 py-2">
        <div className="flex items-center justify-start gap-2">
          {!shouldPermitChangeOrder && <MdDragIndicator />}
          <Image
            width={11}
            height={11}
            alt="location photo"
            className="h-11 w-11 rounded-lg"
            src={photo}
          />
          <div className="inline-flex flex-col items-start justify-center gap-1">
            <div className="text-sm font-medium leading-tight tracking-tight text-neutral-800">
              {name}
            </div>
            <div className="text-xs font-normal leading-[18px] tracking-tight text-gray-500">
              {address}
            </div>
          </div>
        </div>
      </div>
      <div className="flex h-8 w-8 items-center justify-center gap-1 rounded-lg border border-gray-100 ">
        <div className="shrink grow basis-0 text-center text-sm font-semibold leading-tight tracking-tight text-neutral-800">
          {assignment.order}
        </div>
      </div>
    </div>
  );
}
