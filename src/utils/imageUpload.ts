// ============================================
// Image Upload Utility — ISOGASPUL
// Using InsForge SDK for reliable uploads
// ============================================

import { createClient } from '@insforge/sdk';

const insforge = createClient({
  baseUrl: 'https://c8kze9fw.ap-southeast.insforge.app',
  anonKey: 'ik_a2c69f99f1209ba9b4bc9ff9e7ed9762',
});

export interface UploadResult {
  success: boolean;
  url?: string;
  error?: string;
}

/**
 * Upload image to InsForge Storage using SDK
 * @param file - File to upload
 * @param bucket - Storage bucket name (default: 'product-images')
 * @returns Upload result with public URL
 */
export async function uploadImage(
  file: File,
  bucket: string = 'product-images'
): Promise<UploadResult> {
  try {
    // Validate file type
    if (!file.type.startsWith('image/')) {
      return {
        success: false,
        error: 'File must be an image'
      };
    }

    // Validate file size (max 5MB)
    const maxSize = 5 * 1024 * 1024; // 5MB
    if (file.size > maxSize) {
      return {
        success: false,
        error: 'File size must be less than 5MB'
      };
    }

    // Generate unique filename
    const timestamp = Date.now();
    const randomStr = Math.random().toString(36).substring(2, 8);
    const extension = file.name.split('.').pop() || 'jpg';
    const filename = `${timestamp}-${randomStr}.${extension}`;
    const path = filename;

    // Upload using InsForge SDK
    const { data, error } = await insforge.storage
      .from(bucket)
      .upload(path, file);

    if (error) {
      console.error('Upload error:', error);
      return {
        success: false,
        error: error.message || 'Upload failed'
      };
    }

    // Return the URL from SDK response
    return {
      success: true,
      url: data?.url || `${data?.url}`
    };
  } catch (error) {
    console.error('Upload exception:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Upload failed'
    };
  }
}

/**
 * Upload multiple images
 * @param files - Array of files to upload
 * @param bucket - Storage bucket name
 * @returns Array of upload results
 */
export async function uploadMultipleImages(
  files: File[],
  bucket: string = 'product-images'
): Promise<UploadResult[]> {
  const uploadPromises = files.map(file => uploadImage(file, bucket));
  return Promise.all(uploadPromises);
}

/**
 * Delete image from InsForge Storage
 * @param path - Path of the image within the bucket
 * @param bucket - Storage bucket name
 * @returns Success status
 */
export async function deleteImage(
  path: string,
  bucket: string = 'product-images'
): Promise<boolean> {
  try {
    const { error } = await insforge.storage.from(bucket).remove(path);
    return !error;
  } catch (error) {
    console.error('Delete error:', error);
    return false;
  }
}

/**
 * Convert File to base64 (for preview)
 * @param file - File to convert
 * @returns Base64 string
 */
export function fileToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

/**
 * Validate image dimensions
 * @param file - Image file
 * @param maxWidth - Maximum width
 * @param maxHeight - Maximum height
 * @returns Validation result
 */
export function validateImageDimensions(
  file: File,
  maxWidth: number = 2000,
  maxHeight: number = 2000
): Promise<{ valid: boolean; width?: number; height?: number; error?: string }> {
  return new Promise((resolve) => {
    const img = new Image();
    const url = URL.createObjectURL(file);

    img.onload = () => {
      URL.revokeObjectURL(url);
      const valid = img.width <= maxWidth && img.height <= maxHeight;
      resolve({
        valid,
        width: img.width,
        height: img.height,
        error: valid ? undefined : `Image dimensions must be ${maxWidth}x${maxHeight} or smaller`
      });
    };

    img.onerror = () => {
      URL.revokeObjectURL(url);
      resolve({
        valid: false,
        error: 'Failed to load image'
      });
    };

    img.src = url;
  });
}
