import { useQueryClient } from '@tanstack/react-query';
import { Camera } from 'lucide-react';
import { useState, useRef } from 'react';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { getInitials } from '@/utils/others';
import { Separator } from '../../../components/ui/separator';
import { useEditCompanyLogo } from '@/hooks/react-query/companies/updateCompanyLogo';
import AvatarEditor from 'react-avatar-editor';

import DropdownMenuCompany from './DropdownMenuCompany';
import { Slider } from '@/components/ui/slider';

type Props = {
  companyId: string;
  name: string;
  email: string;
  phone: string;
  role?: string;
  status: string;
  imageUrl?: string | null;
};

export function CompanyCard({ companyId, name, email, phone, role, status, imageUrl }: Props) {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [zoom, setZoom] = useState(1);
  const editorRef = useRef<AvatarEditor>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { handleSubmit, isPending } = useEditCompanyLogo();

  const canEditLogo = role === 'Owner' || role === 'Admin' || role === 'Office';
  const isPendingAcceptance = status !== 'Active';

  const handleImageSelect = () => {
    if (!canEditLogo) return;
    fileInputRef.current?.click();
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file && canEditLogo) {
      setSelectedImage(file);
      setIsOpen(true);
    }
  };

  const handleSave = async () => {
    if (editorRef.current && selectedImage) {
      const canvas = editorRef.current.getImageScaledToCanvas();
      canvas.toBlob((blob) => {
        if (blob) {
          const file = new File([blob], selectedImage.name, { type: 'image/png' });
          handleSubmit({
            companyId,
            logo: file
          });
          setIsOpen(false);
          setSelectedImage(null);
        }
      }, 'image/png');
    }
  };

  return (
    <div className="relative inline-flex w-96 flex-col items-center justify-start gap-4 rounded-lg border border-zinc-200 bg-white p-4 md:w-56 px-2">
      {/* Pending Acceptance Strip */}
      {isPendingAcceptance && (
        <div className="absolute -top-0 left-0 rounded-tl-lg bg-yellow-500 px-3 py-1 text-center text-xs font-medium text-white">
          Pending Acceptance
        </div>
      )}
      
      {companyId ? <DropdownMenuCompany companyId={companyId} /> : null}
      <div className="flex h-[138px] flex-col items-center justify-start gap-4 self-stretch mt-2">
        <div className={`relative ${canEditLogo ? 'group cursor-pointer' : ''}`} onClick={handleImageSelect}>
          <Avatar className="size-24">
            <AvatarImage src={imageUrl || ''} alt={`${name} logo`} />
            <AvatarFallback className="text-2xl">{getInitials(name)}</AvatarFallback>
          </Avatar>
          {canEditLogo && (
            <div className="absolute inset-0 flex items-center justify-center rounded-full bg-black/50 opacity-0 transition-opacity group-hover:opacity-100">
              <Camera className="size-8 text-white" />
            </div>
          )}
          {canEditLogo && (
            <input type="file" ref={fileInputRef} className="hidden" accept="image/*" onChange={handleFileChange} />
          )}
        </div>
        <div className="flex h-[42px] flex-col items-center justify-center gap-1 self-stretch">
          <div className="self-stretch text-center text-sm font-semibold text-gray-800">{name}</div>
        </div>
      </div>

      {canEditLogo && (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Update Company Logo</DialogTitle>
            </DialogHeader>
            <div className="flex flex-col items-center gap-4">
              {selectedImage && (
                <>
                  <div className="rounded-lg border p-2">
                    <AvatarEditor
                      ref={editorRef}
                      image={selectedImage}
                      width={250}
                      height={250}
                      border={0}
                      borderRadius={125}
                      color={[0, 0, 0, 0.6]}
                      scale={zoom}
                    />
                  </div>
                  <div className="w-full px-4">
                    <p className="mb-2 text-sm text-gray-500">Zoom</p>
                    <Slider value={[zoom]} onValueChange={(value) => setZoom(value[0])} min={1} max={3} step={0.1} />
                  </div>
                </>
              )}
              <div className="flex w-full justify-end gap-2">
                <Button variant="outline" onClick={() => setIsOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={handleSave} disabled={isPending}>
                  {isPending ? 'Updating...' : 'Update Logo'}
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      )}

      <Separator />
      <div className="flex h-[52px] flex-col items-center justify-center gap-2.5 self-stretch">
        {role && (
          <div className="inline-flex items-center justify-start gap-1 self-stretch">
            <div className="w-14 text-xs font-normal leading-[18px] text-gray-500">My role</div>
            <div className="h-[18px] w-fit max-w-36 shrink grow basis-0 overflow-hidden text-ellipsis text-right text-xs font-medium leading-[18px] text-gray-400">
              {role}
            </div>
          </div>
        )}
        <div className="inline-flex items-center justify-start gap-1 self-stretch">
          <div className="w-14 text-xs font-normal leading-[18px] text-gray-500">E-mail</div>
          <div className="h-[18px] w-fit max-w-36 shrink grow basis-0 overflow-hidden text-ellipsis text-right text-xs font-medium leading-[18px] text-gray-400">
            {email}
          </div>
        </div>
        <div className="inline-flex items-center justify-start gap-1 self-stretch">
          <div className="w-14 text-xs font-normal leading-[18px] text-gray-500">Phone</div>
          <div className="shrink grow basis-0 text-right text-xs font-medium leading-[18px] text-gray-400">{phone}</div>
        </div>
      </div>
    </div>
  );
}
