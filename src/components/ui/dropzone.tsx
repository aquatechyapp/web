import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';
import React, { ChangeEvent, useRef } from 'react';
import { FaRegImages } from 'react-icons/fa';
import { Button } from './button';

interface DropzoneProps
  extends Omit<
    React.InputHTMLAttributes<HTMLInputElement>,
    'value' | 'onChange'
  > {
  classNameWrapper?: string;
  className?: string;
  handleOnDrop: (acceptedFiles: FileList | null) => void;
}

const Dropzone = React.forwardRef<HTMLDivElement, DropzoneProps>(
  ({ className, classNameWrapper, handleOnDrop, ...props }, ref) => {
    const inputRef = useRef<HTMLInputElement | null>(null);
    // Function to handle drag over event
    const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
      e.preventDefault();
      e.stopPropagation();
      handleOnDrop(null);
    };

    // Function to handle drop event
    const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
      e.preventDefault();
      e.stopPropagation();
      const { files } = e.dataTransfer;
      if (inputRef.current) {
        inputRef.current.files = files;
        handleOnDrop(files);
      }
    };

    // Function to simulate a click on the file input element
    const handleButtonClick = () => {
      if (inputRef.current) {
        inputRef.current.click();
      }
    };
    return (
      <Card
        ref={ref}
        className={cn(
          `self-stretch h-44 px-3 py-6 rounded-lg border border-zinc-200 flex-col justify-center items-center gap-4 flex`,
          classNameWrapper
        )}
      >
        <CardContent
          className="flex flex-col items-center justify-center space-y-2 px-2 py-4 text-xs"
          onDragOver={handleDragOver}
          onDrop={handleDrop}
          onClick={handleButtonClick}
        >
          <div className="flex flex-col items-center justify-center text-muted-foreground gap-4">
            <div className="w-9 h-9 p-2 bg-indigo-50 rounded-[100px] justify-center items-center gap-2 inline-flex">
              <FaRegImages />
            </div>
            <span className=" text-center text-gray-400 text-sm font-normal leading-tight tracking-tight">
              Drag and drop locations image here, or click add images
            </span>
            <Button
              variant="secondary"
              className="h-10 px-3.5 py-2.5 rounded-lg justify-center items-center gap-2 inline-flex"
            >
              Add images
            </Button>
            <Input
              {...props}
              value={undefined}
              ref={inputRef}
              type="file"
              className={cn('hidden', className)}
              onChange={(e: ChangeEvent<HTMLInputElement>) =>
                handleOnDrop(e.target.files)
              }
            />
          </div>
        </CardContent>
      </Card>
    );
  }
);

export default Dropzone;
