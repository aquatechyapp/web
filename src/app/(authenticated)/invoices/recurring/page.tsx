'use client';

import { useRouter } from 'next/navigation';
import { useEffect, useMemo } from 'react';

import { useUserStore } from '@/store/user';
import { LoadingSpinner } from '@/components/LoadingSpinner';
import useGetRecurringInvoiceTemplates, { RecurringInvoiceTemplate } from '@/hooks/react-query/invoices/useGetRecurringInvoiceTemplates';
import useGetAllClients from '@/hooks/react-query/clients/getAllClients';
import { DataTableRecurringInvoices } from './DataTableRecurringInvoices/index';
import { createColumns } from './DataTableRecurringInvoices/columns';

export default function RecurringInvoicesPage() {
  const router = useRouter();
  const user = useUserStore((state) => state.user);
  const { data: templates = [], isLoading: isLoadingTemplates } = useGetRecurringInvoiceTemplates();
  const { data: clients = [] } = useGetAllClients();

  // Auth check
  useEffect(() => {
    if (user.firstName === '') {
      router.push('/onboarding');
    }
  }, [user, router]);

  // Get unique clients from templates
  const templateClients = useMemo(() => {
    const clientMap = new Map<string, { id: string; name: string }>();
    templates.forEach((template: RecurringInvoiceTemplate) => {
      if (template.clientId && !clientMap.has(template.clientId)) {
        const client = clients.find((c) => c.id === template.clientId);
        const clientName = template.clientName || client?.fullName || `${client?.firstName || ''} ${client?.lastName || ''}`.trim() || 'Unknown';
        clientMap.set(template.clientId, { id: template.clientId, name: clientName });
      }
    });
    return Array.from(clientMap.values());
  }, [templates, clients]);

  // Action handlers
  const handleView = (template: RecurringInvoiceTemplate) => {
    // TODO: Navigate to view page or open modal
    console.log('View template:', template);
  };

  const handleEdit = (template: RecurringInvoiceTemplate) => {
    // TODO: Navigate to edit page
    console.log('Edit template:', template);
  };

  const handleDelete = (template: RecurringInvoiceTemplate) => {
    // TODO: Open delete confirmation modal
    console.log('Delete template:', template);
  };

  const handleCreateTemplate = () => {
    router.push('/invoices/recurring/new');
  };

  const columns = createColumns(handleView, handleEdit, handleDelete);

  if (isLoadingTemplates) {
    return <LoadingSpinner />;
  }

  return (
    <div className="flex flex-col gap-6 p-2">
      {/* Data Table */}
      <DataTableRecurringInvoices 
        columns={columns} 
        data={templates} 
        clients={templateClients}
        onCreateTemplate={handleCreateTemplate}
      />
    </div>
  );
}
