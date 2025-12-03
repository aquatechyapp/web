'use client';

import { useState } from 'react';
import { BsThreeDotsVertical } from 'react-icons/bs';
import { MdDeleteOutline, MdEdit, MdVisibility } from 'react-icons/md';
import { RecurringInvoiceTemplate } from '@/hooks/react-query/invoices/useGetRecurringInvoiceTemplates';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuShortcut,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';

interface RecurringInvoiceActionsProps {
  template: RecurringInvoiceTemplate;
  onView?: (template: RecurringInvoiceTemplate) => void;
  onEdit?: (template: RecurringInvoiceTemplate) => void;
  onDelete?: (template: RecurringInvoiceTemplate) => void;
}

export function RecurringInvoiceActions({
  template,
  onView,
  onEdit,
  onDelete
}: RecurringInvoiceActionsProps) {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const handleActionSelect = (action: string) => {
    setIsDropdownOpen(false);
    setTimeout(() => {
      switch (action) {
        case 'view':
          onView?.(template);
          break;
        case 'edit':
          onEdit?.(template);
          break;
        case 'delete':
          onDelete?.(template);
          break;
      }
    }, 0);
  };

  const handleDropdownClick = (e: React.MouseEvent) => {
    e.stopPropagation();
  };

  return (
    <div onClick={handleDropdownClick}>
      <DropdownMenu open={isDropdownOpen} onOpenChange={setIsDropdownOpen}>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="icon" onClick={handleDropdownClick}>
            <BsThreeDotsVertical className="text-stone-500" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          {onView && (
            <DropdownMenuItem onSelect={() => handleActionSelect('view')}>
              <div className="flex w-full items-center">
                View
                <DropdownMenuShortcut>
                  <MdVisibility size={14} />
                </DropdownMenuShortcut>
              </div>
            </DropdownMenuItem>
          )}
          {onEdit && (
            <DropdownMenuItem onSelect={() => handleActionSelect('edit')}>
              <div className="flex w-full items-center">
                Edit
                <DropdownMenuShortcut>
                  <MdEdit size={14} />
                </DropdownMenuShortcut>
              </div>
            </DropdownMenuItem>
          )}
          {onDelete && (
            <DropdownMenuItem 
              onSelect={() => handleActionSelect('delete')} 
              className="text-red-500"
            >
              <div className="flex w-full items-center">
                Delete
                <DropdownMenuShortcut>
                  <MdDeleteOutline size={14} />
                </DropdownMenuShortcut>
              </div>
            </DropdownMenuItem>
          )}
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}

