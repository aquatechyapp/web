'use client';

import { useState } from 'react';
import { CheckSquare, Plus, Trash2, Edit3, ChevronDown } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { useUpdateChecklistTemplate } from '@/hooks/react-query/checklist-templates/useUpdateChecklistTemplate';
import { Company } from '@/ts/interfaces/Company';
import { ChecklistTemplateItem } from '@/ts/interfaces/ChecklistTemplates';

interface CustomChecklistCardProps {
  company: Company;
  form: any;
  onCustomizationsSubmit: (data: any) => void;
  customizationsFieldsChanged: () => boolean;
}

export function CustomChecklistCard({ 
  company, 
  form, 
  onCustomizationsSubmit, 
  customizationsFieldsChanged 
}: CustomChecklistCardProps) {
  const { isPending: isChecklistPending } = useUpdateChecklistTemplate();

  const [collapsed, setCollapsed] = useState(true);
  
  // Add state for managing checklist items
  const [customChecklist, setCustomChecklist] = useState<ChecklistTemplateItem[]>(
    company.checklistTemplates?.[0]?.items || []
  );
  const [newChecklistItem, setNewChecklistItem] = useState<ChecklistTemplateItem>({
    id: '',
    label: '',
    order: 0,
    createdAt: new Date().toISOString()
  });
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [editingText, setEditingText] = useState('');

  const toggleCollapsed = () => {
    setCollapsed(!collapsed);
  };

  // Add checklist management functions
  const addChecklistItem = () => {
    if (newChecklistItem.label.trim() && !customChecklist.some(item => item.label === newChecklistItem.label.trim())) {
      const newItem: ChecklistTemplateItem = {
        id: Date.now().toString(),
        label: newChecklistItem.label.trim(),
        order: customChecklist.length + 1,
        createdAt: new Date().toISOString()
      };
      const updatedList = [...customChecklist, newItem];
      setCustomChecklist(updatedList);
      form.setValue('customChecklistItems', updatedList, { shouldDirty: true, shouldTouch: true, shouldValidate: true });
      setNewChecklistItem({
        id: '',
        label: '',
        order: 0,
        createdAt: new Date().toISOString()
      });
    }
  };

  const removeChecklistItem = (index: number) => {
    const updatedList = customChecklist.filter((_, i) => i !== index);
    setCustomChecklist(updatedList);
    form.setValue('customChecklistItems', updatedList, { shouldDirty: true, shouldTouch: true, shouldValidate: true });
  };

  const startEditing = (index: number) => {
    setEditingIndex(index);
    setEditingText(customChecklist[index].label);
  };

  const saveEdit = () => {
    if (editingText.trim() && editingIndex !== null) {
      const updatedList = [...customChecklist];
      updatedList[editingIndex] = {
        ...updatedList[editingIndex],
        label: editingText.trim()
      };
      setCustomChecklist(updatedList);
      form.setValue('customChecklistItems', updatedList, { shouldDirty: true, shouldTouch: true, shouldValidate: true });
      setEditingIndex(null);
      setEditingText('');
    }
  };

  const cancelEdit = () => {
    setEditingIndex(null);
    setEditingText('');
  };

  return (
    <Card className="w-full border-2 border-purple-200">
      <CardHeader 
        className="bg-gradient-to-r from-purple-50 to-violet-50 border-b border-purple-200 cursor-pointer hover:from-purple-100 hover:to-violet-100 transition-colors"
        onClick={toggleCollapsed}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-purple-100 rounded-lg">
              <CheckSquare className="h-6 w-6 text-purple-600" />
            </div>
            <div>
              <CardTitle className="text-xl text-purple-900">Custom Service Checklist</CardTitle>
              <CardDescription className="text-purple-700">
                Create and manage custom checklist items for your service reports
              </CardDescription>
            </div>
          </div>
          <ChevronDown 
            className={cn(
              "h-5 w-5 text-purple-600 transition-transform duration-200",
              collapsed ? "rotate-180" : "rotate-0"
            )}
          />
        </div>
      </CardHeader>
      {!collapsed && (
        <>
          <CardContent className="p-6 space-y-6">
            {/* Add New Item */}
            <div className="flex gap-2">
              <input
                type="text"
                value={newChecklistItem.label}
                onChange={(e) => setNewChecklistItem({ ...newChecklistItem, label: e.target.value })}
                placeholder="Enter new checklist item..."
                className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                onKeyPress={(e) => e.key === 'Enter' && addChecklistItem()}
              />
              <Button
                type="button"
                onClick={addChecklistItem}
                disabled={!newChecklistItem.label.trim()}
                className="bg-purple-600 hover:bg-purple-700 text-white"
              >
                <Plus className="h-4 w-4" />
              </Button>
            </div>

            {/* Checklist Items */}
            <div className="space-y-3">
              <h4 className="text-sm font-semibold text-gray-800">Current Checklist Items:</h4>
              {customChecklist.length === 0 ? (
                <p className="text-sm text-gray-500 italic">No checklist items yet. Add your first item above.</p>
              ) : (
                <div className="space-y-2">
                  {customChecklist.map((item, index) => (
                    <div key={index} className="flex items-center gap-2 p-3 bg-purple-50 border border-purple-200 rounded-lg">
                      <CheckSquare className="h-4 w-4 text-purple-600 flex-shrink-0" />
                      {editingIndex === index ? (
                        <div className="flex-1 flex gap-2">
                          <input
                            type="text"
                            value={editingText}
                            onChange={(e) => setEditingText(e.target.value)}
                            className="flex-1 px-2 py-1 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-purple-500"
                            onKeyPress={(e) => {
                              if (e.key === 'Enter') saveEdit();
                              if (e.key === 'Escape') cancelEdit();
                            }}
                            autoFocus
                          />
                          <Button
                            type="button"
                            size="sm"
                            onClick={saveEdit}
                            className="bg-green-600 hover:bg-green-700 text-white px-2 py-1 h-8"
                          >
                            Save
                          </Button>
                          <Button
                            type="button"
                            size="sm"
                            variant="outline"
                            onClick={cancelEdit}
                            className="px-2 py-1 h-8"
                          >
                            Cancel
                          </Button>
                        </div>
                      ) : (
                        <>
                          <span className="flex-1 text-sm text-gray-800">{item.label}</span>
                          <Button
                            type="button"
                            size="sm"
                            variant="ghost"
                            onClick={() => startEditing(index)}
                            className="p-1 h-8 w-8 text-purple-600 hover:text-purple-700 hover:bg-purple-100"
                          >
                            <Edit3 className="h-3 w-3" />
                          </Button>
                          <Button
                            type="button"
                            size="sm"
                            variant="ghost"
                            onClick={() => removeChecklistItem(index)}
                            className="p-1 h-8 w-8 text-red-600 hover:text-red-700 hover:bg-red-100"
                          >
                            <Trash2 className="h-3 w-3" />
                          </Button>
                        </>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
              <p className="text-sm text-purple-800">
                <strong>Note:</strong> These checklist items will be used as the default template for all new service reports. 
                You can have up to 20 custom items.
              </p>
            </div>
          </CardContent>
          
          {/* Customizations Save Button */}
          <div className="border-t bg-gray-50 p-4">
            <div className="flex justify-center">
              <Button 
                type="button"
                disabled={!customizationsFieldsChanged() || isChecklistPending} 
                className="w-full max-w-xs"
                onClick={() => {
                  const formData = form.getValues();
                  onCustomizationsSubmit(formData);
                }}
              >
                {isChecklistPending ? (
                  <div className="inline-block h-5 w-5 animate-spin rounded-full border-4 border-solid border-current border-r-transparent align-[-0.125em]" />
                ) : (
                  'Save Customizations'
                )}
              </Button>
            </div>
          </div>
        </>
      )}
    </Card>
  );
}
