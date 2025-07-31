import JSZip from 'jszip';

export async function zipImages(imageUrls: string[]): Promise<Blob> {
  const zip = new JSZip();
  
  for (let i = 0; i < imageUrls.length; i++) {
    try {
      // Use the proxy API route instead of direct S3 URLs
      const proxyUrl = `/api/proxy-image?url=${encodeURIComponent(imageUrls[i])}`;
      const response = await fetch(proxyUrl);
      
      if (!response.ok) {
        throw new Error(`Failed to fetch image ${i + 1}`);
      }
      
      const blob = await response.blob();
      const fileName = `photo_${i + 1}.jpg`;
      zip.file(fileName, blob);
    } catch (error) {
      console.error(`Error processing image ${i + 1}:`, error);
      // Continue with other images even if one fails
    }
  }
  
  return await zip.generateAsync({ type: 'blob' });
}
