# Uplifty

A versatile and intuitive file upload library for cloud storage services.

## Features

- Simple and modern API for uploading files to cloud storage services
- Progress tracking with detailed status updates
- Support for AWS S3
- TypeScript support with comprehensive type definitions
- Extensible architecture for adding support for other storage providers

## Installation

```bash
npm install uplifty
```

## Quick Start

Here's a basic example of uploading a file to AWS S3:

```typescript
import { Uplifty, StorageType } from 'uplifty';

// Initialize Uplifty with AWS S3 credentials
const uplifty = new Uplifty({
	type: StorageType.S3,
	s3: {
		accessKeyId: 'YOUR_AWS_ACCESS_KEY',
		secretAccessKey: 'YOUR_AWS_SECRET_KEY',
		region: 'us-east-1',
		bucket: 'your-bucket-name',
	},
});

// Get a file from input element
const fileInput = document.getElementById('fileInput') as HTMLInputElement;
const file = fileInput.files?.[0];

if (file) {
	// Upload the file with progress tracking
	uplifty
		.upload(file, {
			onProgress: progress => {
				console.log(`Upload progress: ${progress.progress}%`);
				console.log(`Status: ${progress.status}`);

				// When completed, we'll have a URL
				if (progress.url) {
					console.log(`File URL: ${progress.url}`);
				}

				// Check for errors
				if (progress.error) {
					console.error(`Upload error: ${progress.error}`);
				}
			},
		})
		.then(result => {
			console.log('Upload complete:', result);
		})
		.catch(error => {
			console.error('Upload failed:', error);
		});
}
```

## API Reference

### Uplifty Class

The main class for interacting with the library.

#### Constructor

```typescript
constructor(config: UpliftyConfig)
```

Creates a new Uplifty instance with the specified configuration.

#### Methods

##### upload

```typescript
upload(file: File, options?: UploadOptions): Promise<UploadResult>
```

Uploads a file to the configured storage service.

##### uploadFile

```typescript
uploadFile(fileToUpload: FileToUpload, options?: UploadOptions): Promise<UploadResult>
```

Uploads a file with additional metadata.

##### uploadMultiple

```typescript
uploadMultiple(files: File[], options?: UploadOptions): Promise<UploadResult[]>
```

Uploads multiple files and returns an array of results.

##### getConfig

```typescript
getConfig(): UpliftyConfig
```

Returns the current configuration.

### Configuration

#### UpliftyConfig

The main configuration object for Uplifty. Currently supports AWS S3:

```typescript
// S3 configuration
const config: UpliftyConfig = {
	type: StorageType.S3,
	s3: {
		accessKeyId: 'YOUR_AWS_ACCESS_KEY',
		secretAccessKey: 'YOUR_AWS_SECRET_KEY',
		region: 'us-east-1',
		bucket: 'your-bucket-name',
	},
	maxConcurrentUploads: 5, // Optional, defaults to 10
	defaultMimeType: 'application/octet-stream', // Optional
};
```

### Types

#### UploadOptions

Options for the upload methods.

```typescript
interface UploadOptions {
	onProgress?: ProgressCallback; // Callback for progress updates
	folder?: string; // Custom folder path
	generateId?: boolean; // Whether to generate a unique ID for the file
}
```

#### ProgressEvent

The structure of progress events passed to the progress callback.

```typescript
interface ProgressEvent {
	fileId: string; // Unique ID for the file
	fileName: string; // Original file name
	progress: number; // Progress percentage (0-100)
	status: UploadStatus; // Current status (QUEUED, UPLOADING, etc.)
	error?: string; // Error message if any
	url?: string; // URL of the uploaded file (when completed)
}
```

#### UploadStatus

Enum for possible upload statuses.

```typescript
enum UploadStatus {
	QUEUED = 'QUEUED',
	UPLOADING = 'UPLOADING',
	PROCESSING = 'PROCESSING',
	COMPLETED = 'COMPLETED',
	FAILED = 'FAILED',
	CANCELLED = 'CANCELLED',
}
```

## Advanced Usage

### Custom Folder Structure

You can specify a custom folder for uploads:

```typescript
uplifty.upload(file, {
	folder: 'custom/folder/path/',
});
```

### Upload with Metadata

You can attach custom metadata to uploads:

```typescript
uplifty.uploadFile({
	file: myFile,
	metadata: {
		userId: '12345',
		category: 'profile-picture',
		description: 'User profile image',
	},
});
```

### Upload Multiple Files

```typescript
const files = Array.from(fileInput.files || []);
uplifty
	.uploadMultiple(files, {
		onProgress: progress => {
			console.log(`File ${progress.fileName}: ${progress.progress}%`);
		},
	})
	.then(results => {
		console.log('All uploads complete:', results);
	});
```

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is licensed under the MIT License - see the LICENSE file for details.
