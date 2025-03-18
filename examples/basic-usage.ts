import { Uplifty, StorageType, UploadStatus } from '../src';

/**
 * Example demonstrating how to use Uplifty to upload files to AWS S3
 *
 * This is for demonstration purposes. In a real application, you would
 * get your credentials securely from environment variables or a configuration system.
 */

// Initialize Uplifty with AWS S3 credentials
export const uplifty = new Uplifty({
	type: StorageType.S3,
	s3: {
		accessKeyId: 'YOUR_AWS_ACCESS_KEY',
		secretAccessKey: 'YOUR_AWS_SECRET_KEY',
		region: 'us-east-1',
		bucket: 'your-bucket-name',
	},
});

/**
 * Example: Upload a single file with progress tracking
 */
export async function uploadSingleFile(file: File): Promise<void> {
	try {
		const result = await uplifty.upload(file, {
			onProgress: progress => {
				// Update UI with progress
				console.log(`Upload progress: ${progress.progress}%`);

				// Check upload status
				switch (progress.status) {
					case UploadStatus.UPLOADING:
						console.log('File is uploading...');
						break;
					case UploadStatus.COMPLETED:
						console.log(`File uploaded successfully. URL: ${progress.url}`);
						break;
					case UploadStatus.FAILED:
						console.error(`Upload failed: ${progress.error}`);
						break;
					default:
						console.log(`Status: ${progress.status}`);
				}
			},
			// Optional: specify a custom folder
			folder: 'uploads/images/',
		});

		console.log('Upload complete!');
		console.log('File ID:', result.fileId);
		console.log('File URL:', result.url);
		console.log('File size:', result.size);
	} catch (error) {
		console.error('Upload failed:', error);
	}
}

/**
 * Example: Upload multiple files
 */
export async function uploadMultipleFiles(files: File[]): Promise<void> {
	try {
		const results = await uplifty.uploadMultiple(files, {
			onProgress: progress => {
				console.log(`File ${progress.fileName}: ${progress.progress}%`);
			},
		});

		console.log('All uploads complete!');
		results.forEach((result, index) => {
			console.log(`File ${index + 1}:`);
			console.log(`- ID: ${result.fileId}`);
			console.log(`- URL: ${result.url}`);
			console.log(`- Size: ${result.size} bytes`);
		});
	} catch (error) {
		console.error('Some uploads failed:', error);
	}
}

/**
 * Example: Upload with metadata
 */
export async function uploadWithMetadata(file: File, userId: string): Promise<void> {
	try {
		const result = await uplifty.uploadFile({
			file,
			metadata: {
				userId,
				uploadDate: new Date().toISOString(),
				category: 'user-content',
			},
		});

		console.log('Upload with metadata complete!');
		console.log('File URL:', result.url);
		console.log('Metadata:', result.metadata);
	} catch (error) {
		console.error('Upload failed:', error);
	}
}

// In a browser environment, you might use these functions like this:
//
// document.getElementById('uploadButton')?.addEventListener('click', () => {
//   const fileInput = document.getElementById('fileInput') as HTMLInputElement;
//   if (fileInput.files && fileInput.files.length > 0) {
//     uploadSingleFile(fileInput.files[0]);
//   }
// });
//
// document.getElementById('multiUploadButton')?.addEventListener('click', () => {
//   const fileInput = document.getElementById('fileInput') as HTMLInputElement;
//   if (fileInput.files && fileInput.files.length > 0) {
//     uploadMultipleFiles(Array.from(fileInput.files));
//   }
// });
