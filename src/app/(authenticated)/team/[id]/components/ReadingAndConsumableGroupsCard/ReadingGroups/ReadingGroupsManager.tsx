'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Plus, Edit, Trash2, ChevronDown, ChevronRight, TestTube } from 'lucide-react';

import { LoadingSpinner } from '@/components/LoadingSpinner';
import { useGetReadingGroups } from '@/hooks/react-query/reading-groups/useGetReadingGroups';
import { useCreateReadingGroup } from '@/hooks/react-query/reading-groups/useCreateReadingGroup';
import { useBatchUpdateReadingGroup } from '@/hooks/react-query/reading-groups/useBatchUpdateReadingGroup';
import { useDeleteReadingGroup } from '@/hooks/react-query/reading-groups/useDeleteReadingGroup';

import { ReadingGroup, CreateReadingGroupRequest, UpdateReadingGroupRequest } from '@/ts/interfaces/ReadingGroups';
import { ReadingDefinitionsManager } from './ReadingDefinitionsManager';
import { CreateReadingGroupDialog } from './CreateReadingGroupDialog';
import { EditReadingGroupDialog } from './EditReadingGroupDialog';
import ConfirmActionDialog from '@/components/confirm-action-dialog';

interface ReadingGroupsManagerProps {
  companyId: string;
}

export function ReadingGroupsManager({ companyId }: ReadingGroupsManagerProps) {
  const [expandedGroups, setExpandedGroups] = useState<Set<string>>(new Set());
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [editingGroup, setEditingGroup] = useState<ReadingGroup | null>(null);
  const [deletingGroup, setDeletingGroup] = useState<ReadingGroup | null>(null);

  const { data: readingGroupsData, isLoading } = useGetReadingGroups(companyId);
  const { mutate: createReadingGroup, isPending: isCreating } = useCreateReadingGroup(companyId);
  const { mutate: updateReadingGroup, isPending: isUpdating } = useBatchUpdateReadingGroup(companyId);
  const { mutate: deleteReadingGroup, isPending: isDeleting } = useDeleteReadingGroup(companyId);

  const readingGroups = readingGroupsData?.readingGroups || [];

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

  const handleCreateGroup = (data: CreateReadingGroupRequest) => {
    createReadingGroup(data, {
      onSuccess: () => {
        setShowCreateDialog(false);
      }
    });
  };

  const handleUpdateGroup = (data: UpdateReadingGroupRequest) => {
    if (editingGroup) {
      updateReadingGroup({
        readingGroupId: editingGroup.id,
        data: {
          name: data.name,
          description: data.description,
          isActive: data.isActive
        }
      }, {
        onSuccess: () => {
          setEditingGroup(null);
        }
      });
    }
  };

  const handleDeleteGroup = async () => {
    if (deletingGroup) {
      deleteReadingGroup(deletingGroup.id, {
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
      <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-3">
        <div>
          <h3 className="text-lg font-semibold">Reading Groups</h3>
          <p className="text-sm text-muted-foreground">
            Manage reading groups and their definitions for service reports
          </p>
        </div>
        <Button
          onClick={() => setShowCreateDialog(true)}
          disabled={isCreating}
          className="w-full md:w-auto"
        >
          <Plus className="h-4 w-4 mr-2" />
          Add Group
        </Button>
      </div>


      {readingGroups.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-8">
            <TestTube className="h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold mb-2">No Reading Groups</h3>
            <p className="text-sm text-muted-foreground text-center mb-4">
              Create your first reading group to start managing reading definitions for your service reports.
            </p>
            <Button onClick={() => setShowCreateDialog(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Create Reading Group
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {readingGroups.map((group) => (
            <Card key={group.id}>
              <CardHeader className="pb-6">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                  {/* Mobile: Single row with arrow, text, and action buttons - centered */}
                  <div className="flex items-center gap-2 sm:gap-3 w-full sm:w-auto">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => toggleGroupExpansion(group.id)}
                      className="h-8 w-8 p-0 flex-shrink-0"
                    >
                      {expandedGroups.has(group.id) ? (
                        <ChevronDown className="h-4 w-4" />
                      ) : (
                        <ChevronRight className="h-4 w-4" />
                      )}
                    </Button>

                    <div className="flex-1 min-w-0">
                      <CardTitle className="text-base flex items-center justify-start gap-2">
                        {group.name}
                        {!group.isActive && (
                          <Badge variant="outline" className="text-xs">
                            Inactive
                          </Badge>
                        )}
                      </CardTitle>
                      {group.description && (
                        <CardDescription className="text-sm">{group.description}</CardDescription>
                      )}
                    </div>

                    {/* Action buttons - positioned on the right */}
                    <div className="flex gap-2 flex-shrink-0">
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
                </div>
              </CardHeader>

              {expandedGroups.has(group.id) && (
                <CardContent>
                  <ReadingDefinitionsManager readingGroup={group} companyId={companyId} />
                </CardContent>
              )}
            </Card>
          ))}
        </div>
      )}

      {/* Create Dialog */}
      <CreateReadingGroupDialog
        open={showCreateDialog}
        onOpenChange={setShowCreateDialog}
        onSubmit={handleCreateGroup}
        isLoading={isCreating}
      />

      {/* Edit Dialog */}
      <EditReadingGroupDialog
        open={!!editingGroup}
        onOpenChange={() => setEditingGroup(null)}
        readingGroup={editingGroup}
        onSubmit={handleUpdateGroup}
        isLoading={isUpdating}
      />

      {/* Delete Confirmation */}
      <ConfirmActionDialog
        open={!!deletingGroup}
        onOpenChange={() => setDeletingGroup(null)}
        title="Delete Reading Group"
        description={`Are you sure you want to delete "${deletingGroup?.name}"? This will also delete all reading definitions within this group. This action cannot be undone.`}
        onConfirm={handleDeleteGroup}
        variant="destructive"
      />
    </div>
  );
}
