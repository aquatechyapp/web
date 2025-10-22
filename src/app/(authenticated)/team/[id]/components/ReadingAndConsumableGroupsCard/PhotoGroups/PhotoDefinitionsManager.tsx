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
import { useBatchUpdatePhotoGroup } from '@/hooks/react-query/photo-groups/useBatchUpdatePhotoGroup';

import { PhotoGroup, PhotoDefinition, CreatePhotoDefinitionRequest, UpdatePhotoDefinitionRequest, CrudPhotoGroupRequest, BatchPhotoDefinitionUpdate, BatchPhotoDefinitionCreate } from '@/ts/interfaces/PhotoGroups';
import { CreatePhotoDefinitionDialog } from './CreatePhotoDefinitionDialog';
import { EditPhotoDefinitionDialog } from './EditPhotoDefinitionDialog';
import ConfirmActionDialog from '@/components/confirm-action-dialog';

// Draggable Photo Definition Row Component
interface DraggablePhotoDefinitionRowProps {
  definition: PhotoDefinition;
  onEdit: (definition: PhotoDefinition) => void;
  onDelete: (definition: PhotoDefinition) => void;
  isUpdating: boolean;
  pendingChanges: {
    updates: Map<string, Partial<PhotoDefinition>>;
    deletes: Set<string>;
    creates: BatchPhotoDefinitionCreate[];
  };
}

