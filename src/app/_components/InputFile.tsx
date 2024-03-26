import { Button } from '@/app/_components/ui/button';
import { useEffect, useState } from 'react';
import { FaRegImages } from 'react-icons/fa';
import { MdDeleteOutline } from 'react-icons/md';
import ImageUploading, { ImageListType } from 'react-images-uploading';

export function InputFile({
  handleChange,
  defaultPhotos = [],
  disabled = false
}) {
  const [images, setImages] = useState(defaultPhotos);
  const maxNumber = 4;

  const onChange = (
    imageList: ImageListType,
    addUpdateIndex: number[] | undefined
  ) => {
    setImages(imageList as never[]);
  };

  useEffect(() => {
    handleChange(images);
  }, [images.length]);

  return (
    <div className="w-full h-full">
      <ImageUploading
        multiple
        value={images}
        onChange={onChange}
        maxNumber={maxNumber}
      >
        {({
          imageList,
          onImageUpload,
          onImageRemoveAll,
          onImageUpdate,
          onImageRemove,
          isDragging,
          dragProps
        }) => (
          // write your building UI
          <div className="h-full flex flex-col items-center justify-evenly border-stone-300 border border-dashed rounded">
            {imageList.length === 0 && (
              <div className="bg-stone-200 rounded-full p-3">
                <FaRegImages size={22} />
              </div>
            )}
            {/* <button onClick={onImageRemoveAll}>Remove all images</button> */}
            <div className="flex gap-8 ">
              {imageList.map((image, index) => (
                <div key={index} className="mt-2 px-2 relative group">
                  <img
                    src={image.dataURL}
                    alt=""
                    className="w-24 h-24  rounded-md object-cover"
                  />
                  {!disabled && (
                    <Button
                      size={'sm'}
                      className="px-1 h-6 -top-1 -right-3 absolute hidden group-hover:block"
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
