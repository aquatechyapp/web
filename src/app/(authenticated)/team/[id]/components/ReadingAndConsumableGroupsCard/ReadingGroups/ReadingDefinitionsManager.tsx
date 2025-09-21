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
import { useBatchUpdateReadingGroup } from '@/hooks/react-query/reading-groups/useBatchUpdateReadingGroup';

import { ReadingGroup, ReadingDefinition, CreateReadingDefinitionRequest, UpdateReadingDefinitionRequest, CrudReadingGroupRequest, BatchReadingDefinitionUpdate, BatchReadingDefinitionCreate } from '@/ts/interfaces/ReadingGroups';
import { CreateReadingDefinitionDialog } from './CreateReadingDefinitionDialog';
import { EditReadingDefinitionDialog } from './EditReadingDefinitionDialog';
import ConfirmActionDialog from '@/components/confirm-action-dialog';

// Draggable Reading Definition Row Component
interface DraggableReadingDefinitionRowProps {
  definition: ReadingDefinition;
  onEdit: (definition: ReadingDefinition) => void;
  onDelete: (definition: ReadingDefinition) => void;
  hasPendingChanges: boolean;
  isDeleted: boolean;
  isNew: boolean;
}

function DraggableReadingDefinitionRow({ 
  definition, 
  onEdit, 
  onDelete, 
  hasPendingChanges,
  isDeleted,
  isNew
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
    <TableRow 
      ref={setNodeRef} 
      style={style}
      className={`${isDeleted ? 'opacity-50 bg-red-50' : ''} ${isNew ? 'bg-green-50' : ''} ${hasPendingChanges && !isNew ? 'bg-blue-50' : ''}`}
    >
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
        <div className="flex items-center gap-2">
          <div>
            <div className="font-medium">{definition.name}</div>
            {definition.description && (
              <div className="text-sm text-muted-foreground">
                {definition.description}
              </div>
            )}
          </div>
          {isNew && (
            <Badge variant="outline" className="text-xs bg-green-100 text-green-700">
              New
            </Badge>
          )}
          {hasPendingChanges && !isNew && (
            <Badge variant="outline" className="text-xs bg-blue-100 text-blue-700">
              Modified
            </Badge>
          )}
          {isDeleted && (
            <Badge variant="destructive" className="text-xs">
              Deleted
            </Badge>
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
            disabled={isDeleted}
            className="h-8 w-8 p-0"
          >
            <Edit className="h-3 w-3" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onDelete(definition)}
            disabled={isDeleted}
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
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [showSaveConfirmationDialog, setShowSaveConfirmationDialog] = useState(false);
  const [localDefinitions, setLocalDefinitions] = useState<ReadingDefinition[]>([]);
  const [pendingChanges, setPendingChanges] = useState<{
    updates: Map<string, Partial<ReadingDefinition>>;
    deletes: Set<string>;
    creates: BatchReadingDefinitionCreate[];
  }>({
    updates: new Map(),
    deletes: new Set(),
    creates: []
  });

  const { data: readingDefinitionsData, isLoading } = useGetReadingDefinitions(readingGroup.id);
  const { mutate: batchUpdateReadingGroup, isPending: isBulkUpdating } = useBatchUpdateReadingGroup(companyId);

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
    console.log('Creating new definition:', data);
    
    // Add to pending creates instead of immediately creating
    const newDefinition: BatchReadingDefinitionCreate = {
      name: data.name,
      unit: data.unit,
      description: data.description,
      isRequired: data.isRequired,
      minValue: data.minValue,
      maxValue: data.maxValue,
      goalValue: data.goalValue,
      step: data.step,
      order: localDefinitions.length + 1 // Add at the end
    };

    setPendingChanges(prev => {
      console.log('Current creates before adding:', prev.creates);
      
      // Check if a definition with the same name and unit already exists in creates
      const existingCreate = prev.creates.find(create => 
        create.name === newDefinition.name && create.unit === newDefinition.unit
      );
      
      if (existingCreate) {
        console.log('Definition with same name/unit already exists in creates, skipping duplicate');
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
    const tempDefinition: ReadingDefinition = {
      id: tempId,
      name: newDefinition.name,
      unit: newDefinition.unit,
      description: newDefinition.description,
      isRequired: data.isRequired || false,
      minValue: newDefinition.minValue,
      maxValue: newDefinition.maxValue,
      goalValue: newDefinition.goalValue,
      step: newDefinition.step,
      order: newDefinition.order || (localDefinitions.length + 1),
      readingGroupId: readingGroup.id,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    setLocalDefinitions(prev => [...prev, tempDefinition]);
    setShowCreateDialog(false);
  };

  const handleUpdateDefinition = (data: UpdateReadingDefinitionRequest) => {
    if (editingDefinition) {
      // Add to pending updates
      setPendingChanges(prev => ({
        ...prev,
        updates: new Map(prev.updates).set(editingDefinition.id, data)
      }));

      // Update local state immediately for UI feedback
      setLocalDefinitions(prev => 
        prev.map(def => 
          def.id === editingDefinition.id 
            ? { ...def, ...data }
            : def
        )
      );

      setEditingDefinition(null);
    }
  };

  const handleDeleteDefinition = (definition: ReadingDefinition) => {
    console.log('Deleting definition:', definition);
    
    // Don't delete temporary (new) definitions - just remove them from creates and local state
    if (definition.id.startsWith('temp-')) {
      console.log('Removing temporary definition from creates');
      // Remove from pending creates
      setPendingChanges(prev => ({
        ...prev,
        creates: prev.creates.filter(create => 
          !(create.name === definition.name && create.unit === definition.unit)
        )
      }));
    } else {
      console.log('Adding real definition to pending deletes:', definition.id);
      // Add real definitions to pending deletes
      setPendingChanges(prev => {
        const newDeletes = new Set(prev.deletes).add(definition.id);
        console.log('Updated deletes set:', Array.from(newDeletes));
        return {
          ...prev,
          deletes: newDeletes
        };
      });
    }

    // Remove from local state immediately for UI feedback
    setLocalDefinitions(prev => 
      prev.filter(def => def.id !== definition.id)
    );
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

        // Update pending changes with new order for all definitions
        setPendingChanges(prev => {
          const newUpdates = new Map(prev.updates);
          const newCreates = [...prev.creates];
          
          updatedDefinitions.forEach((def, index) => {
            if (def.id.startsWith('temp-')) {
              // For new definitions, update the order in the creates array instead of updates
              const createIndex = newCreates.findIndex(create => 
                create.name === def.name && create.unit === def.unit
              );
              if (createIndex !== -1) {
                newCreates[createIndex] = { ...newCreates[createIndex], order: index + 1 };
              }
            } else {
              // For existing definitions, update the order in the updates map
              const existingUpdate = newUpdates.get(def.id) || {};
              newUpdates.set(def.id, { ...existingUpdate, order: index + 1 });
            }
          });
          
          return { 
            ...prev, 
            updates: newUpdates,
            creates: newCreates
          };
        });
      }
    }
  };

  const hasPendingChanges = () => {
    return pendingChanges.updates.size > 0 || pendingChanges.deletes.size > 0 || pendingChanges.creates.length > 0;
  };

  const handleSaveAllChanges = () => {
    if (hasPendingChanges()) {
      const batchData: CrudReadingGroupRequest = {
        readingDefinitionsUpdates: [],
        readingDefinitionsCreates: [],
        readingDefinitionsDeletes: []
      };

      // Add all updates (including order changes)
      pendingChanges.updates.forEach((update, definitionId) => {
        batchData.readingDefinitionsUpdates!.push({
          readingDefinitionId: definitionId,
          ...update
        });
      });

      // Smart optimization: Check for add/delete conflicts
      const optimizedCreates: BatchReadingDefinitionCreate[] = [];
      const optimizedDeletes: string[] = [];

      // Process creates and deletes with smart optimization
      pendingChanges.creates.forEach((create) => {
        // Check if this create conflicts with any delete
        const conflictingDelete = Array.from(pendingChanges.deletes).find(deleteId => {
          // For new definitions, we can't have exact conflicts since they don't have real IDs yet
          // But we can check for similar definitions (same name/unit) being deleted
          const deletedDefinition = localDefinitions.find(def => def.id === deleteId);
          return deletedDefinition && 
                 deletedDefinition.name === create.name && 
                 deletedDefinition.unit === create.unit;
        });

        if (!conflictingDelete) {
          optimizedCreates.push(create);
        }
        // If there's a conflict, we skip both the create and delete (smart optimization)
      });

      // Process deletes - only include deletes that don't conflict with creates
      // If there are no creates, include all deletes
      if (pendingChanges.creates.length === 0) {
        // No creates, so all deletes are safe to include
        pendingChanges.deletes.forEach((deleteId) => {
          optimizedDeletes.push(deleteId);
        });
      } else {
        // Check for conflicts with creates
        pendingChanges.deletes.forEach((deleteId) => {
          // Use original definitions data instead of localDefinitions (which might have been modified)
          const deletedDefinition = readingDefinitionsData?.readingDefinitions?.find(def => def.id === deleteId);
          if (deletedDefinition) {
            const conflictingCreate = pendingChanges.creates.find(create => 
              create.name === deletedDefinition.name && 
              create.unit === deletedDefinition.unit
            );

            if (!conflictingCreate) {
              optimizedDeletes.push(deleteId);
            }
            // If there's a conflict, we skip both the create and delete (smart optimization)
          } else {
            // If we can't find the definition, still include it in deletes (it might be a valid delete)
            optimizedDeletes.push(deleteId);
          }
        });
      }

      // Only add arrays if they have content
      if (optimizedCreates.length > 0) {
        batchData.readingDefinitionsCreates = optimizedCreates;
      }
      if (optimizedDeletes.length > 0) {
        batchData.readingDefinitionsDeletes = optimizedDeletes;
      }

      // Remove empty arrays to clean up the request
      if (batchData.readingDefinitionsUpdates && batchData.readingDefinitionsUpdates.length === 0) {
        delete batchData.readingDefinitionsUpdates;
      }
      if (batchData.readingDefinitionsCreates && batchData.readingDefinitionsCreates.length === 0) {
        delete batchData.readingDefinitionsCreates;
      }
      if (batchData.readingDefinitionsDeletes && batchData.readingDefinitionsDeletes.length === 0) {
        delete batchData.readingDefinitionsDeletes;
      }

      // Debug logging
      console.log('Batch data being sent:', batchData);
      console.log('Pending changes:', {
        updates: Array.from(pendingChanges.updates.entries()),
        deletes: Array.from(pendingChanges.deletes),
        creates: pendingChanges.creates
      });
      console.log('Optimized deletes:', optimizedDeletes);
      console.log('Optimized creates:', optimizedCreates);

      batchUpdateReadingGroup({
        readingGroupId: readingGroup.id,
        data: batchData
      }, {
        onSuccess: () => {
          setPendingChanges({
            updates: new Map(),
            deletes: new Set(),
            creates: []
          });
        }
      });
    }
  };

  const handleDiscardChanges = () => {
    // Reset local definitions to original state
    if (readingDefinitionsData?.readingDefinitions) {
      const sortedDefinitions = [...readingDefinitionsData.readingDefinitions].sort((a, b) => a.order - b.order);
      setLocalDefinitions(sortedDefinitions);
    }
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
      <div className="flex justify-between items-center">
        <div>
          <h4 className="text-md font-semibold">Reading Definitions</h4>
          <div>
            <p className="text-sm text-muted-foreground">
              Manage the specific readings that can be recorded for this group. Drag and drop to reorder.
            </p>
            {hasPendingChanges() && (
              <div className="mt-2 text-sm">
                <span className="text-orange-600 font-medium">
                  {pendingChanges.creates.length} new, {pendingChanges.updates.size} modified, {pendingChanges.deletes.size} deleted
                </span>
                
              </div>
            )}
          </div>
        </div>
        <div className="flex items-center gap-2">
          {hasPendingChanges() && (
            <>
              <Button 
                onClick={handleDiscardChanges} 
                size="sm" 
                variant="outline"
                disabled={isBulkUpdating}
              >
                Discard Changes
              </Button>
              <Button 
                onClick={() => setShowSaveConfirmationDialog(true)} 
                size="sm" 
                disabled={isBulkUpdating}
                className="bg-green-600 hover:bg-green-700"
              >
                <Save className="h-4 w-4 mr-2" />
                {isBulkUpdating ? 'Saving...' : 'Save All'}
              </Button>
            </>
          )}
          <Button onClick={() => setShowCreateDialog(true)} size="sm" disabled={isBulkUpdating}>
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
                  {readingDefinitions.map((definition) => {
                    const hasPendingUpdates = pendingChanges.updates.has(definition.id);
                    const isDeleted = pendingChanges.deletes.has(definition.id);
                    const isNew = definition.id.startsWith('temp-'); // Check if it's a temporary ID for new definitions
                    
                    return (
                      <DraggableReadingDefinitionRow
                        key={definition.id}
                        definition={definition}
                        onEdit={setEditingDefinition}
                        onDelete={handleDeleteDefinition}
                        hasPendingChanges={hasPendingUpdates}
                        isDeleted={isDeleted}
                        isNew={isNew}
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
      <CreateReadingDefinitionDialog
        open={showCreateDialog}
        onOpenChange={setShowCreateDialog}
        onSubmit={handleCreateDefinition}
        isLoading={isBulkUpdating}
      />

      {/* Edit Dialog */}
      <EditReadingDefinitionDialog
        open={!!editingDefinition}
        onOpenChange={() => setEditingDefinition(null)}
        readingDefinition={editingDefinition}
        onSubmit={handleUpdateDefinition}
        isLoading={isBulkUpdating}
      />

      {/* Save Confirmation Dialog */}
      <ConfirmActionDialog
        open={showSaveConfirmationDialog}
        onOpenChange={setShowSaveConfirmationDialog}
        title="Save Reading Definition Changes"
        description={`You are about to save changes to reading definitions. This action will update all open services scheduled from today onwards, expire all user sessions (users will need to log in again), and apply changes to ${pendingChanges.creates.length} new, ${pendingChanges.updates.size} modified, and ${pendingChanges.deletes.size} deleted definitions. This operation cannot be undone.`}
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
