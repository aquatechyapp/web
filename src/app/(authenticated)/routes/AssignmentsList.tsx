import { Button } from '@/app/_components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
  DialogTrigger
} from '@/app/_components/ui/dialog';
import { useToast } from '@/app/_components/ui/use-toast';
import { clientAxios } from '@/services/clientAxios';
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
import { useMutation, useQueryClient } from '@tanstack/react-query';
import Image from 'next/image';
import { useState } from 'react';
import { MdDragIndicator } from 'react-icons/md';
import { useAssignmentsContext } from '@/context/assignments';
import { useTechniciansContext } from '@/context/technicians';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuPortal,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger
} from '@/app/_components/ui/dropdown-menu';
import { BsThreeDotsVertical } from 'react-icons/bs';
import { useUserContext } from '@/context/user';
import { Assignment } from '@/interfaces/Assignments';

export function AssignmentsList({ handleDragEnd }) {
  const { user } = useUserContext();
  const { assignments } = useAssignmentsContext();
  const { assignmentToId } = useTechniciansContext();

  const shouldPermitChangeOrder = assignmentToId !== user?.id;

  const [active, setActive] = useState(null);
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates
    })
  );

  const { toast } = useToast();
  const queryClient = useQueryClient();
  const { mutate } = useMutation({
    mutationFn: async (assignmentId: string) =>
      await clientAxios.delete('/assignments', { data: { assignmentId } }),
    onError: () => {
      toast({
        title: 'Error deleting assignment',
        className: 'bg-red-500 text-white'
      });
    },
    onSuccess: (_, assignmentId) => {
      toast({
        title: 'Assignment deleted successfully',
        className: 'bg-green-500 text-white'
      });
      // aqui tem que verificar, pois o mapa não está atualizando
      queryClient.setQueryData(['assignments'], (oldData: Assignment[]) => {
        return oldData.filter((a) => a.id !== assignmentId);
      });
    }
  });

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
            <Dialog>
              <DropdownMenu>
                <DropdownMenuTrigger asChild className="self-center">
                  <Button size="icon" variant="ghost">
                    <BsThreeDotsVertical className="text-stone-500" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  <DropdownMenuGroup>
                    <DropdownMenuSub>
                      <DropdownMenuSubTrigger>
                        Change weekday
                      </DropdownMenuSubTrigger>
                      <DropdownMenuPortal>
                        <DropdownMenuSubContent>
                          <DropdownMenuItem>Sunday</DropdownMenuItem>
                          <DropdownMenuItem>Monday</DropdownMenuItem>
                          <DropdownMenuItem>Tuesday</DropdownMenuItem>
                          <DropdownMenuItem>Wednesday</DropdownMenuItem>
                          <DropdownMenuItem>Thursday</DropdownMenuItem>
                          <DropdownMenuItem>Friday</DropdownMenuItem>
                          <DropdownMenuItem>Saturday</DropdownMenuItem>
                        </DropdownMenuSubContent>
                      </DropdownMenuPortal>
                    </DropdownMenuSub>
                  </DropdownMenuGroup>
                  <DialogTrigger className="w-full">
                    <DropdownMenuItem>
                      <div className="text-red-500  flex items-center w-full">
                        Delete
                      </div>
                    </DropdownMenuItem>
                  </DialogTrigger>
                </DropdownMenuContent>
              </DropdownMenu>
              <DialogContent>
                <DialogTitle>{assignment.pool.name}</DialogTitle>
                <DialogDescription>
                  Are you sure you want to delete this assignment?
                </DialogDescription>
                <div className="flex justify-around">
                  <DialogTrigger>
                    <Button
                      onClick={() => mutate(assignment.id)}
                      className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded-full"
                    >
                      Accept
                    </Button>
                  </DialogTrigger>
                  <DialogTrigger>
                    <Button className="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded-full">
                      Cancel
                    </Button>
                  </DialogTrigger>
                </div>
              </DialogContent>
            </Dialog>
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
