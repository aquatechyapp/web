import JSZip from 'jszip';

export function zipImages(imageUrls: string[]): Promise<Blob> {
  return new Promise((resolve, reject) => {
    const zip = new JSZip();
    const promises = [] as Promise<void>[];

    imageUrls.forEach((url, index) => {
      const filename = `image_${index}.jpg`;
      promises.push(
        fetch(url)
          .then((response) => response.blob())
          .then((blob) => {
            zip.file(filename, blob);
          })
      );
    });

    Promise.all(promises)
      .then(() => {
        zip.generateAsync({ type: 'blob' }).then((content) => resolve(content));
      })
      .catch((error) => reject(error));
  });
}
