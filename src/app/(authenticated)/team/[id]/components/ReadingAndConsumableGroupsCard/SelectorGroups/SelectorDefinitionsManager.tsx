'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Plus, Edit, Trash2, Settings } from 'lucide-react';

import { LoadingSpinner } from '@/components/LoadingSpinner';
import { useGetSelectorDefinitions } from '@/hooks/react-query/selector-definitions/useGetSelectorDefinitions';
import { useCreateSelectorDefinition } from '@/hooks/react-query/selector-definitions/useCreateSelectorDefinition';
import { useUpdateSelectorDefinition } from '@/hooks/react-query/selector-definitions/useUpdateSelectorDefinition';
import { useDeleteSelectorDefinition } from '@/hooks/react-query/selector-definitions/useDeleteSelectorDefinition';

import { SelectorDefinition, CreateSelectorDefinitionRequest, UpdateSelectorDefinitionRequest } from '@/ts/interfaces/SelectorGroups';

import ConfirmActionDialog from '@/components/confirm-action-dialog';
import { CreateSelectorDefinitionDialog } from './CreateSelectorDefinitionDialog';
import { EditSelectorDefinitionDialog } from './EditSelectorDefinitionDialog';
import { SelectorOptionsManager } from './SelectorOptionsManager';

interface SelectorDefinitionsManagerProps {
  selectorGroupId: string;
  selectorGroupName: string;
  companyId: string;
}

export function SelectorDefinitionsManager({ selectorGroupId, selectorGroupName, companyId }: SelectorDefinitionsManagerProps) {
  const [editingDefinition, setEditingDefinition] = useState<SelectorDefinition | null>(null);
  const [deletingDefinition, setDeletingDefinition] = useState<SelectorDefinition | null>(null);
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [managingOptionsForDefinition, setManagingOptionsForDefinition] = useState<SelectorDefinition | null>(null);

  const { data: definitionsData, isLoading } = useGetSelectorDefinitions(selectorGroupId);
  const { mutate: createDefinition, isPending: isCreating } = useCreateSelectorDefinition();
  const { mutate: updateDefinition, isPending: isUpdating } = useUpdateSelectorDefinition();
  const { mutate: deleteDefinition, isPending: isDeleting } = useDeleteSelectorDefinition();

  const definitions = definitionsData?.selectorDefinitions || [];

  const handleCreateDefinition = (data: CreateSelectorDefinitionRequest) => {
    createDefinition({ selectorGroupId, data }, {
      onSuccess: () => {
        setShowCreateDialog(false);
      }
    });
  };

  const handleUpdateDefinition = (data: UpdateSelectorDefinitionRequest) => {
    if (editingDefinition) {
      updateDefinition({ selectorDefinitionId: editingDefinition.id, data, selectorGroupId }, {
        onSuccess: () => {
          setEditingDefinition(null);
        }
      });
    }
  };

  const handleDeleteDefinition = async () => {
    if (deletingDefinition) {
      deleteDefinition({ selectorDefinitionId: deletingDefinition.id, selectorGroupId }, {
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
          <h3 className="text-lg font-semibold">Selector Definitions</h3>
          <p className="text-sm text-muted-foreground">
            Manage questions for "{selectorGroupName}"
          </p>
        </div>
        <Button onClick={() => setShowCreateDialog(true)} disabled={isCreating}>
          <Plus className="h-4 w-4 mr-2" />
          Add Question
        </Button>
      </div>

      {definitions.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-8">
            <div className="text-muted-foreground mb-2">No questions</div>
            <p className="text-sm text-muted-foreground text-center mb-4">
              Create questions with multiple choice answers for this selector group.
            </p>
            <Button onClick={() => setShowCreateDialog(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Create First Question
            </Button>
          </CardContent>
        </Card>
      ) : (
        <Card>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Question</TableHead>
                <TableHead>Required</TableHead>
                <TableHead>Options</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {definitions.map((definition) => (
                <TableRow key={definition.id}>
                  <TableCell>
                    <div className="font-medium">{definition.question}</div>
                    {definition.description && (
                      <div className="text-sm text-muted-foreground mt-1">
                        {definition.description}
                      </div>
                    )}
                  </TableCell>
                  <TableCell>
                    <Badge variant={definition.isRequired ? "default" : "outline"} className="text-xs">
                      {definition.isRequired ? "Required" : "Optional"}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="text-sm text-muted-foreground">
                      {definition.options?.length || 0} options
                    </div>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex items-end justify-end gap-1">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setManagingOptionsForDefinition(definition)}
                        className="h-8 w-8 p-0"
                        title="Manage Options"
                      >
                        <Settings className="h-3 w-3" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setEditingDefinition(definition)}
                        disabled={isUpdating}
                        className="h-8 w-8 p-0"
                        title="Edit Question"
                      >
                        <Edit className="h-3 w-3" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setDeletingDefinition(definition)}
                        disabled={isDeleting}
                        className="h-8 w-8 p-0 text-destructive hover:text-destructive"
                        title="Delete Question"
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
      <CreateSelectorDefinitionDialog
        open={showCreateDialog}
        onOpenChange={setShowCreateDialog}
        onSubmit={handleCreateDefinition}
        isLoading={isCreating}
        selectorGroupName={selectorGroupName}
      />

      {/* Edit Dialog */}
      <EditSelectorDefinitionDialog
        open={!!editingDefinition}
        onOpenChange={() => setEditingDefinition(null)}
        selectorDefinition={editingDefinition}
        onSubmit={handleUpdateDefinition}
        isLoading={isUpdating}
        selectorGroupName={selectorGroupName}
      />

      {/* Delete Confirmation */}
      <ConfirmActionDialog
        open={!!deletingDefinition}
        onOpenChange={() => setDeletingDefinition(null)}
        title="Delete Selector Definition"
        description={`Are you sure you want to delete "${deletingDefinition?.question}"? This action cannot be undone and may affect existing services.`}
        onConfirm={handleDeleteDefinition}
        variant="destructive"
      />

      {/* Options Manager Dialog */}
      <SelectorOptionsManager
        open={!!managingOptionsForDefinition}
        onOpenChange={() => setManagingOptionsForDefinition(null)}
        selectorDefinition={managingOptionsForDefinition}
        companyId={companyId}
      />
    </div>
  );
}
