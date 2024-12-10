'use client';

import { CheckCircleIcon, ListChecks, XCircleIcon } from 'lucide-react';
import Image from 'next/image';

import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogTitle } from '@/components/ui/dialog';

type Props = {
  request: any;
  open: boolean;
  setOpen: (open: boolean) => void;
};

export function ModalEditRequest({ request, open, setOpen }: Props) {
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
              {`${request?.createdAt || 'Unknown'}. (made by ${request?.doneByUser?.firstName || 'Unknown'} ${request?.doneByUser?.lastName || 'Unknown'})`}
            </DialogTitle>
          </div>
          <p className="text-sm text-gray-500">
            {request.pool.zip}, {request.pool.state}, {request.pool.city}, {request.pool.address}
          </p>
        </div>

        {/* Chemical Readings and Checklist */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <h2 className="text-center text-lg font-bold text-gray-700">Chemical readings</h2>
            <table className="w-full text-sm">
              <tbody>
                <tr className="border-b">
                  <td className="py-2 pr-4 text-gray-700">Chlorine</td>
                  <td className="py-2 pr-4 text-gray-700">{request.chlorine}</td>
                </tr>
                <tr className="border-b">
                  <td className="py-2 pr-4 text-gray-700">P.H</td>
                  <td className="py-2 pr-4 text-gray-700">{request.ph}</td>
                </tr>
                <tr className="border-b">
                  <td className="py-2 pr-4 text-gray-700">Salt</td>
                  <td className="py-2 pr-4 text-gray-700">{request.salt}</td>
                </tr>
                <tr className="border-b">
                  <td className="py-2 pr-4 text-gray-700">Alkalinity</td>
                  <td className="py-2 pr-4 text-gray-700">{request.alkalinity}</td>
                </tr>
                <tr className="border-b">
                  <td className="py-2 pr-4 text-gray-700">Cyan. Acid</td>
                  <td className="py-2 pr-4 text-gray-700">{request.cyanAcid}</td>
                </tr>
                <tr className="border-b">
                  <td className="py-2 pr-4 text-gray-700">Calcium</td>
                  <td className="py-2 pr-4 text-gray-700">{request.calcium}</td>
                </tr>
              </tbody>
            </table>
          </div>
          <div>
            <h2 className="text-center text-lg font-bold text-gray-700">Checklist</h2>
            <table className="w-full text-sm">
              <tbody>
                {checklistItems.map((item, index) => (
                  <tr key={index} className="border-b">
                    <td className="py-2 pr-4 text-gray-700">{item.name}</td>
                    {item.completed ? (
                      <CheckCircleIcon className="h-5 w-5 text-gray-700" />
                    ) : (
                      <XCircleIcon className="h-5 w-5 text-gray-700" />
                    )}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Photos */}
        {request?.photos.length > 0 && (
          <div>
            {/* <h2 className="text-center text-lg font-bold text-gray-700">Photos</h2> */}
            <div className="grid grid-cols-3 gap-2">
              {request?.photos?.map((photo: string, index: number) => (
                <div key={index} className="relative aspect-square">
                  <Image src={photo} alt={`Photo ${index + 1}`} layout="fill" className="rounded object-cover" />
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Chemicals Spent */}
        <div>
          <h2 className="text-center text-lg font-bold text-gray-700">Chemicals spent</h2>
          <table className="w-full text-sm">
            <tbody>
              <tr className="border-b">
                <td className="py-2 pr-4 text-gray-700">Liquid Chlorine (gallon)</td>
                <td className="py-2 text-gray-700">{request?.chlorineSpent || 'N/A'}</td>
              </tr>
              <tr className="border-b">
                <td className="py-2 pr-4 text-gray-700">Muriatic Acid (gallon)</td>
                <td className="py-2 text-gray-700">{request?.acidSpent || 'N/A'}</td>
              </tr>
              <tr className="border-b">
                <td className="py-2 pr-4 text-gray-700">Salt (bags)</td>
                <td className="py-2 text-gray-700">{request?.saltSpent || 'N/A'}</td>
              </tr>
              <tr className="border-b">
                <td className="py-2 pr-4 text-gray-700">Shock</td>
                <td className="py-2 text-gray-700">{request?.shockSpent || 'N/A'}</td>
              </tr>
              <tr className="border-b">
                <td className="py-2 pr-4 text-gray-700">Tablet</td>

                <td className="py-2 text-gray-700">{request?.tabletSpent || 'N/A'}</td>
              </tr>
              <tr className="border-b">
                <td className="py-2 pr-4 text-gray-700">Phosphate Remover (gallon)</td>
                <td className="py-2 text-gray-700">{request?.phosphateSpent || 'N/A'}</td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* Actions */}
        <div className="mt-6 flex justify-end gap-4">
          <Button variant="outline" className="w-full" type="submit">
            Send e-mail
          </Button>
          <Button className="w-full" type="submit">
            Download report
          </Button>
          {request?.photos.length > 0 && (
            <Button variant="outline" className="w-full" type="submit">
              Download photos
            </Button>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
