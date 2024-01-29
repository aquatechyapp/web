'use client';

import { format } from 'date-fns';
import { useState } from 'react';
import { WeekdaysNav } from './WeekdaysNav';
import TechnicianSelect from './TechnicianSelect';
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragOverlay
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy
} from '@dnd-kit/sortable';
import { MdDragIndicator } from 'react-icons/md';
import { CSS } from '@dnd-kit/utilities';

export type Weekdays =
  | 'Sunday'
  | 'Monday'
  | 'Tuesday'
  | 'Wednesday'
  | 'Thursday'
  | 'Friday'
  | 'Saturday';

const routes = [
  {
    id: '1',
    image: 'https://via.placeholder.com/44x44',
    name: 'Point 1',
    address: '1600 Amphitheatre Parkway, Mountain View, california.'
  },
  {
    id: '2',
    image: 'https://via.placeholder.com/44x44',
    name: 'Point 2',
    address: '1600 Amphitheatre Parkway, Mountain View, california.'
  },
  {
    id: '3',
    image: 'https://via.placeholder.com/44x44',
    name: 'Point 3',
    address: '1600 Amphitheatre Parkway, Mountain View, california.'
  },
  {
    id: '4',
    image: 'https://via.placeholder.com/44x44',
    name: 'Point 4',
    address: '1600 Amphitheatre Parkway, Mountain View, california.'
  },
  {
    id: '5',
    image: 'https://via.placeholder.com/44x44',
    name: 'Point 5',
    address: '1600 Amphitheatre Parkway, Mountain View, california.'
  }
];

function RouteItem({ image, name, address, id, index }) {
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({ id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition
  };

  return (
    <div
      className="inline-flex items-center justify-start self-stretch border-b border-gray-100"
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
    >
      <div className="flex h-[60px] shrink grow basis-0 items-center justify-start gap-2 border-b border-gray-100 bg-white px-1 py-2">
        <div className="flex items-center justify-start gap-2">
          <MdDragIndicator />
          <img
            className="h-11 w-11 rounded-lg"
            src="https://via.placeholder.com/44x44"
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
export function RoutesList() {
  const currentWeekday = format(new Date(2020, 1, 10), 'EEEE') as Weekdays;
  // const [items, setItems] = useState(routes);
  const [items, setItems] = useState(routes);
  const [active, setActive] = useState(null);
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates
    })
  );
  const [selectedWeekday, setSelectedWeekday] =
    useState<Weekdays>(currentWeekday);
  function handleDragStart(event) {
    setActive(event.active.data.current.sortable.index);
  }
  console.log(active);

  return (
    <div className="inline-flex w-[100%] flex-col items-center justify-start gap-3.5 rounded-lg border border-zinc-200 bg-white p-6">
      <WeekdaysNav
        selectedWeekday={selectedWeekday}
        setSelectedWeekday={setSelectedWeekday}
      />
      <div className="flex h-10 flex-col items-start justify-start gap-1 self-stretch">
        <TechnicianSelect />
      </div>

      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragEnd={handleDragEnd}
        onDragStart={handleDragStart}
      >
        <SortableContext items={items} strategy={verticalListSortingStrategy}>
          {items.map((route, index) => (
            <RouteItem
              id={route.id}
              key={route.id}
              // address={'route.address'}
              address={route.address}
              image={route.image}
              name={route.name}
              index={index}
            />
          ))}
        </SortableContext>
        <DragOverlay>
          {active !== null ? (
            <div className="w-[100%]">
              <RouteItem
                id={items[active].id}
                key={items[active].id}
                // address={'items[active].address'}
                address={items[active].address}
                image={items[active].image}
                name={items[active].name}
                index={active}
              />
            </div>
          ) : null}
        </DragOverlay>
      </DndContext>
    </div>
  );
  function handleDragEnd(event) {
    const { active, over } = event;
    setActive(null);
    if (active.id !== over.id) {
      setItems((items) => {
        const oldIndex = items.findIndex((item) => item.id === active.id);
        const newIndex = items.findIndex((item) => item.id === over.id);

        return arrayMove(items, oldIndex, newIndex);
      });
    }
  }
}
