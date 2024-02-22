import { Button } from '@/components/ui/button';
import { useEffect, useState } from 'react';
import { MdDeleteOutline } from 'react-icons/md';
import ImageUploading, { ImageListType } from 'react-images-uploading';

export function InputFile({ handleChange, defaultPhotos = [] }) {
  const [images, setImages] = useState(defaultPhotos);
  const maxNumber = 5;

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
          <div className="h-full flex flex-col items-center justify-center border-stone-300 border border-dashed rounded">
            <Button
              className="w-40 bg-stone-200"
              variant={'ghost'}
              style={isDragging ? { color: 'red' } : undefined}
              onClick={onImageUpload}
              {...dragProps}
            >
              Add images
            </Button>
            &nbsp;
            {/* <button onClick={onImageRemoveAll}>Remove all images</button> */}
            <div className="flex gap-8">
              {imageList.map((image, index) => (
                <div key={index} className="mt-2 relative">
                  <img
                    src={image.dataURL}
                    alt=""
                    className="w-14 h-24 object-contain"
                  />
                  <Button
                    variant={'destructive'}
                    onClick={() => onImageRemove(index)}
                    className="px-1 h-6 -top-1 -right-3 absolute"
                  >
                    <MdDeleteOutline className="cursor-pointer" />
                  </Button>
                </div>
              ))}
            </div>
          </div>
        )}
      </ImageUploading>
    </div>
  );
}
