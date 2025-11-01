/**
 * Uplifty - A versatile and intuitive file upload library for cloud storage services
 *
 * This library provides:
 * - Simple, minimal boilerplate API for file uploads
 * - Support for multiple storage providers (S3, and more coming soon)
 * - TypeScript-first with full type safety
 * - Progress tracking and metadata support
 * - Extensible architecture for custom providers
 *
 * @packageDocumentation
 */

// Core exports
export { Uplifty } from './core/uplifty';

// Type exports
export {
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

// Provider exports
export { StorageProvider, BaseStorageConfig } from './providers/base';
export { S3StorageProvider } from './providers/s3';

// Utility exports
export {
	generateUniqueId,
	getDestinationFolder,
	getFileExtension,
	guessMimeType,
	sanitizeFileName,
} from './core/utils';
