
export enum FileCategory {
  DOCUMENT = 'document',
  IMAGE = 'image',
  CODE = 'code',
  OTHER = 'other'
}

export interface FileMetadata {
  id: string;
  name: string;
  size: number;
  type: string;
  category: FileCategory;
  uploadDate: string;
  isEncrypted: boolean;
  securityScore?: number;
  aiSummary?: string;
  data?: string; // Base64
}

export interface VaultStats {
  totalStorage: number;
  usedStorage: number;
  fileCount: number;
  threatLevel: 'Low' | 'Moderate' | 'High' | 'Critical';
}

export interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}
