import AWS from 'aws-sdk';
import {
	FileToUpload,
	ProgressCallback,
	ProgressEvent,
	S3StorageConfig,
	UploadOptions,
	UploadResult,
	UploadStatus,
} from '../types';
import { generateUniqueId, getDestinationFolder, guessMimeType, sanitizeFileName } from './utils';

/**
 * AWS S3 storage provider implementation
 */
export class S3StorageProvider {
	private s3: AWS.S3;
	private config: S3StorageConfig;

	/**
	 * Creates a new S3 storage provider
	 * @param config The S3 configuration
	 */
	constructor(config: S3StorageConfig) {
		this.config = {
			maxConcurrentUploads: 10,
			defaultMimeType: 'application/octet-stream',
			...config,
		};

		// Initialize AWS S3 client
		this.s3 = new AWS.S3({
			accessKeyId: this.config.s3.accessKeyId,
			secretAccessKey: this.config.s3.secretAccessKey,
			region: this.config.s3.region,
		});
	}

	/**
	 * Uploads a file to S3
	 * @param fileToUpload The file to upload
	 * @param options Upload options
	 * @returns Promise resolving to upload result
	 */
	async upload(fileToUpload: FileToUpload, options?: UploadOptions): Promise<UploadResult> {
		const { file, id, path, metadata = {} } = fileToUpload;
		const { onProgress, folder, generateId = true } = options || {};

		// Generate a unique ID if not provided
		const fileId = id || (generateId ? generateUniqueId() : file.name);

		// Determine the file path
		const filePath = path || this.getFilePath(file, folder);

		// Get content type
		const contentType =
			file.type || guessMimeType(file.name) || this.config.defaultMimeType || 'application/octet-stream';

		// Create upload parameters
		const params: AWS.S3.PutObjectRequest = {
			Bucket: this.config.s3.bucket,
			Key: filePath,
			Body: file,
			ContentType: contentType,
			Metadata: {
				'Content-Type': contentType,
				fileId: fileId,
				storagePath: filePath,
				fileType: contentType,
				size: file.size.toString(),
				name: sanitizeFileName(file.name),
				...metadata,
			},
		};

		// Report initial progress
		if (onProgress) {
			this.notifyProgress(onProgress, {
				fileId: fileId,
				fileName: file.name,
				progress: 0,
				status: UploadStatus.UPLOADING,
			});
		}

		// Create upload object
		const upload = this.s3.upload(params);

		// Handle progress events
		if (onProgress) {
			upload.on('httpUploadProgress', progress => {
				const percent = Math.round((progress.loaded / progress.total) * 100);

				this.notifyProgress(onProgress, {
					fileId: fileId,
					fileName: file.name,
					progress: percent,
					status: UploadStatus.UPLOADING,
				});
			});
		}

		try {
			// Execute upload
			const result = await upload.promise();

			// Build the URL
			const url = result.Location || this.constructS3Url(filePath);

			// Report completion
			if (onProgress) {
				this.notifyProgress(onProgress, {
					fileId: fileId,
					fileName: file.name,
					progress: 100,
					status: UploadStatus.COMPLETED,
					url,
				});
			}

			// Return upload result
			return {
				fileId,
				fileName: file.name,
				url,
				size: file.size,
				mimeType: contentType,
				metadata: metadata as Record<string, string>,
			};
		} catch (error: unknown) {
			// Report error
			if (onProgress) {
				this.notifyProgress(onProgress, {
					fileId: fileId,
					fileName: file.name,
					progress: 0,
					status: UploadStatus.FAILED,
					error: error instanceof Error ? error.message : 'Upload failed',
				});
			}

			// Re-throw the error
			throw error;
		}
	}

	/**
	 * Constructs an S3 URL for the given path
	 * @param filePath The file path in S3
	 * @returns The full S3 URL
	 */
	private constructS3Url(filePath: string): string {
		const { bucket, region } = this.config.s3;
		return `https://${bucket}.s3.${region}.amazonaws.com/${filePath}`;
	}

	/**
	 * Determines the file path in S3
	 * @param file The file
	 * @param folder Optional custom folder
	 * @returns The path in S3
	 */
	private getFilePath(file: File, folder?: string): string {
		if (folder) {
			const normalizedFolder = folder.endsWith('/') ? folder : `${folder}/`;
			return `${normalizedFolder}${sanitizeFileName(file.name)}`;
		}

		const destinationFolder = getDestinationFolder(file.type || guessMimeType(file.name));
		return `${destinationFolder}${sanitizeFileName(file.name)}`;
	}

	/**
	 * Notifies of upload progress
	 * @param callback The progress callback
	 * @param progress The progress event
	 */
	private notifyProgress(callback: ProgressCallback, progress: ProgressEvent): void {
		setTimeout(() => callback(progress), 0);
	}
}
