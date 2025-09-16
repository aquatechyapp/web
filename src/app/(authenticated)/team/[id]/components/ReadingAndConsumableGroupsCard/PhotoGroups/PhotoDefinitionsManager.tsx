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
import { useGetPhotoDefinitions } from '@/hooks/react-query/photo-definitions/useGetPhotoDefinitions';
import { useCreatePhotoDefinition } from '@/hooks/react-query/photo-definitions/useCreatePhotoDefinition';
import { useUpdatePhotoDefinition } from '@/hooks/react-query/photo-definitions/useUpdatePhotoDefinition';
import { useDeletePhotoDefinition } from '@/hooks/react-query/photo-definitions/useDeletePhotoDefinition';
import { useBulkUpdatePhotoDefinitions } from '@/hooks/react-query/photo-definitions/useBulkUpdatePhotoDefinitions';

import { PhotoGroup, PhotoDefinition, CreatePhotoDefinitionRequest, UpdatePhotoDefinitionRequest } from '@/ts/interfaces/PhotoGroups';
import { CreatePhotoDefinitionDialog } from './CreatePhotoDefinitionDialog';
import { EditPhotoDefinitionDialog } from './EditPhotoDefinitionDialog';
import ConfirmActionDialog from '@/components/confirm-action-dialog';

// Draggable Photo Definition Row Component
interface DraggablePhotoDefinitionRowProps {
  definition: PhotoDefinition;
  onEdit: (definition: PhotoDefinition) => void;
  onDelete: (definition: PhotoDefinition) => void;
  isUpdating: boolean;
  isDeleting: boolean;
}

function DraggablePhotoDefinitionRow({ 
  definition, 
  onEdit, 
  onDelete, 
  isUpdating, 
  isDeleting 
}: DraggablePhotoDefinitionRowProps) {
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

interface PhotoDefinitionsManagerProps {
  photoGroup: PhotoGroup;
  companyId: string;
}

export function PhotoDefinitionsManager({ photoGroup, companyId }: PhotoDefinitionsManagerProps) {
  const [editingDefinition, setEditingDefinition] = useState<PhotoDefinition | null>(null);
  const [deletingDefinition, setDeletingDefinition] = useState<PhotoDefinition | null>(null);
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [localDefinitions, setLocalDefinitions] = useState<PhotoDefinition[]>([]);
  const [hasOrderChanged, setHasOrderChanged] = useState(false);

  const { data: photoDefinitionsData, isLoading } = useGetPhotoDefinitions(photoGroup.id);
  const { mutate: createPhotoDefinition, isPending: isCreating } = useCreatePhotoDefinition(companyId);
  const { mutate: updatePhotoDefinition, isPending: isUpdating } = useUpdatePhotoDefinition(companyId);
  const { mutate: deletePhotoDefinition, isPending: isDeleting } = useDeletePhotoDefinition(companyId);
  const { mutate: bulkUpdateDefinitions, isPending: isBulkUpdating } = useBulkUpdatePhotoDefinitions(companyId);

  const photoDefinitions = localDefinitions.length > 0 ? localDefinitions : (photoDefinitionsData?.photoDefinitions || []);

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  // Update local definitions when data changes
  useEffect(() => {
    if (photoDefinitionsData?.photoDefinitions) {
      const sortedDefinitions = [...photoDefinitionsData.photoDefinitions].sort((a, b) => a.order - b.order);
      setLocalDefinitions(sortedDefinitions);
    }
  }, [photoDefinitionsData?.photoDefinitions]);

  const handleCreateDefinition = (data: CreatePhotoDefinitionRequest) => {
    createPhotoDefinition({ photoGroupId: photoGroup.id, data }, {
      onSuccess: () => {
        setShowCreateDialog(false);
      }
    });
  };

  const handleUpdateDefinition = (data: UpdatePhotoDefinitionRequest) => {
    if (editingDefinition) {
      updatePhotoDefinition({ photoDefinitionId: editingDefinition.id, data }, {
        onSuccess: () => {
          setEditingDefinition(null);
        }
      });
    }
  };

  const handleDeleteDefinition = async () => {
    if (deletingDefinition) {
      deletePhotoDefinition(deletingDefinition.id, {
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
      photoDefinitionId: def.id,
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
          <h4 className="text-md font-semibold">Photo Definitions</h4>
          <p className="text-sm text-muted-foreground">
            Manage the specific photo types that can be captured for this group. Drag and drop to reorder.
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

      {photoDefinitions.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-6">
            <div className="text-muted-foreground mb-2">No photo definitions</div>
            <p className="text-sm text-muted-foreground text-center mb-4">
              Create photo definitions to specify what types of photos can be captured for this group.
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
                  <TableHead>Required</TableHead>
                  <TableHead className="w-20">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <SortableContext
                items={photoDefinitions.map(def => def.id)}
                strategy={verticalListSortingStrategy}
              >
                <TableBody>
                  {photoDefinitions.map((definition) => (
                    <DraggablePhotoDefinitionRow
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
      <CreatePhotoDefinitionDialog
        open={showCreateDialog}
        onOpenChange={setShowCreateDialog}
        onSubmit={handleCreateDefinition}
        isLoading={isCreating}
      />

      {/* Edit Dialog */}
      <EditPhotoDefinitionDialog
        open={!!editingDefinition}
        onOpenChange={() => setEditingDefinition(null)}
        photoDefinition={editingDefinition}
        onSubmit={handleUpdateDefinition}
        isLoading={isUpdating}
      />

      {/* Delete Confirmation */}
      <ConfirmActionDialog
        open={!!deletingDefinition}
        onOpenChange={() => setDeletingDefinition(null)}
        title="Delete Photo Definition"
        description={`Are you sure you want to delete "${deletingDefinition?.name}"? This action cannot be undone.`}
        onConfirm={handleDeleteDefinition}
        variant="destructive"
      />
    </div>
  );
}
