import { FileToUpload, S3StorageConfig, StorageType, UploadOptions, UploadResult, UpliftyConfig } from '../types';
import { S3StorageProvider } from './s3Provider';

/**
 * Main Uplifty class - entry point for the library
 */
export class Uplifty {
	private storageProvider: S3StorageProvider | null = null;
	private config: UpliftyConfig;

	/**
	 * Creates a new Uplifty instance
	 * @param config Configuration for the storage provider
	 */
	constructor(config: UpliftyConfig) {
		this.config = config;
		this.initializeProvider();
	}

	/**
	 * Initializes the appropriate storage provider based on the config
	 */
	private initializeProvider(): void {
		switch (this.config.type) {
			case StorageType.S3:
				this.storageProvider = new S3StorageProvider(this.config as S3StorageConfig);
				break;
			default:
				throw new Error(`Storage type "${this.config.type}" is not supported`);
		}
	}

	/**
	 * Uploads a file to the configured storage
	 * @param file File object to upload
	 * @param options Upload options
	 * @returns Promise resolving to upload result
	 */
	async upload(file: File, options?: UploadOptions): Promise<UploadResult> {
		return this.uploadFile({ file }, options);
	}

	/**
	 * Uploads a file with additional metadata
	 * @param fileToUpload File and metadata to upload
	 * @param options Upload options
	 * @returns Promise resolving to upload result
	 */
	async uploadFile(fileToUpload: FileToUpload, options?: UploadOptions): Promise<UploadResult> {
		if (!this.storageProvider) {
			throw new Error('No storage provider initialized');
		}

		return this.storageProvider.upload(fileToUpload, options);
	}

	/**
	 * Uploads multiple files
	 * @param files Array of files to upload
	 * @param options Upload options
	 * @returns Promise resolving to array of upload results
	 */
	async uploadMultiple(files: File[], options?: UploadOptions): Promise<UploadResult[]> {
		const uploads = files.map(file => this.upload(file, options));
		return Promise.all(uploads);
	}

	/**
	 * Gets the current configuration
	 * @returns The current configuration
	 */
	getConfig(): UpliftyConfig {
		return this.config;
	}
}
