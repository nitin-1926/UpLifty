/**
 * Enum for upload file statuses
 */
export enum UploadStatus {
	QUEUED = 'QUEUED',
	UPLOADING = 'UPLOADING',
	PROCESSING = 'PROCESSING',
	COMPLETED = 'COMPLETED',
	FAILED = 'FAILED',
	CANCELLED = 'CANCELLED',
}

/**
 * Interface for folder paths
 */
export enum FolderPath {
	DEFAULT = 'files/',
	IMAGES = 'images/',
	DOCUMENTS = 'documents/',
	VIDEOS = 'videos/',
}

/**
 * Interface for AWS S3 configuration
 */
export interface S3Config {
	accessKeyId: string;
	secretAccessKey: string;
	region: string;
	bucket: string;
}

/**
 * Base storage provider configuration
 */
export interface StorageConfig {
	type: StorageType;
	maxConcurrentUploads?: number;
	defaultMimeType?: string;
}

/**
 * Supported storage types
 */
export enum StorageType {
	S3 = 's3',
	// Future storage types can be added here
}

/**
 * Combined configuration for AWS S3
 */
export interface S3StorageConfig extends StorageConfig {
	type: StorageType.S3;
	s3: S3Config;
}

/**
 * Union type for all supported storage configurations
 */
export type UpliftyConfig = S3StorageConfig;

/**
 * Progress callback interface
 */
export interface ProgressCallback {
	(progress: ProgressEvent): void;
}

/**
 * Progress event interface
 */
export interface ProgressEvent {
	fileId: string;
	fileName: string;
	progress: number;
	status: UploadStatus;
	error?: string;
	url?: string;
}

/**
 * File to be uploaded
 */
export interface FileToUpload {
	file: File;
	id?: string;
	path?: string;
	metadata?: Record<string, string>;
}

/**
 * Upload options
 */
export interface UploadOptions {
	onProgress?: ProgressCallback;
	folder?: string;
	generateId?: boolean;
}

/**
 * Upload result
 */
export interface UploadResult {
	fileId: string;
	fileName: string;
	url: string;
	size: number;
	mimeType: string;
	metadata?: Record<string, string>;
}
