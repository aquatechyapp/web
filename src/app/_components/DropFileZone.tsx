import Dropzone from '@/components/ui/dropzone';
import {
  FormControl,
  FormField,
  FormItem,
  FormMessage
} from '@/components/ui/form';

export function DropFileZone({ form }) {
  function handleOnDrop(acceptedFiles: FileList | null) {
    if (acceptedFiles && acceptedFiles.length > 0) {
      const allowedTypes = [
        { types: ['image/jpg', 'image/jpeg', 'image/png'] }
      ];
      const fileType = allowedTypes.find((allowedType) =>
        allowedType.types.find((type) => type === acceptedFiles[0].type)
      );
      if (!fileType) {
        form.setValue('photos', null);
        form.setError('photos', {
          message: 'File type is not valid',
          type: 'typeError'
        });
      } else {
        form.setValue('photos', acceptedFiles[0]);
        form.clearErrors('photos');
      }
    } else {
      form.setValue('photos', null);
      form.setError('photos', {
        message: 'File is required',
        type: 'typeError'
      });
    }
  }
  return (
    <FormField
      control={form.control}
      name="photos"
      render={({ field }) => (
        <FormItem className="w-full">
          <FormControl>
            <Dropzone
              {...field}
              dropMessage="Drop files or click here"
              handleOnDrop={handleOnDrop}
              accept=".jpg, .jpeg, .png, .svg, .gif, .mp4"
            />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}
