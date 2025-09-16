'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Plus, Edit, Trash2, ChevronDown, ChevronRight, Package } from 'lucide-react';

import { LoadingSpinner } from '@/components/LoadingSpinner';
import { useGetConsumableGroups } from '@/hooks/react-query/consumable-groups/useGetConsumableGroups';
import { useCreateConsumableGroup } from '@/hooks/react-query/consumable-groups/useCreateConsumableGroup';
import { useUpdateConsumableGroup } from '@/hooks/react-query/consumable-groups/useUpdateConsumableGroup';
import { useDeleteConsumableGroup } from '@/hooks/react-query/consumable-groups/useDeleteConsumableGroup';

import { ConsumableGroup, CreateConsumableGroupRequest, UpdateConsumableGroupRequest } from '@/ts/interfaces/ConsumableGroups';
import { ConsumableDefinitionsManager } from './ConsumableDefinitionsManager';
import { CreateConsumableGroupDialog } from './CreateConsumableGroupDialog';
import { EditConsumableGroupDialog } from './EditConsumableGroupDialog';
import ConfirmActionDialog from '@/components/confirm-action-dialog';

interface ConsumableGroupsManagerProps {
  companyId: string;
}

export function ConsumableGroupsManager({ companyId }: ConsumableGroupsManagerProps) {
  const [expandedGroups, setExpandedGroups] = useState<Set<string>>(new Set());
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [editingGroup, setEditingGroup] = useState<ConsumableGroup | null>(null);
  const [deletingGroup, setDeletingGroup] = useState<ConsumableGroup | null>(null);

  const { data: consumableGroupsData, isLoading } = useGetConsumableGroups(companyId);
  const { mutate: createConsumableGroup, isPending: isCreating } = useCreateConsumableGroup(companyId);
  const { mutate: updateConsumableGroup, isPending: isUpdating } = useUpdateConsumableGroup(companyId);
  const { mutate: deleteConsumableGroup, isPending: isDeleting } = useDeleteConsumableGroup(companyId);

  const consumableGroups = consumableGroupsData?.consumableGroups || [];

  const toggleGroupExpansion = (groupId: string) => {
    setExpandedGroups(prev => {
      const newSet = new Set(prev);
      if (newSet.has(groupId)) {
        newSet.delete(groupId);
      } else {
        newSet.add(groupId);
      }
      return newSet;
    });
  };

  const handleCreateGroup = (data: CreateConsumableGroupRequest) => {
    createConsumableGroup(data, {
      onSuccess: () => {
        setShowCreateDialog(false);
      }
    });
  };

  const handleUpdateGroup = (data: UpdateConsumableGroupRequest) => {
    if (editingGroup) {
      updateConsumableGroup({ consumableGroupId: editingGroup.id, data }, {
        onSuccess: () => {
          setEditingGroup(null);
        }
      });
    }
  };

  const handleDeleteGroup = async () => {
    if (deletingGroup) {
      deleteConsumableGroup(deletingGroup.id, {
        onSuccess: () => {
          setDeletingGroup(null);
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
          <h3 className="text-lg font-semibold">Consumable Groups</h3>
          <p className="text-sm text-muted-foreground">
            Manage consumable groups and their definitions for service reports
          </p>
        </div>
        <Button onClick={() => setShowCreateDialog(true)} disabled={isCreating}>
          <Plus className="h-4 w-4 mr-2" />
          Add Group
        </Button>
      </div>

      {consumableGroups.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-8">
            <Package className="h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold mb-2">No Consumable Groups</h3>
            <p className="text-sm text-muted-foreground text-center mb-4">
              Create your first consumable group to start managing consumable definitions for your service reports.
            </p>
            <Button onClick={() => setShowCreateDialog(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Create Consumable Group
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {consumableGroups.map((group) => (
            <Card key={group.id}>
              <CardHeader className="pb-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => toggleGroupExpansion(group.id)}
                      className="h-8 w-8 p-0"
                    >
                      {expandedGroups.has(group.id) ? (
                        <ChevronDown className="h-4 w-4" />
                      ) : (
                        <ChevronRight className="h-4 w-4" />
                      )}
                    </Button>
                    <div>
                      <CardTitle className="text-base flex items-center gap-2">
                        {group.name}
                        
                        {!group.isActive && (
                          <Badge variant="outline" className="text-xs">
                            Inactive
                          </Badge>
                        )}
                      </CardTitle>
                      {group.description && (
                        <CardDescription className="text-sm">
                          {group.description}
                        </CardDescription>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setEditingGroup(group)}
                      disabled={isUpdating}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    {!group.isDefault && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setDeletingGroup(group)}
                        disabled={isDeleting}
                        className="text-destructive hover:text-destructive"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                </div>
              </CardHeader>
              {expandedGroups.has(group.id) && (
                <CardContent>
                  <ConsumableDefinitionsManager consumableGroup={group} companyId={companyId} />
                </CardContent>
              )}
            </Card>
          ))}
        </div>
      )}

      {/* Create Dialog */}
      <CreateConsumableGroupDialog
        open={showCreateDialog}
        onOpenChange={setShowCreateDialog}
        onSubmit={handleCreateGroup}
        isLoading={isCreating}
      />

      {/* Edit Dialog */}
      <EditConsumableGroupDialog
        open={!!editingGroup}
        onOpenChange={() => setEditingGroup(null)}
        consumableGroup={editingGroup}
        onSubmit={handleUpdateGroup}
        isLoading={isUpdating}
      />

      {/* Delete Confirmation */}
      <ConfirmActionDialog
        open={!!deletingGroup}
        onOpenChange={() => setDeletingGroup(null)}
        title="Delete Consumable Group"
        description={`Are you sure you want to delete "${deletingGroup?.name}"? This will also delete all consumable definitions within this group. This action cannot be undone.`}
        onConfirm={handleDeleteGroup}
        variant="destructive"
      />
    </div>
  );
}
