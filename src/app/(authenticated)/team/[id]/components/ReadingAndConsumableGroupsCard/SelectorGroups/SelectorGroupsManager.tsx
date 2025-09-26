'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Plus, Settings, Trash2 } from 'lucide-react';

import { LoadingSpinner } from '@/components/LoadingSpinner';
import { useGetSelectorGroups } from '@/hooks/react-query/selector-groups/useGetSelectorGroups';
import { useCreateSelectorGroup } from '@/hooks/react-query/selector-groups/useCreateSelectorGroup';
import { useDeleteSelectorGroup } from '@/hooks/react-query/selector-groups/useDeleteSelectorGroup';

import { SelectorGroup, CreateSelectorGroupRequest } from '@/ts/interfaces/SelectorGroups';

import { CreateSelectorGroupDialog } from './CreateSelectorGroupDialog';
import { ComprehensiveSelectorGroupManager } from './ComprehensiveSelectorGroupManager';
import ConfirmActionDialog from '@/components/confirm-action-dialog';


interface SelectorGroupsManagerProps {
  companyId: string;
}

export function SelectorGroupsManager({ companyId }: SelectorGroupsManagerProps) {
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [managingDefinitionsForGroup, setManagingDefinitionsForGroup] = useState<SelectorGroup | null>(null);
  const [deletingGroup, setDeletingGroup] = useState<SelectorGroup | null>(null);

  const { data: selectorGroupsData, isLoading } = useGetSelectorGroups(companyId);
  const { mutate: createSelectorGroup, isPending: isCreating } = useCreateSelectorGroup();
  const { mutate: deleteSelectorGroup, isPending: isDeleting } = useDeleteSelectorGroup();

  const selectorGroups = selectorGroupsData?.selectorGroups || [];

  const handleCreateSelectorGroup = (data: CreateSelectorGroupRequest) => {
    createSelectorGroup({ companyId, data }, {
      onSuccess: () => {
        setShowCreateDialog(false);
      }
    });
  };

  const handleDeleteGroup = async () => {
    if (deletingGroup) {
      deleteSelectorGroup({ 
        selectorGroupId: deletingGroup.id, 
        companyId 
      }, {
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
                    <div className="flex items-center justify-end gap-1">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setManagingDefinitionsForGroup(selectorGroup)}
                        className="h-8 w-8 p-0"
                        title="Manage Selector Group"
                      >
                        <Settings className="h-3 w-3" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setDeletingGroup(selectorGroup)}
                        className="h-8 w-8 p-0 text-red-600 hover:text-red-700 hover:bg-red-50"
                        title="Delete Selector Group"
                        disabled={selectorGroup.isDefault}
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
      <CreateSelectorGroupDialog
        open={showCreateDialog}
        onOpenChange={setShowCreateDialog}
        onSubmit={handleCreateSelectorGroup}
        isLoading={isCreating}
      />

      {/* Comprehensive Manager Dialog */}
      <ComprehensiveSelectorGroupManager
        open={!!managingDefinitionsForGroup}
        onOpenChange={() => setManagingDefinitionsForGroup(null)}
        selectorGroup={managingDefinitionsForGroup}
        companyId={companyId}
      />

      {/* Delete Confirmation Dialog */}
      <ConfirmActionDialog
        open={!!deletingGroup}
        onOpenChange={() => setDeletingGroup(null)}
        title="Delete Selector Group"
        description={`Are you sure you want to delete "${deletingGroup?.name}"? This will also delete all selector definitions within this group. This action cannot be undone.`}
        onConfirm={handleDeleteGroup}
      />
    </div>
  );
}
