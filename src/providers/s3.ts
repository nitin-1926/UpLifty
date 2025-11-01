import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
import { Upload } from '@aws-sdk/lib-storage';
import { ProgressCallback, ProgressEvent, S3StorageConfig, UploadOptions, UploadResult, UploadStatus } from '../types';
import { generateUniqueId, getDestinationFolder, guessMimeType, sanitizeFileName } from '../core/utils';
import { StorageProvider } from './base';

/**
 * AWS S3 storage provider implementation using AWS SDK v3
 * Provides file upload functionality with progress tracking and metadata support
 */
export class S3StorageProvider implements StorageProvider {
	private s3Client: S3Client;
	private config: S3StorageConfig;

	/**
	 * Creates a new S3 storage provider instance
	 * @param config - The S3 configuration including credentials and bucket info
	 */
	constructor(config: S3StorageConfig) {
		this.config = {
			maxConcurrentUploads: 10,
			defaultMimeType: 'application/octet-stream',
			...config,
		};

		// Initialize AWS S3 client (v3)
		this.s3Client = new S3Client({
			region: this.config.s3.region,
			credentials: {
				accessKeyId: this.config.s3.accessKeyId,
				secretAccessKey: this.config.s3.secretAccessKey,
			},
		});
	}

	/**
	 * Uploads a file to S3 with progress tracking
	 * @param file - The file to upload
	 * @param options - Upload options including progress callbacks and metadata
	 * @returns Promise resolving to upload result with URL and metadata
	 */
	async upload(file: File, options?: UploadOptions): Promise<UploadResult> {
		const { onProgress, folder, generateId: shouldGenerateId = true, metadata = {} } = options || {};

		// Generate a unique ID if generation is enabled
		const fileId = shouldGenerateId ? generateUniqueId() : file.name;

		// Determine the file path in S3
		const filePath = this.getFilePath(file, folder);

		// Get content type
		const contentType =
			file.type || guessMimeType(file.name) || this.config.defaultMimeType || 'application/octet-stream';

		// Report initial progress
		if (onProgress) {
			this.notifyProgress(onProgress, {
				fileId: fileId,
				fileName: file.name,
				progress: 0,
				status: UploadStatus.UPLOADING,
			});
		}

		try {
			// Use Upload from @aws-sdk/lib-storage for multipart uploads with progress
			const upload = new Upload({
				client: this.s3Client,
				params: {
					Bucket: this.config.s3.bucket,
					Key: filePath,
					Body: file,
					ContentType: contentType,
					Metadata: {
						'content-type': contentType,
						'file-id': fileId,
						'storage-path': filePath,
						'file-type': contentType,
						size: file.size.toString(),
						name: sanitizeFileName(file.name),
						...metadata,
					},
				},
			});

			// Handle progress events
			if (onProgress) {
				upload.on('httpUploadProgress', progress => {
					if (progress.loaded && progress.total) {
						const percent = Math.round((progress.loaded / progress.total) * 100);

						this.notifyProgress(onProgress, {
							fileId: fileId,
							fileName: file.name,
							progress: percent,
							status: UploadStatus.UPLOADING,
						});
					}
				});
			}

			// Execute upload
			const result = await upload.done();

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
	 * @param filePath - The file path in S3
	 * @returns The full S3 URL
	 */
	private constructS3Url(filePath: string): string {
		const { bucket, region } = this.config.s3;
		return `https://${bucket}.s3.${region}.amazonaws.com/${filePath}`;
	}

	/**
	 * Determines the file path in S3
	 * @param file - The file to upload
	 * @param folder - Optional custom folder path
	 * @returns The complete path in S3
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
	 * Notifies of upload progress asynchronously
	 * @param callback - The progress callback function
	 * @param progress - The progress event to send
	 */
	private notifyProgress(callback: ProgressCallback, progress: ProgressEvent): void {
		setTimeout(() => callback(progress), 0);
	}
}