function DraggablePhotoDefinitionRow({
  definition,
  onEdit,
  onDelete,
  isUpdating,
  pendingChanges
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

  // Determine row styling based on pending changes
  let rowClassName = '';
  if (definition.id.startsWith('temp-')) {
    rowClassName = 'bg-green-50'; // New definition
  } else if (pendingChanges.updates.has(definition.id)) {
    rowClassName = 'bg-blue-50'; // Modified definition
  } else if (pendingChanges.deletes.has(definition.id)) {
    rowClassName = 'bg-red-50'; // Deleted definition
  }

  return (
    <TableRow ref={setNodeRef} style={style} className={`${isDragging ? 'z-50' : ''} ${rowClassName}`}>
      <TableCell {...attributes} {...listeners}>
        <GripVertical className="h-4 w-4 text-muted-foreground cursor-grab active:cursor-grabbing" />
      </TableCell>
      <TableCell>
        <div>
          <div className="flex items-center gap-2">
            <div className="font-medium">{definition.name}</div>
            {definition.id.startsWith('temp-') && (
              <Badge variant="default" className="bg-green-600 text-white text-xs">
                New
              </Badge>
            )}
            {pendingChanges.updates.has(definition.id) && !definition.id.startsWith('temp-') && (
              <Badge variant="default" className="bg-blue-600 text-white text-xs">
                Modified
              </Badge>
            )}
            {pendingChanges.deletes.has(definition.id) && (
              <Badge variant="destructive" className="text-xs">
                Deleted
              </Badge>
            )}
          </div>
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
            disabled={isUpdating}
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
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [showSaveConfirmationDialog, setShowSaveConfirmationDialog] = useState(false);
  const [localDefinitions, setLocalDefinitions] = useState<PhotoDefinition[]>([]);
  const [pendingChanges, setPendingChanges] = useState<{
    updates: Map<string, Partial<PhotoDefinition>>;
    deletes: Set<string>;
    creates: BatchPhotoDefinitionCreate[];
  }>({
    updates: new Map(),
    deletes: new Set(),
    creates: []
  });

  const { data: photoDefinitionsData, isLoading } = useGetPhotoDefinitions(photoGroup.id);
  const { mutate: batchUpdatePhotoGroup, isPending: isBulkUpdating } = useBatchUpdatePhotoGroup(companyId);

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
    console.log('Creating new definition:', data);

    // Add to pending creates instead of immediately creating
    const newDefinition: BatchPhotoDefinitionCreate = {
      name: data.name,
      description: data.description,
      isRequired: data.isRequired,
      allowGallery: data.allowGallery,
      order: localDefinitions.length + 1 // Add at the end
    };

    setPendingChanges(prev => {
      console.log('Current creates before adding:', prev.creates);

      // Check if a definition with the same name already exists in creates
      const existingCreate = prev.creates.find(create =>
        create.name === newDefinition.name
      );

      if (existingCreate) {
        console.log('Definition with same name already exists in creates, skipping duplicate');
        return prev;
      }

      const newCreates = [...prev.creates, newDefinition];
      console.log('New creates after adding:', newCreates);
      return {
        ...prev,
        creates: newCreates
      };
    });

    // Add to local state immediately for UI feedback
    const tempId = `temp-${Date.now()}`; // Temporary ID for UI
    const tempDefinition: PhotoDefinition = {
      id: tempId,
      name: newDefinition.name,
      description: newDefinition.description || null,
      isRequired: newDefinition.isRequired,
      allowGallery: newDefinition.allowGallery,
      order: newDefinition.order || 0,
      photoGroupId: photoGroup.id,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    setLocalDefinitions(prev => [...prev, tempDefinition]);
    setShowCreateDialog(false);
  };

  const handleUpdateDefinition = (data: UpdatePhotoDefinitionRequest) => {
    if (editingDefinition) {
      console.log('Updating definition:', editingDefinition.id, data);

      // If it's a temporary definition, update the create entry
      if (editingDefinition.id.startsWith('temp-')) {
        const tempIndex = editingDefinition.id.split('-')[1];
        setPendingChanges(prev => ({
          ...prev,
          creates: prev.creates.map((create, index) => {
            if (index === parseInt(tempIndex)) {
              return { ...create, ...data };
            }
            return create;
          })
        }));
      } else {
        // Update existing definition in pending changes
        setPendingChanges(prev => {
          const newUpdates = new Map(prev.updates);
          const existingUpdate = newUpdates.get(editingDefinition.id) || {};
          newUpdates.set(editingDefinition.id, { ...existingUpdate, ...data });
          return { ...prev, updates: newUpdates };
        });
      }

      // Update local state immediately for UI feedback
      setLocalDefinitions(prev => prev.map(def =>
        def.id === editingDefinition.id ? { ...def, ...data } : def
      ));

      setEditingDefinition(null);
    }
  };

  const handleDeleteDefinition = (definition: PhotoDefinition) => {

    if (definition.id.startsWith('temp-')) {
      // Remove from creates and local state
      const tempIndex = parseInt(definition.id.split('-')[1]);
      setPendingChanges(prev => ({
        ...prev,
        creates: prev.creates.filter((_, index) => index !== tempIndex)
      }));
      setLocalDefinitions(prev => prev.filter(def => def.id !== definition.id));
    } else {
      // Add to deletes and remove from local state
      setPendingChanges(prev => ({
        ...prev,
        deletes: new Set(Array.from(prev.deletes).concat(definition.id))
      }));
      setLocalDefinitions(prev => prev.filter(def => def.id !== definition.id));
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

        // Update order in pending changes
        updatedDefinitions.forEach((def, index) => {
          const newOrder = index + 1;

          if (def.id.startsWith('temp-')) {
            // Update order in creates array
            const tempIndex = parseInt(def.id.split('-')[1]);
            setPendingChanges(prev => ({
              ...prev,
              creates: prev.creates.map((create, idx) => {
                if (idx === tempIndex) {
                  return { ...create, order: newOrder };
                }
                return create;
              })
            }));
          } else {
            // Update order in updates map
            setPendingChanges(prev => {
              const newUpdates = new Map(prev.updates);
              const existingUpdate = newUpdates.get(def.id) || {};
              newUpdates.set(def.id, { ...existingUpdate, order: newOrder });
              return { ...prev, updates: newUpdates };
            });
          }
        });
      }
    }
  };

  const hasPendingChanges = () => {
    return pendingChanges.updates.size > 0 ||
           pendingChanges.deletes.size > 0 ||
           pendingChanges.creates.length > 0;
  };

  const handleSaveAllChanges = () => {
    console.log('Saving all changes:', pendingChanges);

    // Build the batch data
    const batchData: CrudPhotoGroupRequest = {};

    // Add updates if any
    if (pendingChanges.updates.size > 0) {
      batchData.photoDefinitionsUpdates = Array.from(pendingChanges.updates.entries()).map(([id, updates]) => ({
        photoDefinitionId: id,
        name: updates.name,
        description: updates.description || undefined,
        isRequired: updates.isRequired,
        allowGallery: updates.allowGallery,
        order: updates.order
      }));
    }

    // Smart optimization: filter creates and deletes
    const optimizedCreates = pendingChanges.creates.filter(create => {
      // Don't create if there's a delete with the same name (smart optimization)
      const hasMatchingDelete = Array.from(pendingChanges.deletes).some(deleteId => {
        const deletedDefinition = photoDefinitionsData?.photoDefinitions?.find(def => def.id === deleteId);
        return deletedDefinition?.name === create.name;
      });
      return !hasMatchingDelete;
    });

    const optimizedDeletes = Array.from(pendingChanges.deletes).filter(deleteId => {
      // Don't delete if there's a create with the same name (smart optimization)
      const deletedDefinition = photoDefinitionsData?.photoDefinitions?.find(def => def.id === deleteId);
      const hasMatchingCreate = pendingChanges.creates.some(create => create.name === deletedDefinition?.name);
      return !hasMatchingCreate;
    });

    // Add creates if any (after optimization)
    if (optimizedCreates.length > 0) {
      batchData.photoDefinitionsCreates = optimizedCreates;
    }

    // Add deletes if any (after optimization)
    if (optimizedDeletes.length > 0) {
      batchData.photoDefinitionsDeletes = optimizedDeletes;
    }

    console.log('Optimized batch data:', batchData);

    batchUpdatePhotoGroup({ photoGroupId: photoGroup.id, data: batchData }, {
      onSuccess: () => {
        // Reset pending changes
        setPendingChanges({
          updates: new Map(),
          deletes: new Set(),
          creates: []
        });
        setShowSaveConfirmationDialog(false);
      }
    });
  };

  const handleDiscardChanges = () => {
    // Reset local definitions to original data
    if (photoDefinitionsData?.photoDefinitions) {
      const sortedDefinitions = [...photoDefinitionsData.photoDefinitions].sort((a, b) => a.order - b.order);
      setLocalDefinitions(sortedDefinitions);
    }

    // Clear pending changes
    setPendingChanges({
      updates: new Map(),
      deletes: new Set(),
      creates: []
    });
  };

  if (isLoading) {
    return <LoadingSpinner />;
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3">
        <div>
          <h4 className="text-md font-semibold">Photo Definitions</h4>
          <p className="text-sm text-muted-foreground">
            Manage the specific photo types that can be captured for this group
          </p>
        </div>
        <Button onClick={() => setShowCreateDialog(true)} size="sm" disabled={isBulkUpdating}>
          <Plus className="h-4 w-4 mr-2" />
          Add Definition
        </Button>
      </div>

      {/* Pending Changes Summary */}
      {hasPendingChanges() && (
        <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">

            <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-2">
              <span className="text-sm font-medium text-amber-800">Pending Changes:</span>
              <span className="text-sm text-amber-700">
                {pendingChanges.creates.length} new, {pendingChanges.updates.size} modified, {pendingChanges.deletes.size} deleted
              </span>
            </div>

            <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
              <Button
                onClick={handleDiscardChanges}
                size="sm"
                variant="outline"
                disabled={isBulkUpdating}
                className="w-full sm:w-auto"
              >
                Discard Changes
              </Button>
              <Button
                onClick={() => setShowSaveConfirmationDialog(true)}
                size="sm"
                disabled={isBulkUpdating}
                className="w-full sm:w-auto bg-green-600 hover:bg-green-700 text-white"
              >
                <Save className="h-4 w-4 mr-2" />
                {isBulkUpdating ? 'Saving...' : 'Save All'}
              </Button>
            </div>

          </div>
        </div>
      )}

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
                  {photoDefinitions.map((definition) => {
                    return (
                      <DraggablePhotoDefinitionRow
                        key={definition.id}
                        definition={definition}
                        onEdit={setEditingDefinition}
                        onDelete={handleDeleteDefinition}
                        isUpdating={isBulkUpdating}
                        pendingChanges={pendingChanges}
                      />
                    );
                  })}
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
        isLoading={isBulkUpdating}
      />

      {/* Edit Dialog */}
      <EditPhotoDefinitionDialog
        open={!!editingDefinition}
        onOpenChange={() => setEditingDefinition(null)}
        photoDefinition={editingDefinition}
        onSubmit={handleUpdateDefinition}
        isLoading={isBulkUpdating}
      />

      {/* Save Confirmation Dialog */}
      <ConfirmActionDialog
        open={showSaveConfirmationDialog}
        onOpenChange={setShowSaveConfirmationDialog}
        title="Save Photo Definition Changes"
        description={`You are about to save changes to photo definitions. This action will update all open services scheduled from today onwards, expire all user sessions (users will need to log in again), and apply changes to ${pendingChanges.creates.length} new, ${pendingChanges.updates.size} modified, and ${pendingChanges.deletes.size} deleted definitions. This operation cannot be undone.`}
        onConfirm={async () => {
          setShowSaveConfirmationDialog(false);
          handleSaveAllChanges();
        }}
        confirmText="Save Changes"
        variant="default"
      />
    </div>
  );
}
