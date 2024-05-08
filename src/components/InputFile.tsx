import { useEffect, useState } from 'react';
import { FaRegImages } from 'react-icons/fa';
import { MdDeleteOutline } from 'react-icons/md';
import ImageUploading, { ImageListType } from 'react-images-uploading';

import { Button } from './ui/button';

export function InputFile({ handleChange, defaultPhotos = [], disabled = false }) {
  const [images, setImages] = useState(defaultPhotos);
  const maxNumber = 4;

  const onChange = (imageList: ImageListType, addUpdateIndex: number[] | undefined) => {
    setImages(imageList as never[]);
  };

  useEffect(() => {
    handleChange(images);
  }, [images.length]);

  return (
    <div className="h-full w-full">
      <ImageUploading multiple value={images} onChange={onChange} maxNumber={maxNumber}>
        {({ imageList, onImageUpload, onImageRemoveAll, onImageUpdate, onImageRemove, isDragging, dragProps }) => (
          // write your building UI
          <div className="flex h-full flex-col items-center justify-evenly rounded border border-dashed border-stone-300">
            {imageList.length === 0 && (
              <div className="rounded-full bg-stone-200 p-3">
                <FaRegImages size={22} />
              </div>
            )}
            {/* <button onClick={onImageRemoveAll}>Remove all images</button> */}
            <div className="flex gap-8 ">
              {imageList.map((image, index) => (
                <div key={index} className="group relative mt-2 px-2">
                  <img src={image.dataURL} alt="" className="h-24 w-24  rounded-md object-cover" />
                  {!disabled && (
                    <Button
                      size={'sm'}
                      className="absolute -right-3 -top-1 hidden h-6 px-1 group-hover:block"
                      variant={'destructive'}
                      onClick={() => onImageRemove(index)}
                      disabled={disabled}
                    >
                      <MdDeleteOutline size={18} className="cursor-pointer" />
                    </Button>
                  )}
                </div>
              ))}
            </div>
            {!disabled && (
              <Button
                type="button"
                className="w-40 bg-stone-200"
                variant={'ghost'}
                style={isDragging ? { color: 'red' } : undefined}
                onClick={onImageUpload}
                {...dragProps}
                disabled={disabled}
              >
                Add images
              </Button>
            )}
          </div>
        )}
      </ImageUploading>
    </div>
  );
}
