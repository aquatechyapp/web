'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Plus, Edit, Trash2, ChevronDown, ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils';

import { LoadingSpinner } from '@/components/LoadingSpinner';
import { useGetPhotoGroups } from '@/hooks/react-query/photo-groups/useGetPhotoGroups';
import { useCreatePhotoGroup } from '@/hooks/react-query/photo-groups/useCreatePhotoGroup';
import { useUpdatePhotoGroup } from '@/hooks/react-query/photo-groups/useUpdatePhotoGroup';
import { useDeletePhotoGroup } from '@/hooks/react-query/photo-groups/useDeletePhotoGroup';

import { PhotoGroup, CreatePhotoGroupRequest, UpdatePhotoGroupRequest } from '@/ts/interfaces/PhotoGroups';

import ConfirmActionDialog from '@/components/confirm-action-dialog';
import { CreatePhotoGroupDialog } from './CreatePhotoGroupDialog';
import { EditPhotoGroupDialog } from './EditPhotoGroupDialog';
import { PhotoDefinitionsManager } from './PhotoDefinitionsManager';

interface PhotoGroupsManagerProps {
  companyId: string;
}

export function PhotoGroupsManager({ companyId }: PhotoGroupsManagerProps) {
  const [editingPhotoGroup, setEditingPhotoGroup] = useState<PhotoGroup | null>(null);
  const [deletingPhotoGroup, setDeletingPhotoGroup] = useState<PhotoGroup | null>(null);
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [expandedGroups, setExpandedGroups] = useState<Set<string>>(new Set());

  const { data: photoGroupsData, isLoading } = useGetPhotoGroups(companyId);
  const { mutate: createPhotoGroup, isPending: isCreating } = useCreatePhotoGroup();
  const { mutate: updatePhotoGroup, isPending: isUpdating } = useUpdatePhotoGroup();
  const { mutate: deletePhotoGroup, isPending: isDeleting } = useDeletePhotoGroup();

  const photoGroups = photoGroupsData?.photoGroups || [];

  const handleCreatePhotoGroup = (data: CreatePhotoGroupRequest) => {
    createPhotoGroup({ companyId, data }, {
      onSuccess: () => {
        setShowCreateDialog(false);
      }
    });
  };

  const handleUpdatePhotoGroup = (data: UpdatePhotoGroupRequest) => {
    if (editingPhotoGroup) {
      updatePhotoGroup({ photoGroupId: editingPhotoGroup.id, data }, {
        onSuccess: () => {
          setEditingPhotoGroup(null);
        }
      });
    }
  };

  const handleDeletePhotoGroup = async () => {
    if (deletingPhotoGroup) {
      deletePhotoGroup(deletingPhotoGroup.id, {
        onSuccess: () => {
          setDeletingPhotoGroup(null);
        }
      });
    }
  };

  const canDeletePhotoGroup = (photoGroup: PhotoGroup) => {
    return !photoGroup.isDefault;
  };

  const toggleGroupExpansion = (photoGroupId: string) => {
    setExpandedGroups(prev => {
      const newSet = new Set(prev);
      if (newSet.has(photoGroupId)) {
        newSet.delete(photoGroupId);
      } else {
        newSet.add(photoGroupId);
      }
      return newSet;
    });
  };

  if (isLoading) {
    return <LoadingSpinner />;
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <div>
          <h3 className="text-lg font-semibold">Photo Groups</h3>
          <p className="text-sm text-muted-foreground">
            Manage photo groups that can be used for service documentation
          </p>
        </div>
        <Button onClick={() => setShowCreateDialog(true)} disabled={isCreating}>
          <Plus className="h-4 w-4 mr-2" />
          Add Photo Group
        </Button>
      </div>

      {photoGroups.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-8">
            <div className="text-muted-foreground mb-2">No photo groups</div>
            <p className="text-sm text-muted-foreground text-center mb-4">
              Create photo groups to define photo requirements for your services (e.g., "Before Photos", "Equipment Photos", etc.).
            </p>
            <Button onClick={() => setShowCreateDialog(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Create First Photo Group
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {photoGroups.map((photoGroup) => (
            <Card key={photoGroup.id}>
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => toggleGroupExpansion(photoGroup.id)}
                      className="h-8 w-8 p-0"
                    >
                      {expandedGroups.has(photoGroup.id) ? (
                        <ChevronDown className="h-4 w-4" />
                      ) : (
                        <ChevronRight className="h-4 w-4" />
                      )}
                    </Button>
                    <div>
                      <CardTitle className="text-base flex items-center gap-2">
                        {photoGroup.name}
                        {photoGroup.isDefault && (
                          <Badge variant="outline" className="text-xs">
                            Default
                          </Badge>
                        )}
                      </CardTitle>
                      {photoGroup.description && (
                        <CardDescription className="text-sm">
                          {photoGroup.description}
                        </CardDescription>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant={photoGroup.isActive ? "default" : "outline"} className="text-xs">
                      {photoGroup.isActive ? "Active" : "Inactive"}
                    </Badge>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setEditingPhotoGroup(photoGroup)}
                      disabled={isUpdating}
                      className="h-8 w-8 p-0"
                      title="Edit Photo Group"
                    >
                      <Edit className="h-3 w-3" />
                    </Button>
                    {canDeletePhotoGroup(photoGroup) && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setDeletingPhotoGroup(photoGroup)}
                        disabled={isDeleting}
                        className="h-8 w-8 p-0 text-destructive hover:text-destructive"
                        title="Delete Photo Group"
                      >
                        <Trash2 className="h-3 w-3" />
                      </Button>
                    )}
                  </div>
                </div>
              </CardHeader>
              {expandedGroups.has(photoGroup.id) && (
                <CardContent>
                  <PhotoDefinitionsManager 
                    photoGroup={photoGroup} 
                    companyId={companyId} 
                  />
                </CardContent>
              )}
            </Card>
          ))}
        </div>
      )}

      {/* Create Dialog */}
      <CreatePhotoGroupDialog
        open={showCreateDialog}
        onOpenChange={setShowCreateDialog}
        onSubmit={handleCreatePhotoGroup}
        isLoading={isCreating}
      />

      {/* Edit Dialog */}
      <EditPhotoGroupDialog
        open={!!editingPhotoGroup}
        onOpenChange={() => setEditingPhotoGroup(null)}
        photoGroup={editingPhotoGroup}
        onSubmit={handleUpdatePhotoGroup}
        isLoading={isUpdating}
      />

      {/* Delete Confirmation */}
      <ConfirmActionDialog
        open={!!deletingPhotoGroup}
        onOpenChange={() => setDeletingPhotoGroup(null)}
        title="Delete Photo Group"
        description={`Are you sure you want to delete "${deletingPhotoGroup?.name}"? This action cannot be undone and may affect existing services.`}
        onConfirm={handleDeletePhotoGroup}
        variant="destructive"
      />
    </div>
  );
}
