import { UploadOptions, UploadResult } from '../types';

/**
 * Abstract interface for storage providers
 * All storage providers (S3, GCS, Azure, etc.) must implement this interface
 */
export interface StorageProvider {
	/**
	 * Uploads a single file to the storage provider
	 * @param file - The file to upload
	 * @param options - Upload options including progress callbacks and metadata
	 * @returns Promise resolving to upload result with file URL and metadata
	 */
	upload(file: File, options?: UploadOptions): Promise<UploadResult>;

	/**
	 * Deletes a file from the storage provider (optional, for future implementation)
	 * @param fileId - The ID or key of the file to delete
	 * @returns Promise resolving when deletion is complete
	 */
	delete?(fileId: string): Promise<void>;

	/**
	 * Generates a presigned URL for direct client uploads (optional, for future implementation)
	 * @param fileName - The name of the file
	 * @param contentType - The MIME type of the file
	 * @param expiresIn - Expiration time in seconds
	 * @returns Promise resolving to presigned URL and metadata
	 */
	getPresignedUrl?(
		fileName: string,
		contentType: string,
		expiresIn?: number,
	): Promise<{
		url: string;
		key: string;
		expiresIn: number;
	}>;
}

/**
 * Base configuration for all storage providers
 */
export interface BaseStorageConfig {
	maxConcurrentUploads?: number;
	defaultMimeType?: string;
}
