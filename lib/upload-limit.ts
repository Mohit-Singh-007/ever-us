export const MAX_UPLOAD_BYTES = 10 * 1024 * 1024; // 10MB
 
export function validateUploadFile(file: File): string | null {
  if (!file.type.startsWith("image/")) {
    return "Please choose an image file.";
  }
  if (file.size > MAX_UPLOAD_BYTES) {
    const mb = (file.size / (1024 * 1024)).toFixed(1);
    return `That image is ${mb}MB — please choose one under 10MB.`;
  }
  return null;
}
 