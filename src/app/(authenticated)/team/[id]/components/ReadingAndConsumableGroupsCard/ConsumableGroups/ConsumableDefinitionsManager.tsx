'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Plus, Edit, Trash2, GripVertical, Save } from 'lucide-react';
import { DndContext, closestCenter, KeyboardSensor, PointerSensor, useSensor, useSensors } from '@dnd-kit/core';
import { arrayMove, SortableContext, sortableKeyboardCoordinates, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

import { LoadingSpinner } from '@/components/LoadingSpinner';
import { useGetConsumableDefinitions } from '@/hooks/react-query/consumable-definitions/useGetConsumableDefinitions';
import { useBatchUpdateConsumableGroup } from '@/hooks/react-query/consumable-groups/useBatchUpdateConsumableGroup';

import { ConsumableGroup, ConsumableDefinition, CrudConsumableGroupRequest, BatchConsumableDefinitionUpdate, BatchConsumableDefinitionCreate } from '@/ts/interfaces/ConsumableGroups';
import { CreateConsumableDefinitionDialog } from './CreateConsumableDefinitionDialog';
import { EditConsumableDefinitionDialog } from './EditConsumableDefinitionDialog';
import ConfirmActionDialog from '@/components/confirm-action-dialog';

// Draggable Consumable Definition Row Component
interface DraggableConsumableDefinitionRowProps {
  definition: ConsumableDefinition;
  onEdit: (definition: ConsumableDefinition) => void;
  onDelete: (definition: ConsumableDefinition) => void;
  isUpdating: boolean;
  pendingChanges: {
    updates: Map<string, Partial<ConsumableDefinition>>;
    deletes: Set<string>;
    creates: BatchConsumableDefinitionCreate[];
  };
}

function DraggableConsumableDefinitionRow({ definition, onEdit, onDelete, isUpdating, pendingChanges }: DraggableConsumableDefinitionRowProps) {
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
        {definition.pricePerUnit !== undefined ? (
          <span className="text-sm">${definition.pricePerUnit.toFixed(2)}</span>
        ) : (
          <span className="text-sm text-muted-foreground">No price</span>
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

interface ConsumableDefinitionsManagerProps {
  consumableGroup: ConsumableGroup;
  companyId: string;
}

export function ConsumableDefinitionsManager({ consumableGroup, companyId }: ConsumableDefinitionsManagerProps) {
  const [editingDefinition, setEditingDefinition] = useState<ConsumableDefinition | null>(null);
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [showSaveConfirmationDialog, setShowSaveConfirmationDialog] = useState(false);
  const [localDefinitions, setLocalDefinitions] = useState<ConsumableDefinition[]>([]);
  const [pendingChanges, setPendingChanges] = useState<{
    updates: Map<string, Partial<ConsumableDefinition>>;
    deletes: Set<string>;
    creates: BatchConsumableDefinitionCreate[];
  }>({
    updates: new Map(),
    deletes: new Set(),
    creates: []
  });

  const { data: consumableDefinitionsData, isLoading } = useGetConsumableDefinitions(consumableGroup.id);
  const { mutate: batchUpdateConsumableGroup, isPending: isBulkUpdating } = useBatchUpdateConsumableGroup(companyId);

  const consumableDefinitions = localDefinitions.length > 0 ? localDefinitions : (consumableDefinitionsData?.consumableDefinitions || []);

  // Initialize local definitions when data loads
  useEffect(() => {
    if (consumableDefinitionsData?.consumableDefinitions) {
      setLocalDefinitions(consumableDefinitionsData.consumableDefinitions);
    }
  }, [consumableDefinitionsData]);

  // Drag and drop sensors
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleCreateDefinition = (data: any) => {
    // Check if a definition with the same name and unit already exists in creates
    const existingCreate = pendingChanges.creates.find(create => 
      create.name === data.name && create.unit === data.unit
    );
    
    if (existingCreate) {
      return; // Prevent duplicate creation
    }

    const newDefinition: BatchConsumableDefinitionCreate = {
      name: data.name,
      unit: data.unit,
      minValue: data.minValue,
      maxValue: data.maxValue,
      pricePerUnit: data.pricePerUnit,
      step: data.step,
      isRequired: data.isRequired,
      description: data.description,
      order: consumableDefinitions.length + pendingChanges.creates.length
    };

    // Add to pending creates
    setPendingChanges(prev => ({
      ...prev,
      creates: [...prev.creates, newDefinition]
    }));

    // Add to local state with temporary ID for UI
    const tempDefinition: ConsumableDefinition = {
      id: `temp-${Date.now()}`,
      name: data.name,
      unit: data.unit,
      minValue: data.minValue,
      maxValue: data.maxValue,
      pricePerUnit: data.pricePerUnit,
      step: data.step,
      isRequired: data.isRequired,
      description: data.description,
      order: consumableDefinitions.length + pendingChanges.creates.length,
      consumableGroupId: consumableGroup.id,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    setLocalDefinitions(prev => [...prev, tempDefinition]);
    setShowCreateDialog(false);
  };

  const handleUpdateDefinition = (data: any) => {
    if (editingDefinition) {
      // Don't update temporary definitions in pending changes
      if (editingDefinition.id.startsWith('temp-')) {
        // Update the create in pending changes
        setPendingChanges(prev => ({
          ...prev,
          creates: prev.creates.map(create => 
            create.name === editingDefinition.name && create.unit === editingDefinition.unit
              ? { ...create, ...data }
              : create
          )
        }));
      } else {
        // Update existing definition in pending changes
        setPendingChanges(prev => {
          const updates = new Map(prev.updates);
          const existingUpdate = updates.get(editingDefinition.id) || {};
          updates.set(editingDefinition.id, { ...existingUpdate, ...data });
          return { ...prev, updates };
        });
      }

      // Update local state
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

  const handleDeleteDefinition = (definition: ConsumableDefinition) => {
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

  const handleDragEnd = (event: any) => {
    const { active, over } = event;

    if (active.id !== over.id) {
      const oldIndex = consumableDefinitions.findIndex(item => item.id === active.id);
      const newIndex = consumableDefinitions.findIndex(item => item.id === over.id);

      if (oldIndex !== -1 && newIndex !== -1) {
        const newDefinitions = arrayMove(consumableDefinitions, oldIndex, newIndex);
        
        // Update order for each definition
        const updatedDefinitions = newDefinitions.map((def, index) => ({
          ...def,
          order: index
        }));

        setLocalDefinitions(updatedDefinitions);

        // Update pending changes
        updatedDefinitions.forEach((def, index) => {
          if (def.id.startsWith('temp-')) {
            // Update order in creates array
            setPendingChanges(prev => ({
              ...prev,
              creates: prev.creates.map(create => 
                create.name === def.name && create.unit === def.unit
                  ? { ...create, order: index }
                  : create
              )
            }));
          } else {
            // Add to updates map
            setPendingChanges(prev => {
              const updates = new Map(prev.updates);
              const existingUpdate = updates.get(def.id) || {};
              updates.set(def.id, { ...existingUpdate, order: index });
              return { ...prev, updates };
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
    if (hasPendingChanges()) {
      const batchData: CrudConsumableGroupRequest = {
        consumableDefinitionsUpdates: [],
        consumableDefinitionsCreates: [],
        consumableDefinitionsDeletes: []
      };

      // Add all updates (including order changes)
      pendingChanges.updates.forEach((update, definitionId) => {
        batchData.consumableDefinitionsUpdates!.push({
          consumableDefinitionId: definitionId,
          ...update
        });
      });

      // Smart optimization: Check for add/delete conflicts
      const optimizedCreates: BatchConsumableDefinitionCreate[] = [];
      const optimizedDeletes: string[] = [];

      // Process creates and deletes with smart optimization
      pendingChanges.creates.forEach((create) => {
        // Check if this create conflicts with any delete
        const conflictingDelete = Array.from(pendingChanges.deletes).find(deleteId => {
          // For new definitions, we can't have exact conflicts since they don't have real IDs yet
          // But we can check for similar definitions (same name/unit) being deleted
          const deletedDefinition = consumableDefinitionsData?.consumableDefinitions?.find(def => def.id === deleteId);
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
          const deletedDefinition = consumableDefinitionsData?.consumableDefinitions?.find(def => def.id === deleteId);
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
        batchData.consumableDefinitionsCreates = optimizedCreates;
      }
      if (optimizedDeletes.length > 0) {
        batchData.consumableDefinitionsDeletes = optimizedDeletes;
      }

      // Remove empty arrays to clean up the request
      if (batchData.consumableDefinitionsUpdates && batchData.consumableDefinitionsUpdates.length === 0) {
        delete batchData.consumableDefinitionsUpdates;
      }
      if (batchData.consumableDefinitionsCreates && batchData.consumableDefinitionsCreates.length === 0) {
        delete batchData.consumableDefinitionsCreates;
      }
      if (batchData.consumableDefinitionsDeletes && batchData.consumableDefinitionsDeletes.length === 0) {
        delete batchData.consumableDefinitionsDeletes;
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

      batchUpdateConsumableGroup({
        consumableGroupId: consumableGroup.id,
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
    // Reset local state to original data
    if (consumableDefinitionsData?.consumableDefinitions) {
      setLocalDefinitions(consumableDefinitionsData.consumableDefinitions);
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
      <div className="flex justify-between items-center">
        <div>
          <h4 className="text-md font-semibold">Consumable Definitions</h4>
          <p className="text-sm text-muted-foreground">
            Manage the specific consumables that can be recorded for this group
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
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium text-amber-800">
                Pending Changes:
              </span>
              <span className="text-sm text-amber-700">
                {pendingChanges.creates.length} new, {pendingChanges.updates.size} modified, {pendingChanges.deletes.size} deleted
              </span>
            </div>
            <div className="flex gap-2">
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
            </div>
          </div>
        </div>
      )}

      {consumableDefinitions.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-6">
            <div className="text-muted-foreground mb-2">No consumable definitions</div>
            <p className="text-sm text-muted-foreground text-center mb-4">
              Create consumable definitions to specify what consumables can be recorded for this group.
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
                  <TableHead>Price/Unit</TableHead>
                  <TableHead>Required</TableHead>
                  <TableHead className="w-20">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                <SortableContext
                  items={consumableDefinitions.map(def => def.id)}
                  strategy={verticalListSortingStrategy}
                >
                  {consumableDefinitions.map((definition) => {
                    return (
                      <DraggableConsumableDefinitionRow
                        key={definition.id}
                        definition={definition}
                        onEdit={setEditingDefinition}
                        onDelete={handleDeleteDefinition}
                        isUpdating={isBulkUpdating}
                        pendingChanges={pendingChanges}
                      />
                    );
                  })}
                </SortableContext>
              </TableBody>
            </Table>
          </DndContext>
        </Card>
      )}

      {/* Create Dialog */}
      <CreateConsumableDefinitionDialog
        open={showCreateDialog}
        onOpenChange={setShowCreateDialog}
        onSubmit={handleCreateDefinition}
        isLoading={isBulkUpdating}
      />

      {/* Edit Dialog */}
      <EditConsumableDefinitionDialog
        open={!!editingDefinition}
        onOpenChange={() => setEditingDefinition(null)}
        consumableDefinition={editingDefinition}
        onSubmit={handleUpdateDefinition}
        isLoading={isBulkUpdating}
      />

      {/* Save Confirmation Dialog */}
      <ConfirmActionDialog
        open={showSaveConfirmationDialog}
        onOpenChange={setShowSaveConfirmationDialog}
        title="Save Consumable Definition Changes"
        description={`You are about to save changes to consumable definitions. This action will update all open services scheduled from today onwards, expire all user sessions (users will need to log in again), and apply changes to ${pendingChanges.creates.length} new, ${pendingChanges.updates.size} modified, and ${pendingChanges.deletes.size} deleted definitions. This operation cannot be undone.`}
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
