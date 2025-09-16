'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Plus, Edit, Trash2, Settings } from 'lucide-react';

import { LoadingSpinner } from '@/components/LoadingSpinner';
import { useGetSelectorGroups } from '@/hooks/react-query/selector-groups/useGetSelectorGroups';
import { useCreateSelectorGroup } from '@/hooks/react-query/selector-groups/useCreateSelectorGroup';
import { useUpdateSelectorGroup } from '@/hooks/react-query/selector-groups/useUpdateSelectorGroup';
import { useDeleteSelectorGroup } from '@/hooks/react-query/selector-groups/useDeleteSelectorGroup';

import { SelectorGroup, CreateSelectorGroupRequest, UpdateSelectorGroupRequest } from '@/ts/interfaces/SelectorGroups';

import ConfirmActionDialog from '@/components/confirm-action-dialog';
import { CreateSelectorGroupDialog } from './CreateSelectorGroupDialog';
import { EditSelectorGroupDialog } from './EditSelectorGroupDialog';
import { SelectorDefinitionsManager } from './SelectorDefinitionsManager';


interface SelectorGroupsManagerProps {
  companyId: string;
}

export function SelectorGroupsManager({ companyId }: SelectorGroupsManagerProps) {
  const [editingSelectorGroup, setEditingSelectorGroup] = useState<SelectorGroup | null>(null);
  const [deletingSelectorGroup, setDeletingSelectorGroup] = useState<SelectorGroup | null>(null);
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [managingDefinitionsForGroup, setManagingDefinitionsForGroup] = useState<SelectorGroup | null>(null);

  const { data: selectorGroupsData, isLoading } = useGetSelectorGroups(companyId);
  const { mutate: createSelectorGroup, isPending: isCreating } = useCreateSelectorGroup();
  const { mutate: updateSelectorGroup, isPending: isUpdating } = useUpdateSelectorGroup();
  const { mutate: deleteSelectorGroup, isPending: isDeleting } = useDeleteSelectorGroup();

  const selectorGroups = selectorGroupsData?.selectorGroups || [];

  const handleCreateSelectorGroup = (data: CreateSelectorGroupRequest) => {
    createSelectorGroup({ companyId, data }, {
      onSuccess: () => {
        setShowCreateDialog(false);
      }
    });
  };

  const handleUpdateSelectorGroup = (data: UpdateSelectorGroupRequest) => {
    if (editingSelectorGroup) {
      updateSelectorGroup({ selectorGroupId: editingSelectorGroup.id, data, companyId }, {
        onSuccess: () => {
          setEditingSelectorGroup(null);
        }
      });
    }
  };

  const handleDeleteSelectorGroup = async () => {
    if (deletingSelectorGroup) {
      deleteSelectorGroup({ selectorGroupId: deletingSelectorGroup.id, companyId }, {
        onSuccess: () => {
          setDeletingSelectorGroup(null);
        }
      });
    }
  };

  const canDeleteSelectorGroup = (selectorGroup: SelectorGroup) => {
    return !selectorGroup.isDefault;
  };

  if (isLoading) {
    return <LoadingSpinner />;
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <div>
          <h3 className="text-lg font-semibold">Selector Groups</h3>
          <p className="text-sm text-muted-foreground">
            Manage selector groups that can be used for service questions
          </p>
        </div>
        <Button onClick={() => setShowCreateDialog(true)} disabled={isCreating}>
          <Plus className="h-4 w-4 mr-2" />
          Add Selector Group
        </Button>
      </div>

      {selectorGroups.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-8">
            <div className="text-muted-foreground mb-2">No selector groups</div>
            <p className="text-sm text-muted-foreground text-center mb-4">
              Create selector groups to define questions with multiple choice answers for your services (e.g., "Basic Questions", "Equipment Status", etc.).
            </p>
            <Button onClick={() => setShowCreateDialog(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Create First Selector Group
            </Button>
          </CardContent>
        </Card>
      ) : (
        <Card>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Description</TableHead>
                <TableHead>Questions</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {selectorGroups.map((selectorGroup) => (
                <TableRow key={selectorGroup.id}>
                  <TableCell>
                    <div className="font-medium">{selectorGroup.name}</div>
                  </TableCell>
                  <TableCell>
                    <div className="text-sm text-muted-foreground">
                      {selectorGroup.description || 'No description'}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="text-sm text-muted-foreground">
                      {selectorGroup.selectorDefinitions?.length || 0} questions
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant={selectorGroup.isActive ? "default" : "outline"} className="text-xs">
                      {selectorGroup.isActive ? "Active" : "Inactive"}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex items-end justify-end gap-1">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setManagingDefinitionsForGroup(selectorGroup)}
                        className="h-8 w-8 p-0"
                        title="Manage Questions"
                      >
                        <Settings className="h-3 w-3" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setEditingSelectorGroup(selectorGroup)}
                        disabled={isUpdating}
                        className="h-8 w-8 p-0"
                        title="Edit Selector Group"
                      >
                        <Edit className="h-3 w-3" />
                      </Button>
                      {canDeleteSelectorGroup(selectorGroup) && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => setDeletingSelectorGroup(selectorGroup)}
                          disabled={isDeleting}
                          className="h-8 w-8 p-0 text-destructive hover:text-destructive"
                          title="Delete Selector Group"
                        >
                          <Trash2 className="h-3 w-3" />
                        </Button>
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Card>
      )}

      {/* Create Dialog */}
      <CreateSelectorGroupDialog
        open={showCreateDialog}
        onOpenChange={setShowCreateDialog}
        onSubmit={handleCreateSelectorGroup}
        isLoading={isCreating}
      />

      {/* Edit Dialog */}
      <EditSelectorGroupDialog
        open={!!editingSelectorGroup}
        onOpenChange={() => setEditingSelectorGroup(null)}
        selectorGroup={editingSelectorGroup}
        onSubmit={handleUpdateSelectorGroup}
        isLoading={isUpdating}
      />

      {/* Delete Confirmation */}
      <ConfirmActionDialog
        open={!!deletingSelectorGroup}
        onOpenChange={() => setDeletingSelectorGroup(null)}
        title="Delete Selector Group"
        description={`Are you sure you want to delete "${deletingSelectorGroup?.name}"? This action cannot be undone and may affect existing services.`}
        onConfirm={handleDeleteSelectorGroup}
        variant="destructive"
      />

      {/* Definitions Manager Dialog */}
      {managingDefinitionsForGroup && (
        <SelectorDefinitionsManager
          selectorGroupId={managingDefinitionsForGroup.id}
          selectorGroupName={managingDefinitionsForGroup.name}
          companyId={companyId}
        />
      )}
    </div>
  );
}
