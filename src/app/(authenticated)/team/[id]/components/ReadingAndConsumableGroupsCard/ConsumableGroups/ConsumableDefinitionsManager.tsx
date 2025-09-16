'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Plus, Edit, Trash2, GripVertical } from 'lucide-react';

import { LoadingSpinner } from '@/components/LoadingSpinner';
import { useGetConsumableDefinitions } from '@/hooks/react-query/consumable-definitions/useGetConsumableDefinitions';
import { useCreateConsumableDefinition } from '@/hooks/react-query/consumable-definitions/useCreateConsumableDefinition';
import { useUpdateConsumableDefinition } from '@/hooks/react-query/consumable-definitions/useUpdateConsumableDefinition';

import { ConsumableGroup, ConsumableDefinition, CreateConsumableDefinitionRequest, UpdateConsumableDefinitionRequest } from '@/ts/interfaces/ConsumableGroups';
import { CreateConsumableDefinitionDialog } from './CreateConsumableDefinitionDialog';
import { EditConsumableDefinitionDialog } from './EditConsumableDefinitionDialog';
import ConfirmActionDialog from '@/components/confirm-action-dialog';
import { useDeleteConsumableDefinition } from '@/hooks/react-query/consumable-definitions/useDeleteConsumableDefinition';

interface ConsumableDefinitionsManagerProps {
  consumableGroup: ConsumableGroup;
  companyId: string;
}

export function ConsumableDefinitionsManager({ consumableGroup, companyId }: ConsumableDefinitionsManagerProps) {
  const [editingDefinition, setEditingDefinition] = useState<ConsumableDefinition | null>(null);
  const [deletingDefinition, setDeletingDefinition] = useState<ConsumableDefinition | null>(null);
  const [showCreateDialog, setShowCreateDialog] = useState(false);

  const { data: consumableDefinitionsData, isLoading } = useGetConsumableDefinitions(consumableGroup.id);
  const { mutate: createConsumableDefinition, isPending: isCreating } = useCreateConsumableDefinition(companyId);
  const { mutate: updateConsumableDefinition, isPending: isUpdating } = useUpdateConsumableDefinition(companyId);
  const { mutate: deleteConsumableDefinition, isPending: isDeleting } = useDeleteConsumableDefinition(companyId);

  const consumableDefinitions = consumableDefinitionsData?.consumableDefinitions || [];

  const handleCreateDefinition = (data: CreateConsumableDefinitionRequest) => {
    createConsumableDefinition({ consumableGroupId: consumableGroup.id, data }, {
      onSuccess: () => {
        setShowCreateDialog(false);
      }
    });
  };

  const handleUpdateDefinition = (data: UpdateConsumableDefinitionRequest) => {
    if (editingDefinition) {
      updateConsumableDefinition({ consumableDefinitionId: editingDefinition.id, data }, {
        onSuccess: () => {
          setEditingDefinition(null);
        }
      });
    }
  };

  const handleDeleteDefinition = async () => {
    if (deletingDefinition) {
      deleteConsumableDefinition(deletingDefinition.id, {
        onSuccess: () => {
          setDeletingDefinition(null);
        }
      });
    }
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
        <Button onClick={() => setShowCreateDialog(true)} size="sm" disabled={isCreating}>
          <Plus className="h-4 w-4 mr-2" />
          Add Definition
        </Button>
      </div>

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
              {consumableDefinitions.map((definition) => (
                <TableRow key={definition.id}>
                  <TableCell>
                    <GripVertical className="h-4 w-4 text-muted-foreground" />
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
                        onClick={() => setEditingDefinition(definition)}
                        disabled={isUpdating}
                        className="h-8 w-8 p-0"
                      >
                        <Edit className="h-3 w-3" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setDeletingDefinition(definition)}
                        disabled={isDeleting}
                        className="h-8 w-8 p-0 text-destructive hover:text-destructive"
                      >
                        <Trash2 className="h-3 w-3" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Card>
      )}

      {/* Create Dialog */}
      <CreateConsumableDefinitionDialog
        open={showCreateDialog}
        onOpenChange={setShowCreateDialog}
        onSubmit={handleCreateDefinition}
        isLoading={isCreating}
      />

      {/* Edit Dialog */}
      <EditConsumableDefinitionDialog
        open={!!editingDefinition}
        onOpenChange={() => setEditingDefinition(null)}
        consumableDefinition={editingDefinition}
        onSubmit={handleUpdateDefinition}
        isLoading={isUpdating}
      />

      {/* Delete Confirmation */}
      <ConfirmActionDialog
        open={!!deletingDefinition}
        onOpenChange={() => setDeletingDefinition(null)}
        title="Delete Consumable Definition"
        description={`Are you sure you want to delete "${deletingDefinition?.name}"? This action cannot be undone.`}
        onConfirm={handleDeleteDefinition}
        variant="destructive"
      />
    </div>
  );
}
