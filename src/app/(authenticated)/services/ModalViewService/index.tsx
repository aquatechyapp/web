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
  MapPin
} from 'lucide-react';
import Image from 'next/image';

import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Card, CardContent } from '@/components/ui/card';
import { zipImages } from '@/lib/js-zip';
import { format } from 'date-fns';
import { Service } from '@/ts/interfaces/Service';

type Props = {
  service: Service;
  open: boolean;
  setOpen: (open: boolean) => void;
};

export function ModalViewService({ service, open, setOpen }: Props) {
  const checklistItems = [
    { name: 'Skimmer cleaned', completed: service?.checklist?.skimmerCleaned },
    { name: 'Tiles brushed', completed: service?.checklist?.tilesBrushed },
    { name: 'Baskets cleaned', completed: service?.checklist?.pumpBasketCleaned },
    { name: 'Filter washed', completed: service?.checklist?.filterWashed },
    { name: 'Water tested', completed: service?.checklist?.chemicalsAdjusted },
    { name: 'Pool vacuumed', completed: service?.checklist?.poolVacuumed }
  ];

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="max-h-[90vh] max-w-4xl overflow-y-auto p-6">
        <DialogHeader>
          <div className="flex items-center gap-2">
            <ListChecks className="h-6 w-6 text-blue-600" />
            <DialogTitle className="text-xl font-semibold">Service Report</DialogTitle>
          </div>

          <div className="mt-2 flex items-center gap-2 text-sm text-gray-500">
            <div className="flex-1">
              {format(new Date(service?.completedAt || new Date()), "EEEE, MMMM do 'at' h:mm a")}
              <span className="ml-1 font-medium">
                by {service?.completedByUser?.firstName || ''} {service?.completedByUser?.lastName || ''}
              </span>
            </div>
          </div>

          <div className="mt-1 flex items-center gap-1 text-sm text-gray-500">
            <MapPin className="h-4 w-4" />
            <span>
              {service?.pool?.address}, {service?.pool?.city}, {service?.pool?.state}, {service?.pool?.zip}
            </span>
          </div>
        </DialogHeader>

        <Accordion type="single" collapsible defaultValue="readings" className="mt-4">
          {/* Chemical Readings Section */}
          <AccordionItem value="readings">
            <AccordionTrigger className="text-lg">
              <div className="flex items-center gap-2">
                <Beaker className="h-5 w-5 text-blue-600" />
                Chemical Readings
              </div>
            </AccordionTrigger>
            <AccordionContent>
              <Card>
                <CardContent className="grid grid-cols-2 gap-4 p-4 sm:grid-cols-3">
                  {[
                    { label: 'Chlorine (ppm)', value: service?.chemicalsReading?.chlorine },
                    { label: 'P.H', value: service?.chemicalsReading?.ph },
                    { label: 'Salt (ppm)', value: service?.chemicalsReading?.salt },
                    { label: 'Alkalinity (ppm)', value: service?.chemicalsReading?.alkalinity },
                    { label: 'Cyan. Acid (ppm)', value: service?.chemicalsReading?.cyanuricAcid },
                    { label: 'Calcium (ppm)', value: service?.chemicalsReading?.hardness }
                  ].map((item, index) => (
                    <div key={index} className="rounded-lg bg-gray-50 p-3">
                      <div className="text-sm text-gray-500">{item.label}</div>
                      <div className="text-lg font-semibold">{item.value || 'N/A'}</div>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </AccordionContent>
          </AccordionItem>

          {/* Chemicals Spent Section */}
          <AccordionItem value="spent">
            <AccordionTrigger className="text-lg">
              <div className="flex items-center gap-2">
                <FlaskConical className="h-5 w-5 text-blue-600" />
                Chemicals Spent
              </div>
            </AccordionTrigger>
            <AccordionContent>
              <Card>
                <CardContent className="grid grid-cols-2 gap-4 p-4 sm:grid-cols-3">
                  {[
                    {
                      label: 'Liquid Chlorine (gallon)',
                      value: service?.chemicalsSpent?.liquidChlorine,
                      unit: 'gallon'
                    },
                    { label: 'Muriatic Acid (gallon)', value: service?.chemicalsSpent?.muriaticAcid, unit: 'gallon' },
                    { label: 'Salt (lb)', value: service?.chemicalsSpent?.salt, unit: 'lb' },
                    { label: 'Shock (oz)', value: service?.chemicalsSpent?.shock, unit: 'oz' },
                    { label: 'Tablet (unit)', value: service?.chemicalsSpent?.tablet, unit: 'unit' },
                    { label: 'Phosphate Remover (oz)', value: service?.chemicalsSpent?.phosphateRemover, unit: 'oz' }
                  ].map((item, index) => (
                    <div key={index} className="rounded-lg bg-gray-50 p-3">
                      <div className="text-sm text-gray-500">{item.label}</div>
                      <div className="text-lg font-semibold">{item.value ? `${item.value} ${item.unit}` : 'N/A'}</div>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </AccordionContent>
          </AccordionItem>

          {/* Checklist Section */}
          <AccordionItem value="checklist">
            <AccordionTrigger className="text-lg">
              <div className="flex items-center gap-2">
                <ListChecks className="h-5 w-5 text-blue-600" />
                Service Checklist
              </div>
            </AccordionTrigger>
            <AccordionContent>
              <Card>
                <CardContent className="grid grid-cols-1 gap-2 p-4 sm:grid-cols-2">
                  {checklistItems.map((item, index) => (
                    <div key={index} className="flex items-center justify-between rounded-lg bg-gray-50 p-3">
                      <span className="text-gray-700">{item.name}</span>
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

          {/* Photos Section */}
          {service?.photos.length > 0 && (
            <AccordionItem value="photos">
              <AccordionTrigger className="text-lg">
                <div className="flex items-center gap-2">
                  <ImageIcon className="h-5 w-5 text-blue-600" />
                  Service Photos
                </div>
              </AccordionTrigger>
              <AccordionContent>
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3">
                  {service.photos.map((photo: string, index: number) => (
                    <div key={index} className="relative aspect-square overflow-hidden rounded-lg">
                      <Image
                        src={photo}
                        alt={`Service photo ${index + 1}`}
                        layout="fill"
                        className="object-cover transition-transform hover:scale-105"
                      />
                    </div>
                  ))}
                </div>
              </AccordionContent>
            </AccordionItem>
          )}
        </Accordion>

        {/* Actions */}
        {/* <div className="mt-6 flex flex-col justify-end gap-3 sm:flex-row">
          <Button variant="outline" className="flex-1" type="submit">
            <Mail className="mr-2 h-4 w-4" />
            Send Report
          </Button>

          {service?.photos.length > 0 && (
            <Button
              onClick={() => {
                zipImages(service.photos).then((zipContent) => {
                  const url = URL.createObjectURL(zipContent);
                  const link = document.createElement('a');
                  link.href = url;
                  link.download = 'service-photos.zip';
                  link.click();
                  URL.revokeObjectURL(url);
                });
              }}
              variant="outline"
              className="flex-1"
            >
              <Download className="mr-2 h-4 w-4" />
              Download Photos
            </Button>
          )}
        </div> */}
      </DialogContent>
    </Dialog>
  );
}
