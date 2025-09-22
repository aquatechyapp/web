'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Separator } from '@/components/ui/separator';
import { Plus, Edit, Trash2, Settings, GripVertical, Save, X } from 'lucide-react';
import { DndContext, closestCenter, KeyboardSensor, PointerSensor, useSensor, useSensors } from '@dnd-kit/core';
import { arrayMove, SortableContext, sortableKeyboardCoordinates, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

import { LoadingSpinner } from '@/components/LoadingSpinner';
import { useGetSelectorDefinitions } from '@/hooks/react-query/selector-definitions/useGetSelectorDefinitions';
import { useGetSelectorOptions } from '@/hooks/react-query/selector-options/useGetSelectorOptions';
import { useBatchUpdateSelectorGroup } from '@/hooks/react-query/selector-groups/useBatchUpdateSelectorGroup';

import { 
  SelectorGroup,
  SelectorDefinition, 
  SelectorOption, 
  CrudSelectorGroupRequest, 
  BatchSelectorDefinitionUpdate, 
  BatchSelectorDefinitionCreate,
  BatchSelectorOptionUpdate,
  BatchSelectorOptionCreate
} from '@/ts/interfaces/SelectorGroups';
import { CreateSelectorDefinitionDialog } from './CreateSelectorDefinitionDialog';
import { EditSelectorDefinitionDialog } from './EditSelectorDefinitionDialog';
import { CreateSelectorOptionDialog } from './CreateSelectorOptionDialog';
import { EditSelectorOptionDialog } from './EditSelectorOptionDialog';
import ConfirmActionDialog from '@/components/confirm-action-dialog';

// Draggable Selector Definition Row Component
interface DraggableSelectorDefinitionRowProps {
  definition: SelectorDefinition & { localOptions?: SelectorOption[] };
  onEdit: (definition: SelectorDefinition) => void;
  onDelete: (definition: SelectorDefinition) => void;
  onManageOptions: (definition: SelectorDefinition) => void;
  isUpdating: boolean;
  pendingChanges: PendingChanges;
}

interface PendingChanges {
  groupUpdates: {
    name?: string;
    description?: string;
    isActive?: boolean;
  };
  definitionUpdates: Map<string, Partial<SelectorDefinition>>;
  definitionDeletes: Set<string>;
  definitionCreates: BatchSelectorDefinitionCreate[];
  optionUpdates: Map<string, Partial<SelectorOption>>;
  optionDeletes: Set<string>;
  optionCreates: BatchSelectorOptionCreate[];
}

function DraggableSelectorDefinitionRow({ 
  definition, 
  onEdit, 
  onDelete, 
  onManageOptions, 
  isUpdating, 
  pendingChanges 
}: DraggableSelectorDefinitionRowProps) {
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
  } else if (pendingChanges.definitionUpdates.has(definition.id)) {
    rowClassName = 'bg-blue-50'; // Modified definition
  } else if (pendingChanges.definitionDeletes.has(definition.id)) {
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
            <div className="font-medium">{definition.question}</div>
            {definition.id.startsWith('temp-') && (
              <Badge variant="default" className="bg-green-600 text-white text-xs">
                New
              </Badge>
            )}
            {pendingChanges.definitionUpdates.has(definition.id) && !definition.id.startsWith('temp-') && (
              <Badge variant="default" className="bg-blue-600 text-white text-xs">
                Modified
              </Badge>
            )}
            {pendingChanges.definitionDeletes.has(definition.id) && (
              <Badge variant="destructive" className="text-xs">
                Deleted
              </Badge>
            )}
          </div>
          {definition.description && (
            <div className="text-sm text-muted-foreground mt-1">
              {definition.description}
            </div>
          )}
        </div>
      </TableCell>
      <TableCell>
        <Badge variant={definition.isRequired ? "default" : "secondary"} className="text-xs">
          {definition.isRequired ? "Required" : "Optional"}
        </Badge>
      </TableCell>
      <TableCell>
        <div className="text-sm text-muted-foreground">
          {definition.localOptions?.length || definition.options?.length || 0} options
        </div>
      </TableCell>
      <TableCell>
        <div className="flex items-center gap-1">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onManageOptions(definition)}
            disabled={isUpdating}
            className="h-8 w-8 p-0"
            title="Manage Options"
          >
            <Settings className="h-3 w-3" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onEdit(definition)}
            disabled={isUpdating}
            className="h-8 w-8 p-0"
            title="Edit Question"
          >
            <Edit className="h-3 w-3" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onDelete(definition)}
            disabled={isUpdating}
            className="h-8 w-8 p-0 text-destructive hover:text-destructive"
            title="Delete Question"
          >
            <Trash2 className="h-3 w-3" />
          </Button>
        </div>
      </TableCell>
    </TableRow>
  );
}

interface ComprehensiveSelectorGroupManagerProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  selectorGroup: SelectorGroup | null;
  companyId: string;
}

export function ComprehensiveSelectorGroupManager({ 
  open, 
  onOpenChange, 
  selectorGroup, 
  companyId 
}: ComprehensiveSelectorGroupManagerProps) {
  const [editingDefinition, setEditingDefinition] = useState<SelectorDefinition | null>(null);
  const [managingOptionsForDefinition, setManagingOptionsForDefinition] = useState<SelectorDefinition | null>(null);
  const [editingOption, setEditingOption] = useState<SelectorOption | null>(null);
  const [showCreateDefinitionDialog, setShowCreateDefinitionDialog] = useState(false);
  const [showCreateOptionDialog, setShowCreateOptionDialog] = useState(false);
  const [showSaveConfirmationDialog, setShowSaveConfirmationDialog] = useState(false);
  const [showDeleteConfirmationDialog, setShowDeleteConfirmationDialog] = useState(false);
  
  const [localDefinitions, setLocalDefinitions] = useState<(SelectorDefinition & { localOptions?: SelectorOption[] })[]>([]);
  const [localGroup, setLocalGroup] = useState<SelectorGroup | null>(null);
  
  const [pendingChanges, setPendingChanges] = useState<PendingChanges>({
    groupUpdates: {},
    definitionUpdates: new Map(),
    definitionDeletes: new Set(),
    definitionCreates: [],
    optionUpdates: new Map(),
    optionDeletes: new Set(),
    optionCreates: []
  });

  const { data: definitionsData, isLoading: definitionsLoading } = useGetSelectorDefinitions(selectorGroup?.id || '');
  const { mutate: batchUpdateSelectorGroup, isPending: isBulkUpdating } = useBatchUpdateSelectorGroup(companyId);

  // Initialize local state when data loads or dialog opens
  useEffect(() => {
    if (open && selectorGroup) {
      setLocalGroup(selectorGroup);
      if (definitionsData?.selectorDefinitions) {
        const sortedDefinitions = [...definitionsData.selectorDefinitions].sort((a, b) => a.order - b.order);
        setLocalDefinitions(sortedDefinitions);
      }
    }
  }, [open, selectorGroup, definitionsData]);

  // Reset state when dialog closes
  useEffect(() => {
    if (!open) {
      setLocalDefinitions([]);
      setLocalGroup(null);
      setManagingOptionsForDefinition(null);
      setPendingChanges({
        groupUpdates: {},
        definitionUpdates: new Map(),
        definitionDeletes: new Set(),
        definitionCreates: [],
        optionUpdates: new Map(),
        optionDeletes: new Set(),
        optionCreates: []
      });
    }
  }, [open]);

  // Drag and drop sensors
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleGroupUpdate = (field: string, value: any) => {
    if (localGroup) {
      setLocalGroup(prev => prev ? { ...prev, [field]: value } : null);
      setPendingChanges(prev => ({
        ...prev,
        groupUpdates: { ...prev.groupUpdates, [field]: value }
      }));
    }
  };

  const handleCreateDefinition = (data: any) => {
    // Check if a definition with the same question already exists in creates
    const existingCreate = pendingChanges.definitionCreates.find(create => 
      create.question === data.question
    );
    
    if (existingCreate) {
      return; // Prevent duplicate creation
    }

    const tempId = `temp-${Date.now()}`;
    const newDefinition: BatchSelectorDefinitionCreate = {
      question: data.question,
      description: data.description,
      isRequired: data.isRequired,
      order: localDefinitions.length + pendingChanges.definitionCreates.length,
      tempId: tempId
    };

    // Add to pending creates
    setPendingChanges(prev => ({
      ...prev,
      definitionCreates: [...prev.definitionCreates, newDefinition]
    }));

    // Add to local state with temporary ID for UI
    const tempDefinition: SelectorDefinition & { localOptions?: SelectorOption[] } = {
      id: tempId,
      question: data.question,
      description: data.description,
      isRequired: data.isRequired,
      order: localDefinitions.length + pendingChanges.definitionCreates.length,
      selectorGroupId: selectorGroup?.id || '',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      options: [],
      localOptions: []
    };

    setLocalDefinitions(prev => [...prev, tempDefinition]);
    setShowCreateDefinitionDialog(false);
  };

  const handleUpdateDefinition = (data: any) => {
    if (editingDefinition) {
      // Don't update temporary definitions in pending changes
      if (editingDefinition.id.startsWith('temp-')) {
        // Update the create in pending changes
        setPendingChanges(prev => ({
          ...prev,
          definitionCreates: prev.definitionCreates.map(create => 
            create.question === editingDefinition.question
              ? { ...create, ...data }
              : create
          )
        }));
      } else {
        // Update existing definition in pending changes
        setPendingChanges(prev => {
          const updates = new Map(prev.definitionUpdates);
          const existingUpdate = updates.get(editingDefinition.id) || {};
          updates.set(editingDefinition.id, { ...existingUpdate, ...data });
          return { ...prev, definitionUpdates: updates };
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

  const handleDeleteDefinition = (definition: SelectorDefinition) => {
    // Don't delete temporary (new) definitions - just remove them from creates and local state
    if (definition.id.startsWith('temp-')) {
      // Remove from pending creates
      setPendingChanges(prev => ({
        ...prev,
        definitionCreates: prev.definitionCreates.filter(create =>
          create.question !== definition.question
        )
      }));
    } else {
      // Add real definitions to pending deletes
      setPendingChanges(prev => ({
        ...prev,
        definitionDeletes: new Set(prev.definitionDeletes).add(definition.id)
      }));
    }

    // Remove from local state immediately for UI feedback
    setLocalDefinitions(prev =>
      prev.filter(def => def.id !== definition.id)
    );
  };

  const handleCreateOption = (data: any) => {
    if (!managingOptionsForDefinition) return;

    // Check if an option with the same text already exists in creates
    const existingCreate = pendingChanges.optionCreates.find(create => 
      create.text === data.text && create.selectorDefinitionId === managingOptionsForDefinition.id
    );
    
    if (existingCreate) {
      return; // Prevent duplicate creation
    }

    const currentOptions = (managingOptionsForDefinition as any).localOptions || managingOptionsForDefinition.options || [];
    
    // Use the temporary ID if this is a new definition, otherwise use the real ID
    const definitionId = managingOptionsForDefinition.id.startsWith('temp-') 
      ? managingOptionsForDefinition.id 
      : managingOptionsForDefinition.id;

    const newOption: BatchSelectorOptionCreate = {
      selectorDefinitionId: definitionId,
      text: data.text,
      value: data.value,
      order: currentOptions.length + pendingChanges.optionCreates.filter(c => c.selectorDefinitionId === definitionId).length
    };

    // Add to pending creates
    setPendingChanges(prev => ({
      ...prev,
      optionCreates: [...prev.optionCreates, newOption]
    }));

    // Add to local state with temporary ID for UI
    const tempOption: SelectorOption = {
      id: `temp-option-${Date.now()}`,
      text: data.text,
      value: data.value,
      order: currentOptions.length,
      selectorDefinitionId: managingOptionsForDefinition.id,
      createdAt: new Date().toISOString()
    };

    // Update the local definition's options
    setLocalDefinitions(prev =>
      prev.map(def =>
        def.id === managingOptionsForDefinition.id
          ? { 
              ...def, 
              localOptions: [...(def.localOptions || def.options || []), tempOption]
            }
          : def
      )
    );

    setShowCreateOptionDialog(false);
  };

  const handleUpdateOption = (data: any) => {
    if (editingOption && managingOptionsForDefinition) {
      // Don't update temporary options in pending changes
      if (editingOption.id.startsWith('temp-option-')) {
        // Update the create in pending changes
        setPendingChanges(prev => ({
          ...prev,
          optionCreates: prev.optionCreates.map(create => 
            create.text === editingOption.text && create.selectorDefinitionId === managingOptionsForDefinition.id
              ? { ...create, ...data }
              : create
          )
        }));
      } else {
        // Update existing option in pending changes
        setPendingChanges(prev => {
          const updates = new Map(prev.optionUpdates);
          const existingUpdate = updates.get(editingOption.id) || {};
          updates.set(editingOption.id, { ...existingUpdate, ...data });
          return { ...prev, optionUpdates: updates };
        });
      }

      // Update local state
      setLocalDefinitions(prev =>
        prev.map(def =>
          def.id === managingOptionsForDefinition.id
            ? {
                ...def,
                localOptions: (def.localOptions || def.options || []).map(opt =>
                  opt.id === editingOption.id ? { ...opt, ...data } : opt
                )
              }
            : def
        )
      );

      setEditingOption(null);
    }
  };

  const handleDeleteOption = (option: SelectorOption) => {
    if (!managingOptionsForDefinition) return;

    // Don't delete temporary (new) options - just remove them from creates and local state
    if (option.id.startsWith('temp-option-')) {
      // Remove from pending creates
      setPendingChanges(prev => ({
        ...prev,
        optionCreates: prev.optionCreates.filter(create =>
          !(create.text === option.text && create.selectorDefinitionId === managingOptionsForDefinition.id)
        )
      }));
    } else {
      // Add real options to pending deletes
      setPendingChanges(prev => ({
        ...prev,
        optionDeletes: new Set(prev.optionDeletes).add(option.id)
      }));
    }

    // Remove from local state immediately for UI feedback
    setLocalDefinitions(prev =>
      prev.map(def =>
        def.id === managingOptionsForDefinition.id
          ? {
              ...def,
              localOptions: (def.localOptions || def.options || []).filter(opt => opt.id !== option.id)
            }
          : def
      )
    );
  };

  const handleDragEnd = (event: any) => {
    const { active, over } = event;

    if (active.id !== over.id) {
      const oldIndex = localDefinitions.findIndex(item => item.id === active.id);
      const newIndex = localDefinitions.findIndex(item => item.id === over.id);

      if (oldIndex !== -1 && newIndex !== -1) {
        const newDefinitions = arrayMove(localDefinitions, oldIndex, newIndex);
        
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
              definitionCreates: prev.definitionCreates.map(create => 
                create.question === def.question
                  ? { ...create, order: index }
                  : create
              )
            }));
          } else {
            // Add to updates map
            setPendingChanges(prev => {
              const updates = new Map(prev.definitionUpdates);
              const existingUpdate = updates.get(def.id) || {};
              updates.set(def.id, { ...existingUpdate, order: index });
              return { ...prev, definitionUpdates: updates };
            });
          }
        });
      }
    }
  };

  const hasPendingChanges = () => {
    return Object.keys(pendingChanges.groupUpdates).length > 0 ||
           pendingChanges.definitionUpdates.size > 0 || 
           pendingChanges.definitionDeletes.size > 0 || 
           pendingChanges.definitionCreates.length > 0 ||
           pendingChanges.optionUpdates.size > 0 ||
           pendingChanges.optionDeletes.size > 0 ||
           pendingChanges.optionCreates.length > 0;
  };

  const handleSaveAllChanges = () => {
    if (hasPendingChanges() && selectorGroup) {
      const batchData: CrudSelectorGroupRequest = {
        selectorDefinitionsUpdates: [],
        selectorDefinitionsCreates: [],
        selectorDefinitionsDeletes: [],
        selectorOptionsUpdates: [],
        selectorOptionsCreates: [],
        selectorOptionsDeletes: []
      };

      // Add group updates
      if (Object.keys(pendingChanges.groupUpdates).length > 0) {
        Object.assign(batchData, pendingChanges.groupUpdates);
      }

      // Add definition updates
      Array.from(pendingChanges.definitionUpdates.entries()).forEach(([definitionId, update]) => {
        batchData.selectorDefinitionsUpdates!.push({
          selectorDefinitionId: definitionId,
          ...update
        });
      });

      // Add definition creates
      if (pendingChanges.definitionCreates.length > 0) {
        batchData.selectorDefinitionsCreates = pendingChanges.definitionCreates;
      }

      // Add definition deletes
      if (pendingChanges.definitionDeletes.size > 0) {
        batchData.selectorDefinitionsDeletes = Array.from(pendingChanges.definitionDeletes);
      }

      // Add option updates
      Array.from(pendingChanges.optionUpdates.entries()).forEach(([optionId, update]) => {
        batchData.selectorOptionsUpdates!.push({
          selectorOptionId: optionId,
          ...update
        });
      });

      // Add option creates
      if (pendingChanges.optionCreates.length > 0) {
        batchData.selectorOptionsCreates = pendingChanges.optionCreates;
      }

      // Add option deletes
      if (pendingChanges.optionDeletes.size > 0) {
        batchData.selectorOptionsDeletes = Array.from(pendingChanges.optionDeletes);
      }

      // Remove empty arrays to clean up the request
      Object.keys(batchData).forEach(key => {
        const value = batchData[key as keyof CrudSelectorGroupRequest];
        if (Array.isArray(value) && value.length === 0) {
          delete batchData[key as keyof CrudSelectorGroupRequest];
        }
      });

      batchUpdateSelectorGroup({
        selectorGroupId: selectorGroup.id,
        data: batchData
      }, {
        onSuccess: () => {
          setPendingChanges({
            groupUpdates: {},
            definitionUpdates: new Map(),
            definitionDeletes: new Set(),
            definitionCreates: [],
            optionUpdates: new Map(),
            optionDeletes: new Set(),
            optionCreates: []
          });
          onOpenChange(false);
        }
      });
    }
  };

  const handleDiscardChanges = () => {
    // Reset local state to original data
    if (selectorGroup) {
      setLocalGroup(selectorGroup);
    }
    if (definitionsData?.selectorDefinitions) {
      const sortedDefinitions = [...definitionsData.selectorDefinitions].sort((a, b) => a.order - b.order);
      setLocalDefinitions(sortedDefinitions);
    }
    
    // Clear pending changes
    setPendingChanges({
      groupUpdates: {},
      definitionUpdates: new Map(),
      definitionDeletes: new Set(),
      definitionCreates: [],
      optionUpdates: new Map(),
      optionDeletes: new Set(),
      optionCreates: []
    });
  };

  const handleDeleteGroup = () => {
    if (selectorGroup) {
      const batchData: CrudSelectorGroupRequest = {
        deleteGroup: true
      };

      batchUpdateSelectorGroup({
        selectorGroupId: selectorGroup.id,
        data: batchData
      }, {
        onSuccess: () => {
          onOpenChange(false);
        }
      });
    }
  };

  if (!selectorGroup || !localGroup) {
    return null;
  }

  const managingDefinitionOptions = managingOptionsForDefinition 
    ? localDefinitions.find(d => d.id === managingOptionsForDefinition.id)?.localOptions || 
      localDefinitions.find(d => d.id === managingOptionsForDefinition.id)?.options || []
    : [];

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[900px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Manage Selector Group</DialogTitle>
          <DialogDescription>
            Update group settings, questions, and answer options all in one place
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Group Settings */}
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <CardTitle className="text-lg">Group Settings</CardTitle>
                <Button
                  onClick={() => setShowDeleteConfirmationDialog(true)}
                  variant="destructive"
                  size="sm"
                  disabled={isBulkUpdating}
                >
                  <Trash2 className="h-4 w-4 mr-2" />
                  Delete Group
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="groupName">Name</Label>
                <Input
                  id="groupName"
                  value={localGroup.name}
                  onChange={(e) => handleGroupUpdate('name', e.target.value)}
                  disabled={isBulkUpdating}
                />
              </div>
              <div>
                <Label htmlFor="groupDescription">Description</Label>
                <Textarea
                  id="groupDescription"
                  value={localGroup.description || ''}
                  onChange={(e) => handleGroupUpdate('description', e.target.value)}
                  disabled={isBulkUpdating}
                  rows={2}
                />
              </div>
            </CardContent>
          </Card>

          <Separator />

          {/* Pending Changes Summary */}
          {hasPendingChanges() && (
            <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium text-amber-800">
                    Pending Changes:
                  </span>
                  <span className="text-sm text-amber-700">
                    {Object.keys(pendingChanges.groupUpdates).length > 0 ? '1 group, ' : ''}{pendingChanges.definitionCreates.length + pendingChanges.optionCreates.length} new, {pendingChanges.definitionUpdates.size + pendingChanges.optionUpdates.size} modified, {pendingChanges.definitionDeletes.size + pendingChanges.optionDeletes.size} deleted
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

          {/* Definitions Management */}
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <div>
                  <CardTitle className="text-lg">Questions & Options</CardTitle>
                  <p className="text-sm text-muted-foreground mt-1">
                    Manage questions and their multiple choice options
                  </p>
                </div>
                <Button onClick={() => setShowCreateDefinitionDialog(true)} disabled={isBulkUpdating} size="sm">
                  <Plus className="h-4 w-4 mr-2" />
                  Add Question
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              {definitionsLoading ? (
                <LoadingSpinner />
              ) : localDefinitions.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  <div className="text-sm mb-2">No questions</div>
                  <p className="text-xs">Create questions with multiple choice answers for this selector group.</p>
                </div>
              ) : (
                <DndContext
                  sensors={sensors}
                  collisionDetection={closestCenter}
                  onDragEnd={handleDragEnd}
                >
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="w-8"></TableHead>
                        <TableHead>Question</TableHead>
                        <TableHead>Required</TableHead>
                        <TableHead>Options</TableHead>
                        <TableHead className="w-32">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      <SortableContext
                        items={localDefinitions.map(def => def.id)}
                        strategy={verticalListSortingStrategy}
                      >
                        {localDefinitions.map((definition) => (
                          <DraggableSelectorDefinitionRow
                            key={definition.id}
                            definition={definition}
                            onEdit={setEditingDefinition}
                            onDelete={handleDeleteDefinition}
                            onManageOptions={setManagingOptionsForDefinition}
                            isUpdating={isBulkUpdating}
                            pendingChanges={pendingChanges}
                          />
                        ))}
                      </SortableContext>
                    </TableBody>
                  </Table>
                </DndContext>
              )}
            </CardContent>
          </Card>

          {/* Options Management for Selected Definition */}
          {managingOptionsForDefinition && (
            <Card>
              <CardHeader>
                <div className="flex justify-between items-center">
                  <div>
                    <CardTitle className="text-lg">Options for: "{managingOptionsForDefinition?.question}"</CardTitle>
                    <p className="text-sm text-muted-foreground mt-1">
                      Manage multiple choice options for this question
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <Button onClick={() => setShowCreateOptionDialog(true)} disabled={isBulkUpdating} size="sm">
                      <Plus className="h-4 w-4 mr-2" />
                      Add Option
                    </Button>
                    <Button onClick={() => setManagingOptionsForDefinition(null)} variant="outline" size="sm">
                      <X className="h-4 w-4 mr-2" />
                      Close
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                {managingDefinitionOptions.length === 0 ? (
                  <div className="text-center py-4 text-muted-foreground">
                    <div className="text-sm mb-2">No options available</div>
                    <p className="text-xs">Add multiple choice options for this question</p>
                  </div>
                ) : (
                  <div className="space-y-2">
                    {managingDefinitionOptions.map((option) => (
                      <div key={option.id} className={`flex items-center justify-between p-3 border rounded-lg ${
                        option.id.startsWith('temp-option-') ? 'bg-green-50' :
                        pendingChanges.optionUpdates.has(option.id) ? 'bg-blue-50' :
                        pendingChanges.optionDeletes.has(option.id) ? 'bg-red-50' : ''
                      }`}>
                        <div className="flex items-center gap-2">
                          <span className="font-medium">{option.text}</span>
                          <span className="text-sm text-muted-foreground">({option.value})</span>
                          {option.id.startsWith('temp-option-') && (
                            <Badge variant="default" className="bg-green-600 text-white text-xs">
                              New
                            </Badge>
                          )}
                          {pendingChanges.optionUpdates.has(option.id) && !option.id.startsWith('temp-option-') && (
                            <Badge variant="default" className="bg-blue-600 text-white text-xs">
                              Modified
                            </Badge>
                          )}
                          {pendingChanges.optionDeletes.has(option.id) && (
                            <Badge variant="destructive" className="text-xs">
                              Deleted
                            </Badge>
                          )}
                        </div>
                        <div className="flex gap-1">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => setEditingOption(option)}
                            disabled={isBulkUpdating}
                            className="h-8 w-8 p-0"
                          >
                            <Edit className="h-3 w-3" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleDeleteOption(option)}
                            disabled={isBulkUpdating}
                            className="h-8 w-8 p-0 text-destructive hover:text-destructive"
                          >
                            <Trash2 className="h-3 w-3" />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          )}
        </div>

        {/* Create Definition Dialog */}
        <CreateSelectorDefinitionDialog
          open={showCreateDefinitionDialog}
          onOpenChange={setShowCreateDefinitionDialog}
          onSubmit={handleCreateDefinition}
          isLoading={isBulkUpdating}
          selectorGroupName={localGroup.name}
        />

        {/* Edit Definition Dialog */}
        <EditSelectorDefinitionDialog
          open={!!editingDefinition}
          onOpenChange={() => setEditingDefinition(null)}
          selectorDefinition={editingDefinition}
          onSubmit={handleUpdateDefinition}
          isLoading={isBulkUpdating}
          selectorGroupName={localGroup.name}
        />

        {/* Create Option Dialog */}
        <CreateSelectorOptionDialog
          open={showCreateOptionDialog}
          onOpenChange={setShowCreateOptionDialog}
          onSubmit={handleCreateOption}
          isLoading={isBulkUpdating}
          selectorDefinition={managingOptionsForDefinition!}
          existingOptions={managingDefinitionOptions}
        />

        {/* Edit Option Dialog */}
        <EditSelectorOptionDialog
          open={!!editingOption}
          onOpenChange={() => setEditingOption(null)}
          selectorOption={editingOption}
          onSubmit={handleUpdateOption}
          isLoading={isBulkUpdating}
          selectorDefinition={managingOptionsForDefinition!}
        />

        {/* Save Confirmation Dialog */}
        <ConfirmActionDialog
          open={showSaveConfirmationDialog}
          onOpenChange={setShowSaveConfirmationDialog}
          title="Save All Changes"
          description={`You are about to save all changes to this selector group. This action will update all open services scheduled from today onwards, expire all user sessions (users will need to log in again), and apply ${Object.keys(pendingChanges.groupUpdates).length > 0 ? '1 group update, ' : ''}${pendingChanges.definitionCreates.length + pendingChanges.optionCreates.length} new items, ${pendingChanges.definitionUpdates.size + pendingChanges.optionUpdates.size} modifications, and ${pendingChanges.definitionDeletes.size + pendingChanges.optionDeletes.size} deletions. This operation cannot be undone.`}
          onConfirm={async () => {
            setShowSaveConfirmationDialog(false);
            handleSaveAllChanges();
          }}
          confirmText="Save All Changes"
          variant="default"
        />

        {/* Delete Group Confirmation Dialog */}
        <ConfirmActionDialog
          open={showDeleteConfirmationDialog}
          onOpenChange={setShowDeleteConfirmationDialog}
          title="Delete Selector Group"
          description={`Are you sure you want to delete "${localGroup?.name}"? This action will permanently delete the entire selector group including all questions and options. This will update all open services scheduled from today onwards, expire all user sessions (users will need to log in again), and cannot be undone.`}
          onConfirm={async () => {
            setShowDeleteConfirmationDialog(false);
            handleDeleteGroup();
          }}
          confirmText="Delete Group"
          variant="destructive"
        />
      </DialogContent>
    </Dialog>
  );
}
