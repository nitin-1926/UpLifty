import { S3StorageConfig, StorageType, UploadOptions, UploadResult, UpliftyConfig } from '../types';
import { S3StorageProvider } from '../providers/s3';

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
	 * Uploads one or more files to the configured storage
	 * @param files Array of File objects to upload (supports single or multiple files)
	 * @param options Upload options including progress callbacks and metadata
	 * @returns Promise resolving to array of upload results
	 */
	async upload(files: File[], options?: UploadOptions): Promise<UploadResult[]> {
		if (!this.storageProvider) {
			throw new Error('No storage provider initialized');
		}

		if (files.length === 0) {
			return [];
		}

		const uploads = files.map(file => this.storageProvider!.upload(file, options));
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
