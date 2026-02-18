
import { FileCategory } from './types';

export const COLORS = {
  primary: '#00ff9d',
  secondary: '#bc13fe',
  accent: '#00d4ff',
  danger: '#ff4d4d',
  bg: '#050505',
  card: '#0a0a0a'
};

export const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB limit for simulation

export const getFileIcon = (category: FileCategory) => {
  switch (category) {
    case FileCategory.DOCUMENT: return '📄';
    case FileCategory.IMAGE: return '🖼️';
    case FileCategory.CODE: return '💻';
    default: return '📁';
  }
};
