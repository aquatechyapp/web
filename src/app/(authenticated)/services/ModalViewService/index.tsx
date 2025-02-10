'use client';

import { CheckCircleIcon, ListChecks, XCircleIcon } from 'lucide-react';
import Image from 'next/image';

import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogTitle } from '@/components/ui/dialog';
import { zipImages } from '@/lib/js-zip';
import { format } from 'date-fns';

type Props = {
  request: any;
  open: boolean;
  setOpen: (open: boolean) => void;
};

export function ModalViewService({ request, open, setOpen }: Props) {
  console.log('request', request);

  // Map para transformar o checklist do request em um array
  const checklistItems = [
    { name: 'Skimmer cleaned', completed: request?.checklistSkimmer },
    { name: 'Tiles brushed', completed: request?.checklistTilesBrushed },
    { name: 'Baskets cleaned', completed: request?.checklistPumpBasket },
    { name: 'Filter washed', completed: request?.checklistFilterWashed },
    { name: 'Water tested', completed: request?.checklistWaterTested },
    { name: 'Pool vacuumed', completed: request?.checklistPoolVacuumed }
  ];

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="max-h-[90vh] max-w-4xl overflow-y-auto p-6">
        <div>
          <div className="flex">
            <ListChecks className="mr-2" />
            <DialogTitle className="text-lg font-semibold">
              {`${request?.completedAt ? format(new Date(request.completedAt), "EEEE, MMMM do 'at' h:mm a") : 'Unknown'}. (made by ${request?.completedByUser?.firstName || 'Unknown'} ${request?.completedByUser?.lastName || 'Unknown'})`}
            </DialogTitle>
          </div>
          <p className="text-sm text-gray-500">
            {request.pool.address}, {request.pool.city}, {request.pool.state}, {request.pool.zip}
          </p>
        </div>

        {/* Chemical Readings and Checklist */}
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <div>
            <h2 className="text-center text-lg font-bold text-gray-700">Chemical readings</h2>
            <table className="w-full text-sm">
              <tbody>
                <tr className="border-b">
                  <td className="py-2 pr-4 text-gray-700">Chlorine</td>
                  <td className="py-2 text-right text-gray-700">{request.chlorine || 'N/A'}</td>
                </tr>
                <tr className="border-b">
                  <td className="py-2 pr-4 text-gray-700">P.H</td>
                  <td className="py-2 text-right text-gray-700">{request.ph || 'N/A'}</td>
                </tr>
                <tr className="border-b">
                  <td className="py-2 pr-4 text-gray-700">Salt</td>
                  <td className="py-2 text-right text-gray-700">{request.salt || 'N/A'}</td>
                </tr>
                <tr className="border-b">
                  <td className="py-2 pr-4 text-gray-700">Alkalinity</td>
                  <td className="py-2 text-right text-gray-700">{request.alkalinity || 'N/A'}</td>
                </tr>
                <tr className="border-b">
                  <td className="py-2 pr-4 text-gray-700">Cyan. Acid</td>
                  <td className="py-2 text-right text-gray-700">{request.cyanAcid || 'N/A'}</td>
                </tr>
                <tr className="border-b">
                  <td className="py-2 pr-4 text-gray-700">Calcium</td>
                  <td className="py-2 text-right text-gray-700">{request.calcium || 'N/A'}</td>
                </tr>
              </tbody>
            </table>
          </div>
          <div>
            <h2 className="text-center text-lg font-bold text-gray-700">Chemicals spent</h2>
            <table className="w-full text-sm">
              <tbody>
                <tr className="border-b">
                  <td className="py-2 pr-4 text-gray-700">Liquid Chlorine (gallon)</td>
                  <td className="py-2 text-right text-gray-700">{request?.chlorineSpent || 'N/A'}</td>
                </tr>
                <tr className="border-b">
                  <td className="py-2 pr-4 text-gray-700">Muriatic Acid (gallon)</td>
                  <td className="py-2 text-right text-gray-700">{request?.acidSpent || 'N/A'}</td>
                </tr>
                <tr className="border-b">
                  <td className="py-2 pr-4 text-gray-700">Salt (bags)</td>
                  <td className="py-2 text-right text-gray-700">{request?.saltSpent || 'N/A'}</td>
                </tr>
                <tr className="border-b">
                  <td className="py-2 pr-4 text-gray-700">Shock</td>
                  <td className="py-2 text-right text-gray-700">{request?.shockSpent || 'N/A'}</td>
                </tr>
                <tr className="border-b">
                  <td className="py-2 pr-4 text-gray-700">Tablet</td>
                  <td className="py-2 text-right text-gray-700">{request?.tabletSpent || 'N/A'}</td>
                </tr>
                <tr className="border-b">
                  <td className="py-2 pr-4 text-gray-700">Phosphate Remover (gallon)</td>
                  <td className="py-2 text-right text-gray-700">{request?.phosphateSpent || 'N/A'}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* Photos */}
        {request?.photos.length > 0 && (
          <div>
            <div className="grid grid-cols-1 gap-2 sm:grid-cols-2 md:grid-cols-3">
              {request?.photos?.map((photo: string, index: number) => (
                <div key={index} className="relative aspect-square">
                  <Image src={photo} alt={`Photo ${index + 1}`} layout="fill" className="rounded object-cover" />
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Chemicals Spent */}
        <div className="mx-auto w-full md:w-1/2">
          <h2 className="text-center text-lg font-bold text-gray-700">Checklist</h2>
          <table className="w-full text-sm">
            <tbody>
              {checklistItems.map((item, index) => (
                <tr key={index} className="flex items-center justify-between border-b">
                  <td className="py-2 pr-4 text-gray-700">{item.name}</td>
                  {item.completed ? (
                    <CheckCircleIcon className="border-1 h-5 w-5 rounded-full border-gray-700 text-gray-700" />
                  ) : (
                    <XCircleIcon className="border-1 h-5 w-5 rounded-full border-gray-700 text-gray-700" />
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Actions */}
        <div className="mt-6 flex flex-col justify-end gap-4 md:flex-row">
          <Button variant="outline" className="w-full" type="submit">
            Send e-mail
          </Button>
          <Button className="w-full" type="submit">
            Download report
          </Button>
          {request?.photos.length > 0 && (
            <Button
              onClick={() => {
                zipImages(request.photos).then((zipContent) => {
                  const url = URL.createObjectURL(zipContent);
                  const link = document.createElement('a');
                  link.href = url;
                  link.download = 'images.zip';
                  link.click();
                  URL.revokeObjectURL(url);
                });
              }}
              variant="outline"
              className="w-full"
            >
              Download photos
            </Button>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
