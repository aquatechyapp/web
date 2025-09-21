'use client';

import {
  CheckCircleIcon,
  ListChecks,
  XCircleIcon,
  Beaker,
  FlaskConical,
  ImageIcon,
  Mail,
  Download,
  MapPin,
  Trash2,
  Eye
} from 'lucide-react';
import Image from 'next/image';

import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { zipImages } from '@/lib/js-zip';
import { format } from 'date-fns';
import { Service } from '@/ts/interfaces/Service';
import { Pool } from '@/ts/interfaces/Pool';
import DeleteServiceDialog from '../services-datatable/cancel-dialog';
import { useResendServiceEmail } from '@/hooks/react-query/services/useResendServiceEmail';

type Props = {
  service: Service;
  pool: Pool;
  open: boolean;
  setOpen: (open: boolean) => void;
};

export function ModalViewService({ service, pool, open, setOpen }: Props) {
  const resendEmailMutation = useResendServiceEmail();

  const getStatusMessage = (status: string) => {
    switch (status) {
      case 'InProgress':
        return 'Service is in progress.';
      case 'Open':
        return 'Service is still open.';
      case 'Skipped':
        return 'Service was skipped.';
      default:
        return '';
    }
  };

  const handleResendEmail = () => {
    if (service?.id) {
      resendEmailMutation.mutate(
        { serviceId: service.id },
        {
          onSuccess: () => {
            alert('Email resent successfully!');
          },
          onError: () => {
            alert('Failed to resend email. Please try again.');
          }
        }
      );
    }
  };

  // Helper functions for new structured data
  const getStructuredPhotos = () => {
    if (service?.structuredPhotos && service.structuredPhotos.length > 0) {
      return service.structuredPhotos;
    }
    // Fallback to old photos array
    if (service?.photos && service.photos.length > 0) {
      return service.photos.map((photo: string, index: number) => ({
        id: `legacy-${index}`,
        url: photo,
        photoDefinitionId: 'legacy',
        notes: null,
        createdAt: service.completedAt || new Date().toISOString()
      }));
    }
    return [];
  };

  const getPhotosForDownload = () => {
    const structuredPhotos = getStructuredPhotos();
    return structuredPhotos.map((photo: any) => photo.url);
  };

  const hasPhotos = () => {
    const photos = getStructuredPhotos();
    return photos && photos.length > 0;
  };

  const getPhotoGroups = () => {
    if (!service?.photosSnapshot) return [];
    
    return service.photosSnapshot.map((group: any) => {
      const groupPhotos = service?.structuredPhotos?.filter(
        (photo: any) => group.photoDefinitions.some((def: any) => def.id === photo.photoDefinitionId)
      ) || [];
      
      return {
        ...group,
        photos: groupPhotos
      };
    });
  };

  const getReadingGroups = () => {
    if (service?.readingsSnapshot) {
      return service.readingsSnapshot.map((group: any) => ({
        ...group,
        readings: service?.readings?.filter((reading: any) => 
          group.readingDefinitions.some((def: any) => def.id === reading.readingDefinitionId)
        ) || []
      }));
    }
    
    // Fallback to old structure
    if (service?.chemicalsReading) {
      return [{
        id: 'legacy',
        name: 'Chemical Readings',
        description: 'Legacy chemical readings',
        readings: Object.entries(service.chemicalsReading).map(([key, value]) => ({
          readingDefinitionId: key,
          value: value,
          readingDefinition: {
            name: key.charAt(0).toUpperCase() + key.slice(1),
            unit: key === 'ph' ? 'pH' : 'ppm'
          }
        }))
      }];
    }
    
    return [];
  };

  const getConsumableGroups = () => {
    if (service?.consumablesSnapshot) {
      return service.consumablesSnapshot.map((group: any) => ({
        ...group,
        consumables: service?.consumables?.filter((consumable: any) => 
          group.consumableDefinitions.some((def: any) => def.id === consumable.consumableDefinitionId)
        ) || []
      }));
    }
    
    // Fallback to old structure
    if (service?.chemicalsSpent) {
      return [{
        id: 'legacy',
        name: 'Chemicals Spent',
        description: 'Legacy chemicals spent',
        consumables: Object.entries(service.chemicalsSpent).map(([key, value]) => ({
          consumableDefinitionId: key,
          quantity: value,
          consumableDefinition: {
            name: key.charAt(0).toUpperCase() + key.slice(1),
            unit: key === 'liquidChlorine' || key === 'muriaticAcid' ? 'gallon' : 
                  key === 'tablet' ? 'unit' : 'oz'
          }
        }))
      }];
    }
    
    return [];
  };

  const getChecklistItems = () => {
    // Use new structured checklist if available
    if (service?.checklistSnapshot && service?.customChecklist) {
      return service.checklistSnapshot.map((item: any) => ({
        ...item,
        completed: service.customChecklist![item.id] || false
      }));
    }
    
    // Fallback to old checklist structure
    if (service?.checklist) {
      return [
        { id: 'poolVacuumed', label: 'Pool Vacuumed', completed: service.checklist.poolVacuumed },
        { id: 'skimmerCleaned', label: 'Skimmer Cleaned', completed: service.checklist.skimmerCleaned },
        { id: 'tilesBrushed', label: 'Tiles Brushed', completed: service.checklist.tilesBrushed },
        { id: 'pumpBasketCleaned', label: 'Pump Basket Cleaned', completed: service.checklist.pumpBasketCleaned },
        { id: 'filterWashed', label: 'Filter Washed', completed: service.checklist.filterWashed },
        { id: 'filterChanged', label: 'Filter Changed', completed: service.checklist.filterChanged },
        { id: 'chemicalsAdjusted', label: 'Chemicals Adjusted', completed: service.checklist.chemicalsAdjusted }
      ];
    }
    
    return [];
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="max-h-[90vh] max-w-4xl overflow-y-auto p-6">
        <DialogHeader>
          <div className="flex items-center gap-2">
            <ListChecks className="h-6 w-6 text-[#364D9D]" />
            <DialogTitle className="text-xl font-semibold">Service Report</DialogTitle>
          </div>

          {service.status === 'Completed' && (
            <div className="mt-2 flex items-center gap-2 text-sm text-gray-500">
              <div className="flex-1">
                {format(new Date(service?.completedAt || new Date()), "EEEE, MMMM do 'at' h:mm a")}
                <span className="ml-1 font-medium">
                  by {service?.completedByUser?.firstName || ''} {service?.completedByUser?.lastName || ''}
                </span>
              </div>
            </div>
          )}

          <div className="mt-1 flex items-center gap-1 text-sm text-gray-500">
            <MapPin className="h-4 w-4" />
            <span>
              {pool?.address}, {pool?.city}, {pool?.state}, {pool?.zip}
            </span>
          </div>
        </DialogHeader>

        {service.status === 'Completed' ? (
          <>
            <Accordion type="single" collapsible defaultValue={hasPhotos() ? "photos" : "readings"} className="mt-4">
              {/* Service Photos Section - First and Default */}
              {hasPhotos() && (
                <AccordionItem value="photos">
                  <AccordionTrigger className="text-lg">
                    <div className="flex items-center gap-2">
                      <ImageIcon className="h-5 w-5 text-[#364D9D]" />
                      <span className="text-md">Service Photos</span>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent>
                    {service?.photosSnapshot ? (
                      // New structured photos
                      <div className="space-y-4">
                        {getPhotoGroups().map((group: any, groupIndex: number) => (
                          <Card key={groupIndex}>
                            <CardHeader>
                              <CardTitle className="text-lg">{group.name}</CardTitle>
                              {group.description && (
                                <p className="text-sm text-gray-600">{group.description}</p>
                              )}
                            </CardHeader>
                            <CardContent>
                              {group.photos.length > 0 ? (
                                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3">
                                  {group.photos.map((photo: any, photoIndex: number) => {
                                    const photoDefinition = group.photoDefinitions.find((def: any) => def.id === photo.photoDefinitionId);
                                    return (
                                      <div key={photoIndex} className="space-y-2">
                                        <div className="relative aspect-square overflow-hidden rounded-lg">
                                          <Image
                                            src={photo.url}
                                            alt={photoDefinition?.name || `Service photo ${photoIndex + 1}`}
                                            layout="fill"
                                            className="object-cover transition-transform hover:scale-105"
                                          />
                                        </div>
                                        {photoDefinition && (
                                          <p className="text-sm font-medium text-gray-700">{photoDefinition.name}</p>
                                        )}
                                        {photo.notes && (
                                          <p className="text-xs text-gray-500">{photo.notes}</p>
                                        )}
                                      </div>
                                    );
                                  })}
                                </div>
                              ) : (
                                <p className="text-sm text-gray-500">No photos available for this group.</p>
                              )}
                            </CardContent>
                          </Card>
                        ))}
                      </div>
                    ) : (
                      // Legacy photos
                      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3">
                        {getStructuredPhotos()?.map((photo: any, index: number) => (
                          <div key={index} className="relative aspect-square overflow-hidden rounded-lg">
                            <Image
                              src={photo.url}
                              alt={`Service photo ${index + 1}`}
                              layout="fill"
                              className="object-cover transition-transform hover:scale-105"
                            />
                          </div>
                        ))}
                      </div>
                    )}
                  </AccordionContent>
                </AccordionItem>
              )}

              {/* Readings Section */}
              {getReadingGroups().length > 0 && (
                <AccordionItem value="readings">
                  <AccordionTrigger className="text-lg">
                    <div className="flex items-center gap-2">
                      <Beaker className="h-5 w-5 text-[#364D9D]" />
                      <span className="text-md">Readings</span>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent>
                    <div className="space-y-4">
                      {getReadingGroups().map((group: any, groupIndex: number) => (
                        <Card key={groupIndex}>
                          <CardHeader>
                            <CardTitle className="text-lg">{group.name}</CardTitle>
                            {group.description && (
                              <p className="text-sm text-gray-600">{group.description}</p>
                            )}
                          </CardHeader>
                          <CardContent className="grid grid-cols-2 gap-4 sm:grid-cols-3">
                            {group.readings.length > 0 ? (
                              group.readings.map((reading: any, readingIndex: number) => {
                                // Find the reading definition from the group's readingDefinitions
                                const readingDefinition = group.readingDefinitions.find((def: any) => def.id === reading.readingDefinitionId);
                                return (
                                  <div key={readingIndex} className="rounded-lg bg-gray-50 p-3">
                                    <div className="text-sm text-gray-500">
                                      {readingDefinition?.name || reading.readingDefinitionId} 
                                      {readingDefinition?.unit && ` (${readingDefinition.unit})`}
                                    </div>
                                    <div className="text-lg font-semibold">{reading.value || 'N/A'}</div>
                                  </div>
                                );
                              })
                            ) : (
                              // Fallback for legacy structure
                              group.readingDefinitions?.map((def: any, defIndex: number) => {
                                const reading = group.readings.find((r: any) => r.readingDefinitionId === def.id);
                                return (
                                  <div key={defIndex} className="rounded-lg bg-gray-50 p-3">
                                    <div className="text-sm text-gray-500">
                                      {def.name} {def.unit && `(${def.unit})`}
                                    </div>
                                    <div className="text-lg font-semibold">{reading?.value || 'N/A'}</div>
                                  </div>
                                );
                              })
                            )}
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  </AccordionContent>
                </AccordionItem>
              )}

              {/* Consumables Section */}
              {getConsumableGroups().length > 0 && (
                <AccordionItem value="consumables">
                  <AccordionTrigger className="text-lg">
                    <div className="flex items-center gap-2">
                      <FlaskConical className="h-5 w-5 text-[#364D9D]" />
                      <span className="text-md">Consumables</span>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent>
                    <div className="space-y-4">
                      {getConsumableGroups().map((group: any, groupIndex: number) => (
                        <Card key={groupIndex}>
                          <CardHeader>
                            <CardTitle className="text-lg">{group.name}</CardTitle>
                            {group.description && (
                              <p className="text-sm text-gray-600">{group.description}</p>
                            )}
                          </CardHeader>
                          <CardContent className="grid grid-cols-2 gap-4 sm:grid-cols-3">
                            {group.consumables.length > 0 ? (
                              group.consumables.map((consumable: any, consumableIndex: number) => {
                                // Find the consumable definition from the group's consumableDefinitions
                                const consumableDefinition = group.consumableDefinitions.find((def: any) => def.id === consumable.consumableDefinitionId);
                                return (
                                  <div key={consumableIndex} className="rounded-lg bg-gray-50 p-3">
                                    <div className="text-sm text-gray-500">
                                      {consumableDefinition?.name || consumable.consumableDefinitionId}
                                      {consumableDefinition?.unit && ` (${consumableDefinition.unit})`}
                                    </div>
                                    <div className="text-lg font-semibold">
                                      {consumable.quantity ? `${consumable.quantity} ${consumableDefinition?.unit || ''}` : 'N/A'}
                                    </div>
                                  </div>
                                );
                              })
                            ) : (
                              // Fallback for legacy structure
                              group.consumableDefinitions?.map((def: any, defIndex: number) => {
                                const consumable = group.consumables.find((c: any) => c.consumableDefinitionId === def.id);
                                return (
                                  <div key={defIndex} className="rounded-lg bg-gray-50 p-3">
                                    <div className="text-sm text-gray-500">
                                      {def.name} {def.unit && `(${def.unit})`}
                                    </div>
                                    <div className="text-lg font-semibold">
                                      {consumable?.quantity ? `${consumable.quantity} ${def.unit || ''}` : 'N/A'}
                                    </div>
                                  </div>
                                );
                              })
                            )}
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  </AccordionContent>
                </AccordionItem>
              )}

              {/* Checklist Section */}
              {getChecklistItems().length > 0 && (
                <AccordionItem value="checklist">
                  <AccordionTrigger className="text-lg">
                    <div className="flex items-center gap-2">
                      <ListChecks className="h-5 w-5 text-[#364D9D]" />
                      <span className="text-md">Service Checklist</span>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent>
                    <Card>
                      <CardContent className="grid grid-cols-1 gap-2 p-4 sm:grid-cols-2">
                        {getChecklistItems().map((item: any, index: number) => (
                          <div key={index} className="flex items-center justify-between rounded-lg bg-gray-50 p-3">
                            <span className="text-gray-700">{item.label || item.name}</span>
                            {item.completed ? (
                              <CheckCircleIcon className="h-5 w-5 text-green-600" />
                            ) : (
                              <XCircleIcon className="h-5 w-5 text-red-600" />
                            )}
                          </div>
                        ))}
                      </CardContent>
                    </Card>
                  </AccordionContent>
                </AccordionItem>
              )}

            </Accordion>

            {/* Actions */}
            <div className="mt-6 flex justify-center gap-3">
              <Button
                onClick={handleResendEmail}
                variant="outline"
                className="flex items-center gap-2"
                disabled={resendEmailMutation.isPending}
              >
                <Mail className="h-4 w-4" />
                {resendEmailMutation.isPending ? 'Sending...' : 'Resend Email'}
              </Button>

              {hasPhotos() && (
                <Button
                  onClick={async () => {
                    try {
                      const photosForDownload = getPhotosForDownload();
                      const zipContent = await zipImages(photosForDownload);
                      const url = URL.createObjectURL(zipContent);
                      const link = document.createElement('a');
                      link.href = url;
                      link.download = 'service-photos.zip';
                      link.click();
                      URL.revokeObjectURL(url);
                    } catch (error) {
                      console.error('Error downloading photos:', error);
                      alert('Failed to download photos. Please try again.');
                    }
                  }}
                  variant="outline"
                  className="flex items-center gap-2"
                >
                  <Download className="h-4 w-4" />
                  Download Photos
                </Button>
              )}

              <DeleteServiceDialog
                serviceId={service.id}
                assignmentId={service.assignmentId}
                clientId={pool.clientOwnerId}
                onSuccess={() => setOpen(false)}
                trigger={
                  <Button variant="destructive" className="flex items-center gap-2">
                    <Trash2 className="h-4 w-4" />
                    Delete Service
                  </Button>
                }
              />
            </div>
          </>
        ) : (
          <div className="flex h-40 items-center justify-center text-lg text-gray-500">
            {getStatusMessage(service.status)}
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
