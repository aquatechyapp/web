'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Plus, Edit, Trash2, GripVertical, Save } from 'lucide-react';

import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import {
  useSortable,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

import { LoadingSpinner } from '@/components/LoadingSpinner';
import { useGetReadingDefinitions } from '@/hooks/react-query/reading-definitions/useGetReadingDefinitions';
import { useCreateReadingDefinition } from '@/hooks/react-query/reading-definitions/useCreateReadingDefinition';
import { useUpdateReadingDefinition } from '@/hooks/react-query/reading-definitions/useUpdateReadingDefinition';
import { useDeleteReadingDefinition } from '@/hooks/react-query/reading-definitions/useDeleteReadingDefinition';
import { useBulkUpdateReadingDefinitions } from '@/hooks/react-query/reading-definitions/useBulkUpdateReadingDefinitions';

import { ReadingGroup, ReadingDefinition, CreateReadingDefinitionRequest, UpdateReadingDefinitionRequest } from '@/ts/interfaces/ReadingGroups';
import { CreateReadingDefinitionDialog } from './CreateReadingDefinitionDialog';
import { EditReadingDefinitionDialog } from './EditReadingDefinitionDialog';
import ConfirmActionDialog from '@/components/confirm-action-dialog';

// Draggable Reading Definition Row Component
interface DraggableReadingDefinitionRowProps {
  definition: ReadingDefinition;
  onEdit: (definition: ReadingDefinition) => void;
  onDelete: (definition: ReadingDefinition) => void;
  isUpdating: boolean;
  isDeleting: boolean;
}

function DraggableReadingDefinitionRow({ 
  definition, 
  onEdit, 
  onDelete, 
  isUpdating, 
  isDeleting 
}: DraggableReadingDefinitionRowProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: definition.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <TableRow ref={setNodeRef} style={style}>
      <TableCell>
        <div
          className="cursor-grab active:cursor-grabbing"
          {...attributes}
          {...listeners}
        >
          <GripVertical className="h-4 w-4 text-muted-foreground" />
        </div>
      </TableCell>
      <TableCell>
        <div>
          <div className="font-medium">{definition.name}</div>
          {definition.description && (
            <div className="text-sm text-muted-foreground">
              {definition.description}
            </div>
          )}
        </div>
      </TableCell>
      <TableCell>{definition.unit}</TableCell>
      <TableCell>
        {definition.minValue !== undefined && definition.maxValue !== undefined ? (
          <span className="text-sm">
            {definition.minValue} - {definition.maxValue}
          </span>
        ) : (
          <span className="text-sm text-muted-foreground">No range</span>
        )}
      </TableCell>
      <TableCell>
        {definition.goalValue !== undefined ? (
          <span className="text-sm">{definition.goalValue}</span>
        ) : (
          <span className="text-sm text-muted-foreground">No goal</span>
        )}
      </TableCell>
      <TableCell>
        <Badge variant={definition.isRequired ? "default" : "secondary"} className="text-xs">
          {definition.isRequired ? "Yes" : "No"}
        </Badge>
      </TableCell>
      <TableCell>
        <div className="flex items-center gap-1">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onEdit(definition)}
            disabled={isUpdating}
            className="h-8 w-8 p-0"
          >
            <Edit className="h-3 w-3" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onDelete(definition)}
            disabled={isDeleting}
            className="h-8 w-8 p-0 text-destructive hover:text-destructive"
          >
            <Trash2 className="h-3 w-3" />
          </Button>
        </div>
      </TableCell>
    </TableRow>
  );
}

interface ReadingDefinitionsManagerProps {
  readingGroup: ReadingGroup;
  companyId: string;
}

