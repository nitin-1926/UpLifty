# Contributing to Uplifty

Thank you for your interest in contributing to Uplifty! This document provides guidelines and instructions for contributing.

## How to Contribute

### Reporting Bugs

1. Check if the bug has already been reported in [Issues](https://github.com/nitin-1926/UpLifty/issues)
2. If not, create a new issue with:
    - Clear title and description
    - Steps to reproduce
    - Expected vs actual behavior
    - Environment details (Node version, OS, etc.)
    - Code samples if applicable

### Suggesting Features

1. Check existing [Issues](https://github.com/nitin-1926/UpLifty/issues) and [Discussions](https://github.com/nitin-1926/UpLifty/discussions)
2. Create a new discussion or issue describing:
    - The problem you're trying to solve
    - Your proposed solution
    - Any alternative solutions you've considered
    - How it fits with the project's goals

### Pull Requests

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Make your changes
4. Test your changes
5. Commit with clear messages (`git commit -m 'Add amazing feature'`)
6. Push to your branch (`git push origin feature/amazing-feature`)
7. Open a Pull Request

## Development Setup

### Prerequisites

-   Node.js >= 14.0.0
-   npm >= 7.0.0

### Setup Steps

```bash
# Clone your fork
git clone https://github.com/YOUR_USERNAME/UpLifty.git
cd UpLifty

# Install dependencies
npm install

# Build the project
npm run build

# Run linter
npm run lint
```

### Project Structure

```
uplifty/
├── src/
│   ├── index.ts              # Main entry point
│   ├── core/                 # Core functionality
│   │   ├── uplifty.ts       # Main Uplifty class
│   │   └── utils.ts         # Utility functions
│   ├── providers/           # Storage providers
│   │   ├── base.ts          # Provider interface
│   │   ├── s3.ts            # S3 implementation
│   │   └── index.ts         # Provider exports
│   └── types/               # TypeScript types
├── examples/                # Usage examples
├── dist/                    # Built files (not in repo)
└── tests/                   # Tests (future)
```

## Adding a New Storage Provider

### 1. Create Provider File

Create `src/providers/your-provider.ts`:

```typescript
import { StorageProvider, BaseStorageConfig } from './base';
import { FileToUpload, UploadOptions, UploadResult } from '../types';

export interface YourProviderConfig extends BaseStorageConfig {
	type: StorageType.YOUR_PROVIDER;
	yourProvider: {
		// Your provider-specific config
		apiKey: string;
		endpoint: string;
	};
}

export class YourProviderStorageProvider implements StorageProvider {
	private config: YourProviderConfig;

	constructor(config: YourProviderConfig) {
		this.config = config;
		// Initialize your provider
	}

	async upload(fileToUpload: FileToUpload, options?: UploadOptions): Promise<UploadResult> {
		// Implement upload logic
	}
}
```

### 2. Update Types

Add to `src/types/index.ts`:

```typescript
export enum StorageType {
	S3 = 's3',
	YOUR_PROVIDER = 'your-provider',
}

export interface YourProviderConfig {
	// Your config interface
}
```

### 3. Export Provider

Add to `src/providers/index.ts`:

```typescript
export { YourProviderStorageProvider } from './your-provider';
```

### 4. Update Main Class

Update `src/core/uplifty.ts` to support your provider:

```typescript
private initializeProvider(): void {
  switch (this.config.type) {
    case StorageType.S3:
      this.storageProvider = new S3StorageProvider(this.config as S3StorageConfig);
      break;
    case StorageType.YOUR_PROVIDER:
      this.storageProvider = new YourProviderStorageProvider(this.config as YourProviderConfig);
      break;
    default:
      throw new Error(`Storage type "${this.config.type}" is not supported`);
  }
}
```

### 5. Add Tests

Create tests for your provider (when test suite is set up).

### 6. Documentation

-   Add usage example to `examples/`
-   Update `README.md` with provider documentation
-   Add provider-specific configuration guide

## Code Style

### TypeScript

-   Use TypeScript strict mode
-   Provide type annotations for public APIs
-   Use interfaces for object shapes
-   Use enums for fixed sets of values

### Naming Conventions

-   Classes: `PascalCase`
-   Functions: `camelCase`
-   Constants: `UPPER_SNAKE_CASE`
-   Files: `kebab-case.ts` or `camelCase.ts`

### Comments

-   Use JSDoc for public APIs
-   Explain "why" not "what" in comments
-   Keep comments up to date

Example:

```typescript
/**
 * Uploads a file to the configured storage provider
 * @param file - The file to upload
 * @param options - Upload options including progress callbacks
 * @returns Promise resolving to upload result with URL and metadata
 */
async upload(file: File, options?: UploadOptions): Promise<UploadResult> {
  // Implementation
}
```

## Testing

(Tests will be added in future versions)

```bash
npm test
```

## Documentation

-   Keep README.md up to date
-   Update MIGRATION.md for breaking changes
-   Add examples for new features
-   Update TypeScript types

## Commit Messages

Follow conventional commits:

-   `feat: Add new feature`
-   `fix: Fix bug`
-   `docs: Update documentation`
-   `refactor: Refactor code`
-   `test: Add tests`
-   `chore: Update dependencies`

Examples:

```
feat: Add Google Cloud Storage provider
fix: Handle upload errors correctly
docs: Update README with new examples
refactor: Simplify S3 provider initialization
```

## Release Process

(For maintainers)

1. Update version in `package.json`
2. Update `MIGRATION.md` if breaking changes
3. Update `README.md` with new features
4. Commit: `chore: Release v0.x.0`
5. Tag: `git tag v0.x.0`
6. Push: `git push && git push --tags`
7. Publish: `npm publish`

## Questions?

-   Open a [Discussion](https://github.com/nitin-1926/UpLifty/discussions)
-   Ask in an [Issue](https://github.com/nitin-1926/UpLifty/issues)

Thank you for contributing! 🎉


