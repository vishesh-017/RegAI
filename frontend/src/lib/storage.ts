import fs from 'fs/promises';
import path from 'path';
import { v4 as uuidv4 } from 'uuid';

/**
 * StorageProvider interface allowing us to swap Local Storage
 * with AWS S3, Supabase Storage, Azure Blob, etc. without changing UI or Business Logic.
 */
export interface StorageProvider {
  uploadFile(file: File, organizationId: string): Promise<{ url: string, hash: string }>;
  deleteFile(fileUrl: string): Promise<boolean>;
}

export class LocalStorageProvider implements StorageProvider {
  private baseDir = path.join(process.cwd(), 'public', 'uploads', 'circulars');

  async uploadFile(file: File, organizationId: string): Promise<{ url: string, hash: string }> {
    // Ensure directory exists
    const orgDir = path.join(this.baseDir, organizationId);
    await fs.mkdir(orgDir, { recursive: true });

    // Generate a secure, unique filename
    const ext = path.extname(file.name);
    const uniqueFilename = `${uuidv4()}${ext}`;
    const filePath = path.join(orgDir, uniqueFilename);

    // Write file to disk
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    await fs.writeFile(filePath, buffer);

    // In a real scenario, we'd hash the file content for deduplication/verification
    const hash = 'sha256-mock-hash-' + uuidv4().substring(0, 8);
    
    // Return the relative URL accessible via the Next.js public directory
    return {
      url: `/uploads/circulars/${organizationId}/${uniqueFilename}`,
      hash
    };
  }

  async deleteFile(fileUrl: string): Promise<boolean> {
    try {
      const relativePath = fileUrl.replace('/uploads/circulars/', '');
      const absolutePath = path.join(this.baseDir, relativePath);
      await fs.unlink(absolutePath);
      return true;
    } catch (e) {
      console.error('Failed to delete file from local storage', e);
      return false;
    }
  }
}

// Export a singleton instance. Change this to AWS/Supabase provider in production.
export const storageProvider: StorageProvider = new LocalStorageProvider();