export function ReadingDefinitionsManager({ readingGroup, companyId }: ReadingDefinitionsManagerProps) {
  const [editingDefinition, setEditingDefinition] = useState<ReadingDefinition | null>(null);
  const [deletingDefinition, setDeletingDefinition] = useState<ReadingDefinition | null>(null);
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [localDefinitions, setLocalDefinitions] = useState<ReadingDefinition[]>([]);
  const [hasOrderChanged, setHasOrderChanged] = useState(false);

  const { data: readingDefinitionsData, isLoading } = useGetReadingDefinitions(readingGroup.id);
  const { mutate: createReadingDefinition, isPending: isCreating } = useCreateReadingDefinition(companyId);
  const { mutate: updateReadingDefinition, isPending: isUpdating } = useUpdateReadingDefinition(companyId);
  const { mutate: deleteReadingDefinition, isPending: isDeleting } = useDeleteReadingDefinition(companyId);
  const { mutate: bulkUpdateDefinitions, isPending: isBulkUpdating } = useBulkUpdateReadingDefinitions(companyId);

  const readingDefinitions = localDefinitions.length > 0 ? localDefinitions : (readingDefinitionsData?.readingDefinitions || []);

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  // Update local definitions when data changes
  useEffect(() => {
    if (readingDefinitionsData?.readingDefinitions) {
      const sortedDefinitions = [...readingDefinitionsData.readingDefinitions].sort((a, b) => a.order - b.order);
      setLocalDefinitions(sortedDefinitions);
    }
  }, [readingDefinitionsData?.readingDefinitions]);

  const handleCreateDefinition = (data: CreateReadingDefinitionRequest) => {
    createReadingDefinition({ readingGroupId: readingGroup.id, data }, {
      onSuccess: () => {
        setShowCreateDialog(false);
      }
    });
  };

  const handleUpdateDefinition = (data: UpdateReadingDefinitionRequest) => {
    if (editingDefinition) {
      updateReadingDefinition({ readingDefinitionId: editingDefinition.id, data }, {
        onSuccess: () => {
          setEditingDefinition(null);
        }
      });
    }
  };

  const handleDeleteDefinition = async () => {
    if (deletingDefinition) {
      deleteReadingDefinition(deletingDefinition.id, {
        onSuccess: () => {
          setDeletingDefinition(null);
        }
      });
    }
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (active.id !== over?.id) {
      const oldIndex = localDefinitions.findIndex(def => def.id === active.id);
      const newIndex = localDefinitions.findIndex(def => def.id === over?.id);

      if (oldIndex !== -1 && newIndex !== -1) {
        const newDefinitions = arrayMove(localDefinitions, oldIndex, newIndex);
        const updatedDefinitions = newDefinitions.map((def, index) => ({
          ...def,
          order: index + 1
        }));
        
        setLocalDefinitions(updatedDefinitions);
        setHasOrderChanged(true);
      }
    }
  };

  const handleSaveOrder = () => {
    const updateData = localDefinitions.map((def, index) => ({
      readingDefinitionId: def.id,
      order: index + 1
    }));

    bulkUpdateDefinitions(updateData, {
      onSuccess: () => {
        setHasOrderChanged(false);
      }
    });
  };

  if (isLoading) {
    return <LoadingSpinner />;
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <div>
          <h4 className="text-md font-semibold">Reading Definitions</h4>
          <p className="text-sm text-muted-foreground">
            Manage the specific readings that can be recorded for this group. Drag and drop to reorder.
          </p>
        </div>
        <div className="flex items-center gap-2">
          {hasOrderChanged && (
            <Button 
              onClick={handleSaveOrder} 
              size="sm" 
              disabled={isBulkUpdating}
              className="bg-orange-600 hover:bg-orange-700"
            >
              <Save className="h-4 w-4 mr-2" />
              {isBulkUpdating ? 'Saving...' : 'Save Order'}
            </Button>
          )}
          <Button onClick={() => setShowCreateDialog(true)} size="sm" disabled={isCreating}>
            <Plus className="h-4 w-4 mr-2" />
            Add Definition
          </Button>
        </div>
      </div>

      {readingDefinitions.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-6">
            <div className="text-muted-foreground mb-2">No reading definitions</div>
            <p className="text-sm text-muted-foreground text-center mb-4">
              Create reading definitions to specify what readings can be recorded for this group.
            </p>
            <Button onClick={() => setShowCreateDialog(true)} size="sm">
              <Plus className="h-4 w-4 mr-2" />
              Add First Definition
            </Button>
          </CardContent>
        </Card>
      ) : (
        <Card>
          <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragEnd={handleDragEnd}
          >
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-8"></TableHead>
                  <TableHead>Name</TableHead>
                  <TableHead>Unit</TableHead>
                  <TableHead>Range</TableHead>
                  <TableHead>Goal</TableHead>
                  <TableHead>Required</TableHead>
                  <TableHead className="w-20">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <SortableContext
                items={readingDefinitions.map(def => def.id)}
                strategy={verticalListSortingStrategy}
              >
                <TableBody>
                  {readingDefinitions.map((definition) => (
                    <DraggableReadingDefinitionRow
                      key={definition.id}
                      definition={definition}
                      onEdit={setEditingDefinition}
                      onDelete={setDeletingDefinition}
                      isUpdating={isUpdating}
                      isDeleting={isDeleting}
                    />
                  ))}
                </TableBody>
              </SortableContext>
            </Table>
          </DndContext>
        </Card>
      )}

      {/* Create Dialog */}
      <CreateReadingDefinitionDialog
        open={showCreateDialog}
        onOpenChange={setShowCreateDialog}
        onSubmit={handleCreateDefinition}
        isLoading={isCreating}
      />

      {/* Edit Dialog */}
      <EditReadingDefinitionDialog
        open={!!editingDefinition}
        onOpenChange={() => setEditingDefinition(null)}
        readingDefinition={editingDefinition}
        onSubmit={handleUpdateDefinition}
        isLoading={isUpdating}
      />

      {/* Delete Confirmation */}
      <ConfirmActionDialog
        open={!!deletingDefinition}
        onOpenChange={() => setDeletingDefinition(null)}
        title="Delete Reading Definition"
        description={`Are you sure you want to delete "${deletingDefinition?.name}"? This action cannot be undone.`}
        onConfirm={handleDeleteDefinition}
        variant="destructive"
      />
    </div>
  );
}
