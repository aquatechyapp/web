import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
  DialogTrigger
} from '@/components/ui/dialog';
import { useToast } from '@/components/ui/use-toast';
import { clientAxios } from '@/services/clientAxios';
import {
  DndContext,
  DragOverlay,
  KeyboardSensor,
  PointerSensor,
  closestCenter,
  useDraggable,
  useSensor,
  useSensors
} from '@dnd-kit/core';
import {
  SortableContext,
  arrayMove,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import Image from 'next/image';
import { useEffect, useState } from 'react';
import { MdDeleteOutline, MdDragIndicator } from 'react-icons/md';
import Loading from '../../loading';

export function AssignmentsList({
  assignments,
  assignmentToId,
  weekday,
  userId,
  setAssignments
}) {
  useEffect(() => {
    const filteredAndSorted = assignments
      .filter(
        (a) => a.assignmentToId === assignmentToId && a.weekday === weekday
      )
      .sort((a, b) => a.order - b.order);

    const maxOrder = 99;
    const newAssignments = filteredAndSorted.map((a, index) => {
      if (a.order === maxOrder) {
        return { ...a, order: index + 1 };
      }
    });

    setItems(newAssignments);
  }, [assignments, assignmentToId, weekday]);

  const [items, setItems] = useState([]);
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
    mutationFn: async (assignmentId) =>
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
      queryClient.setQueryData(['assignments'], (oldData) => {
        console.log(oldData);
        return oldData.filter((a) => a.id !== assignmentId);
      });
    }
  });

  function handleDragStart(event) {
    setActive(event.active.data.current.sortable.index);
  }
  function handleDragEnd(event) {
    const { active, over } = event;
    setActive(null);
    if (active.id !== over.id) {
      const oldIndex = items.findIndex((item) => item.id === active.id);
      const newIndex = items.findIndex((item) => item.id === over.id);

      const ordered = arrayMove(items, oldIndex, newIndex);
      setItems(ordered);
    }
  }

  useEffect(() => {}, []);

  if (items.length === 0)
    return <span>No assignments found for this weekday</span>;
  console.log(items);
  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragEnd={handleDragEnd}
      onDragStart={handleDragStart}
    >
      <SortableContext items={items} strategy={verticalListSortingStrategy}>
        {items.map((assignment, index) => (
          <div className="flex" key={assignment.order}>
            <AssignmentItem
              id={assignment.id}
              key={assignment.id}
              address={`${assignment.pool.address} ${assignment.pool.city} ${assignment.pool.state} ${assignment.pool.zip}`}
              photo={
                assignment.pool.photos[0] || 'https://via.placeholder.com/44x44'
              }
              name={assignment.pool.name}
              index={index}
            />
            <Dialog>
              <DialogTrigger>
                <Button variant={'destructive'} size={'sm'}>
                  <MdDeleteOutline />
                </Button>
              </DialogTrigger>
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
              id={items[active].id}
              key={items[active].id}
              address={`${items[active].pool.address} ${items[active].pool.city} ${items[active].pool.state} ${items[active].pool.zip}`}
              photo={
                items[active].pool.photos[0] ||
                'https://via.placeholder.com/44x44'
              }
              name={items[active].pool.name}
              index={active}
            />
          </div>
        ) : null}
      </DragOverlay>
    </DndContext>
  );
}

export function AssignmentItem({ name, address, id, index, photo }) {
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
          <MdDragIndicator />
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
          {index + 1}
        </div>
      </div>
    </div>
  );
}
