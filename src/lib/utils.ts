import { FolderPath } from '../types';

/**
 * Generates a unique ID for file uploads
 * @returns A unique string ID
 */
export const generateUniqueId = (): string => {
	return Date.now().toString(36) + Math.random().toString(36).substring(2);
};

/**
 * Sanitizes a filename to be safe for storage
 * @param fileName The filename to sanitize
 * @returns Sanitized filename
 */
export const sanitizeFileName = (fileName: string): string => {
	return (
		fileName
			// Replace spaces with underscores
			.replace(/\s/g, '_')
			// Remove characters outside basic ASCII range
			.replace(/[^\x20-\x7E]/g, '_')
			// Remove any potentially dangerous characters
			.replace(/[&/\\#,+()$~%'":*?<>{}]/g, '_')
	);
};

/**
 * Determines the destination folder based on MIME type
 * @param mimeType The MIME type of the file
 * @returns The appropriate folder path
 */
export const getDestinationFolder = (mimeType: string): FolderPath => {
	// Check for image types
	if (/^image\/(jpeg|png|gif|webp|tiff)/.test(mimeType)) {
		return FolderPath.IMAGES;
	}

	// Check for video types
	if (/^video\//.test(mimeType) || mimeType === 'image/gif') {
		return FolderPath.VIDEOS;
	}

	// Check for document types
	if (
		/^application\/(pdf|msword|vnd.openxmlformats-officedocument|vnd.ms-excel|vnd.ms-powerpoint)/.test(mimeType) ||
		mimeType === 'text/plain'
	) {
		return FolderPath.DOCUMENTS;
	}

	// Default folder for all other types
	return FolderPath.DEFAULT;
};

/**
 * Extracts file extension from filename
 * @param fileName The filename
 * @returns The file extension (without dot)
 */
export const getFileExtension = (fileName: string): string => {
	return fileName.split('.').pop()?.toLowerCase() || '';
};

/**
 * Guesses MIME type from file extension when not available
 * @param fileName The filename
 * @returns The best guess at MIME type
 */
export const guessMimeType = (fileName: string): string => {
	const ext = getFileExtension(fileName);

	const mimeTypes: Record<string, string> = {
		jpg: 'image/jpeg',
		jpeg: 'image/jpeg',
		png: 'image/png',
		gif: 'image/gif',
		webp: 'image/webp',
		pdf: 'application/pdf',
		doc: 'application/msword',
		docx: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
		xls: 'application/vnd.ms-excel',
		xlsx: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
		ppt: 'application/vnd.ms-powerpoint',
		pptx: 'application/vnd.openxmlformats-officedocument.presentationml.presentation',
		mp4: 'video/mp4',
		mov: 'video/quicktime',
		avi: 'video/x-msvideo',
		txt: 'text/plain',
		csv: 'text/csv',
	};

	return mimeTypes[ext] || 'application/octet-stream';
};
