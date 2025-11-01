# Uplifty

A versatile and intuitive file upload library for cloud storage services with support for multiple providers, React hooks (coming soon), and UI components (coming soon).

[![npm version](https://badge.fury.io/js/uplifty.svg)](https://www.npmjs.com/package/uplifty)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

## ✨ Features

-   🚀 **Simple and modern API** - Upload files with minimal boilerplate
-   📊 **Progress tracking** - Real-time upload progress with detailed status updates
-   ☁️ **Multi-provider support** - Currently supports AWS S3 (more providers coming soon)
-   🔒 **TypeScript-first** - Comprehensive type definitions included
-   🎯 **Extensible architecture** - Easy to add custom storage providers
-   🎨 **React hooks** - Coming soon for seamless React integration
-   🧩 **UI components** - Pre-built upload components coming soon

## 📦 Installation

```bash
npm install uplifty
```

## 🚀 Quick Start

### Basic Upload to AWS S3

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

// Upload a file with progress tracking
const file = document.getElementById('fileInput').files[0];

const result = await uplifty.upload(file, {
	onProgress: progress => {
		console.log(`Upload progress: ${progress.progress}%`);
		console.log(`Status: ${progress.status}`);

		if (progress.url) {
			console.log(`File URL: ${progress.url}`);
		}
	},
});

console.log('Upload complete:', result.url);
```

## 📖 Documentation

### Architecture

Uplifty uses a **provider pattern** to support multiple cloud storage services:

```
┌─────────────────────────────────────────────┐
│            Uplifty Core                     │
│  (Unified API for all providers)            │
└──────────────┬──────────────────────────────┘
               │
       ┌───────┴────────┐
       │                │
┌──────▼──────┐  ┌─────▼──────┐  ┌──────────┐
│ S3 Provider │  │ GCS (Soon) │  │   Azure  │
│             │  │            │  │  (Soon)  │
└─────────────┘  └────────────┘  └──────────┘
```

This design makes it easy to:

-   Switch between storage providers
-   Add custom providers
-   Use multiple providers in the same application

### API Reference

#### Uplifty Class

The main class for interacting with the library.

##### Constructor

```typescript
new Uplifty(config: UpliftyConfig)
```

Creates a new Uplifty instance with the specified configuration.

**Parameters:**

-   `config.type` - Storage provider type (currently only `StorageType.S3`)
-   `config.s3` - AWS S3 configuration
    -   `accessKeyId` - AWS access key ID
    -   `secretAccessKey` - AWS secret access key
    -   `region` - AWS region (e.g., 'us-east-1')
    -   `bucket` - S3 bucket name
-   `config.maxConcurrentUploads` - Optional, defaults to 10
-   `config.defaultMimeType` - Optional, defaults to 'application/octet-stream'

##### Methods

###### upload

```typescript
upload(file: File, options?: UploadOptions): Promise<UploadResult>
```

Uploads a single file to the configured storage service.

**Options:**

-   `onProgress` - Callback for progress updates
-   `folder` - Custom folder path (e.g., 'uploads/images/')
-   `generateId` - Whether to generate a unique ID (default: true)

###### uploadFile

```typescript
uploadFile(fileToUpload: FileToUpload, options?: UploadOptions): Promise<UploadResult>
```

Uploads a file with additional metadata.

**Example:**

```typescript
await uplifty.uploadFile({
	file: myFile,
	metadata: {
		userId: '12345',
		category: 'profile-picture',
	},
});
```

###### uploadMultiple

```typescript
uploadMultiple(files: File[], options?: UploadOptions): Promise<UploadResult[]>
```

Uploads multiple files and returns an array of results.

### Types

#### UploadStatus

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

#### ProgressEvent

```typescript
interface ProgressEvent {
	fileId: string; // Unique ID for the file
	fileName: string; // Original file name
	progress: number; // Progress percentage (0-100)
	status: UploadStatus; // Current status
	error?: string; // Error message if failed
	url?: string; // URL when completed
}
```

#### UploadResult

```typescript
interface UploadResult {
	fileId: string;
	fileName: string;
	url: string;
	size: number;
	mimeType: string;
	metadata?: Record<string, string>;
}
```

## 💡 Advanced Usage

### Custom Folder Structure

```typescript
await uplifty.upload(file, {
	folder: 'user-uploads/2024/january/',
});
```

### Upload with Metadata

```typescript
await uplifty.uploadFile({
	file: myFile,
	metadata: {
		userId: '12345',
		uploadDate: new Date().toISOString(),
		category: 'documents',
	},
});
```

### Upload Multiple Files

```typescript
const files = Array.from(fileInput.files);
const results = await uplifty.uploadMultiple(files, {
	onProgress: progress => {
		console.log(`${progress.fileName}: ${progress.progress}%`);
	},
});
```

### Direct Provider Access (Advanced)

For advanced use cases, you can use providers directly:

```typescript
import { S3StorageProvider, StorageType } from 'uplifty';

const provider = new S3StorageProvider({
	type: StorageType.S3,
	s3: {
		accessKeyId: '...',
		secretAccessKey: '...',
		region: 'us-east-1',
		bucket: 'my-bucket',
	},
});

await provider.upload({ file }, options);
```

## 🗺️ Roadmap

### v0.3.0 - React Hooks (Coming Soon)

```typescript
import { useUpload, useFileUploader } from 'uplifty/react';

function UploadComponent() {
	const { upload, progress, isUploading, error } = useUpload({
		type: StorageType.S3,
		s3: {
			/* config */
		},
	});

	return <input type="file" onChange={e => upload(e.target.files[0])} disabled={isUploading} />;
}
```

### v0.4.0 - UI Components (Coming Soon)

```typescript
import { FileUploadZone, UploadProgress } from 'uplifty/components';

<FileUploadZone onUploadComplete={url => console.log(url)} showProgress allowDragDrop maxFiles={5} />;
```

### Future Features

-   **Additional Storage Providers**
    -   Google Cloud Storage (GCS)
    -   Azure Blob Storage
    -   Cloudflare R2
    -   DigitalOcean Spaces
-   **Backend Utilities**
    -   Redis-based upload polling
    -   Webhook handlers
    -   Upload queue management
-   **Advanced Features**
    -   Image optimization
    -   Video transcoding
    -   File validation
    -   Chunked uploads for large files

## 🏗️ Architecture for Library Developers

Uplifty is designed to be extensible. You can create custom storage providers by implementing the `StorageProvider` interface:

```typescript
import { StorageProvider, FileToUpload, UploadResult, UploadOptions } from 'uplifty';

class CustomProvider implements StorageProvider {
	async upload(fileToUpload: FileToUpload, options?: UploadOptions): Promise<UploadResult> {
		// Your implementation here
	}
}
```

See the [examples](./examples) directory for more detailed examples.

## 📚 Examples

Check out the [examples](./examples) directory for complete working examples:

-   **Basic Usage** - Simple file uploads
-   **Server Integration** - Express.js integration
-   **React Components** - React upload components
-   **Advanced Scenarios** - Custom providers, presigned URLs, etc.

## 🔄 Migration Guide

Upgrading from v0.1.x? Check out the [Migration Guide](./MIGRATION.md).

## 🤝 Contributing

Contributions are welcome! Here's how you can help:

### Adding a New Storage Provider

1. Implement the `StorageProvider` interface
2. Add tests for your provider
3. Update documentation
4. Submit a pull request

Example provider structure:

```typescript
// src/providers/your-provider.ts
import { StorageProvider } from './base';

export class YourProvider implements StorageProvider {
	// Implementation
}
```

### Reporting Issues

Found a bug? Please [open an issue](https://github.com/nitin-1926/UpLifty/issues) with:

-   Description of the problem
-   Steps to reproduce
-   Expected vs actual behavior
-   Environment details

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

Built with:

-   [AWS SDK for JavaScript v3](https://github.com/aws/aws-sdk-js-v3)
-   TypeScript
-   Love for clean code and good DX

## 📞 Support

-   📖 [Documentation](https://github.com/nitin-1926/UpLifty#readme)
-   🐛 [Issue Tracker](https://github.com/nitin-1926/UpLifty/issues)
-   💬 [Discussions](https://github.com/nitin-1926/UpLifty/discussions)

---

Made with ❤️ by [Nitin Gupta](https://github.com/nitin-1926)
