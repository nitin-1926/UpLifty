// Export main class
export { Uplifty } from './lib/uplifty';

// Export types
export {
	FileToUpload,
	FolderPath,
	ProgressCallback,
	ProgressEvent,
	S3Config,
	S3StorageConfig,
	StorageConfig,
	StorageType,
	UploadOptions,
	UploadResult,
	UploadStatus,
	UpliftyConfig,
} from './types';

// Export utility functions
export { generateUniqueId, getDestinationFolder, getFileExtension, guessMimeType, sanitizeFileName } from './lib/utils';
