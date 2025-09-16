'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Plus, Edit, Trash2, ChevronDown, ChevronRight, Star, StarOff } from 'lucide-react';

import { LoadingSpinner } from '@/components/LoadingSpinner';
import { useGetChecklistTemplates } from '@/hooks/react-query/checklist-templates/useGetChecklistTemplates';
import { useCreateChecklistTemplate } from '@/hooks/react-query/checklist-templates/useCreateChecklistTemplate';
import { useUpdateChecklistTemplate } from '@/hooks/react-query/checklist-templates/useUpdateChecklistTemplate';
import { useDeleteChecklistTemplate } from '@/hooks/react-query/checklist-templates/useDeleteChecklistTemplate';
import { useSetDefaultChecklistTemplate } from '@/hooks/react-query/checklist-templates/useSetDefaultChecklistTemplate';

import { ChecklistTemplate, CreateChecklistTemplateRequest, UpdateChecklistTemplateRequest } from '@/ts/interfaces/ChecklistTemplates';

import ConfirmActionDialog from '@/components/confirm-action-dialog';
import { CreateChecklistTemplateDialog } from './CreateChecklistTemplateDialog';
import { EditChecklistTemplateDialog } from './EditChecklistTemplateDialog';

interface ChecklistTemplatesManagerProps {
  companyId: string;
}

export function ChecklistTemplatesManager({ companyId }: ChecklistTemplatesManagerProps) {
  const [expandedTemplates, setExpandedTemplates] = useState<Set<string>>(new Set());
  const [editingTemplate, setEditingTemplate] = useState<ChecklistTemplate | null>(null);
  const [deletingTemplate, setDeletingTemplate] = useState<ChecklistTemplate | null>(null);
  const [showCreateDialog, setShowCreateDialog] = useState(false);

  const { data: templatesData, isLoading } = useGetChecklistTemplates({ companyId });
  const { mutate: createTemplate, isPending: isCreating } = useCreateChecklistTemplate();
  const { mutate: updateTemplate, isPending: isUpdating } = useUpdateChecklistTemplate();
  const { mutate: deleteTemplate, isPending: isDeleting } = useDeleteChecklistTemplate();
  const { mutate: setDefaultTemplate, isPending: isSettingDefault } = useSetDefaultChecklistTemplate();

  const templates = templatesData?.templates || [];

  const toggleTemplateExpansion = (templateId: string) => {
    setExpandedTemplates(prev => {
      const newSet = new Set(prev);
      if (newSet.has(templateId)) {
        newSet.delete(templateId);
      } else {
        newSet.add(templateId);
      }
      return newSet;
    });
  };

  const handleCreateTemplate = (data: CreateChecklistTemplateRequest) => {
    createTemplate(data, {
      onSuccess: () => {
        setShowCreateDialog(false);
      }
    });
  };

  const handleUpdateTemplate = (data: UpdateChecklistTemplateRequest) => {
    if (editingTemplate) {
      updateTemplate({ templateId: editingTemplate.id, data }, {
        onSuccess: () => {
          setEditingTemplate(null);
        }
      });
    }
  };

  const handleDeleteTemplate = async () => {
    if (deletingTemplate) {
      deleteTemplate(deletingTemplate.id, {
        onSuccess: () => {
          setDeletingTemplate(null);
        }
      });
    }
  };

  const handleSetDefault = (templateId: string) => {
    setDefaultTemplate(templateId);
  };

  const getTemplateTypeLabel = (template: ChecklistTemplate) => {
    if (template.poolId) return "Pool-specific";
    return "Company-wide";
  };

  if (isLoading) {
    return <LoadingSpinner />;
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <div>
          <h3 className="text-lg font-semibold">Checklist Templates</h3>
          <p className="text-sm text-muted-foreground">
            Create and manage checklist templates for your service reports
          </p>
        </div>
        <Button onClick={() => setShowCreateDialog(true)} disabled={isCreating}>
          <Plus className="h-4 w-4 mr-2" />
          Add Template
        </Button>
      </div>

      {templates.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-8">
            <div className="text-muted-foreground mb-2">No checklist templates</div>
            <p className="text-sm text-muted-foreground text-center mb-4">
              Create checklist templates to standardize your service reports with custom checklists.
            </p>
            <Button onClick={() => setShowCreateDialog(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Create First Template
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {templates.map((template) => (
            <Card key={template.id}>
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => toggleTemplateExpansion(template.id)}
                      className="h-8 w-8 p-0"
                    >
                      {expandedTemplates.has(template.id) ? (
                        <ChevronDown className="h-4 w-4" />
                      ) : (
                        <ChevronRight className="h-4 w-4" />
                      )}
                    </Button>
                    <div>
                      <CardTitle className="text-base flex items-center gap-2">
                        {template.name}
                       
                        {!template.isActive && (
                          <Badge variant="outline" className="text-xs">
                            Inactive
                          </Badge>
                        )}
                      </CardTitle>
                      {template.description && (
                        <CardDescription className="text-sm">
                          {template.description}
                        </CardDescription>
                      )}
                      
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setEditingTemplate(template)}
                      disabled={isUpdating}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setDeletingTemplate(template)}
                      disabled={isDeleting}
                      className="text-destructive hover:text-destructive"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardHeader>
              {expandedTemplates.has(template.id) && (
                <CardContent>
                  <div className="space-y-2">
                    <h4 className="text-sm font-semibold">Checklist Items:</h4>
                    {template.items.length === 0 ? (
                      <p className="text-sm text-muted-foreground italic">No items in this template</p>
                    ) : (
                      <div className="space-y-1">
                        {template.items
                          .sort((a, b) => a.order - b.order)
                          .map((item, index) => (
                            <div key={item.id} className="flex items-center gap-2 p-2 bg-muted/50 rounded">
                              <span className="text-xs text-muted-foreground min-w-[20px]">
                                {index + 1}.
                              </span>
                              <span className="text-sm">{item.label}</span>
                            </div>
                          ))}
                      </div>
                    )}
                  </div>
                </CardContent>
              )}
            </Card>
          ))}
        </div>
      )}

      {/* Create Dialog */}
      <CreateChecklistTemplateDialog
        open={showCreateDialog}
        onOpenChange={setShowCreateDialog}
        onSubmit={handleCreateTemplate}
        isLoading={isCreating}
        companyId={companyId}
      />

      {/* Edit Dialog */}
      <EditChecklistTemplateDialog
        open={!!editingTemplate}
        onOpenChange={() => setEditingTemplate(null)}
        template={editingTemplate}
        onSubmit={handleUpdateTemplate}
        isLoading={isUpdating}
      />

      {/* Delete Confirmation */}
      <ConfirmActionDialog
        open={!!deletingTemplate}
        onOpenChange={() => setDeletingTemplate(null)}
        title="Delete Checklist Template"
        description={`Are you sure you want to delete "${deletingTemplate?.name}"? This action cannot be undone and may affect existing services that use this template.`}
        onConfirm={handleDeleteTemplate}
        variant="destructive"
      />
    </div>
  );
}
