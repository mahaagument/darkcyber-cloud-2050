
import React from 'react';
import { FileMetadata, FileCategory } from '../types';
import { getFileIcon } from '../constants';
import { Button } from './Button';

interface FileListItemProps {
  file: FileMetadata;
  onDelete: (id: string) => void;
  onScan: (id: string) => void;
  isScanning?: boolean;
}

export const FileListItem: React.FC<FileListItemProps> = ({ file, onDelete, onScan, isScanning }) => {
  const formatSize = (bytes: number) => {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const getScoreColor = (score?: number) => {
    if (score === undefined) return 'text-gray-600';
    if (score > 80) return 'text-green-400';
    if (score > 50) return 'text-yellow-400';
    return 'text-red-400';
  };

  return (
    <div className="group bg-[#0a0a0a] border border-white/5 hover:border-[#00ff9d]/30 p-4 rounded-lg flex items-start gap-4 transition-all hover:bg-[#0d0d0d] relative overflow-hidden">
      {/* Visual Glitch Accent on Hover */}
      <div className="absolute top-0 left-0 w-1 h-0 group-hover:h-full bg-[#00ff9d] transition-all duration-300 shadow-[0_0_10px_#00ff9d]" />
      
      <div className="text-3xl flex-shrink-0 bg-white/5 p-3 rounded-lg group-hover:bg-[#00ff9d]/10 transition-colors mt-1 border border-white/5 group-hover:border-[#00ff9d]/20">
        {getFileIcon(file.category)}
      </div>
      
      <div className="flex-grow min-w-0">
        <div className="flex items-center gap-2">
          <h4 className="font-bold text-sm truncate text-gray-200 group-hover:text-white transition-colors mono">
            {file.name.toUpperCase()}
          </h4>
          {file.isEncrypted && (
            <span className="text-[9px] bg-purple-500/10 text-purple-400 px-1.5 py-0.5 rounded border border-purple-500/30 font-bold mono tracking-tighter">
              [ENCRYPTED_AES_256]
            </span>
          )}
        </div>
        
        <div className="flex items-center gap-3 mt-1">
          <span className="text-[10px] text-gray-500 mono">{formatSize(file.size)}</span>
          <span className="text-[10px] text-gray-400/30">|</span>
          <span className="text-[10px] text-gray-500 mono">{new Date(file.uploadDate).toLocaleDateString()}</span>
          {file.securityScore !== undefined && (
            <>
              <span className="text-[10px] text-gray-400/30">|</span>
              <span className={`text-[10px] font-bold mono ${getScoreColor(file.securityScore)}`}>
                S_LEVEL: {file.securityScore}%
              </span>
            </>
          )}
        </div>

        {file.aiSummary && (
          <div className="mt-4 bg-[#bc13fe]/5 border-l border-r border-b border-[#bc13fe]/20 p-2 rounded-b-sm rounded-tr-sm transition-all group-hover:bg-[#bc13fe]/10 relative">
             <div className="absolute -top-3 left-0 bg-[#bc13fe] px-2 py-0.5 rounded-t-sm">
               <div className="flex items-center gap-1.5">
                 <span className="w-1 h-1 rounded-full bg-black animate-ping"></span>
                 <p className="text-[8px] text-black uppercase mono font-black tracking-widest">Neural_Decryption</p>
               </div>
             </div>
             <p className="text-[11px] text-gray-300/80 line-clamp-2 leading-relaxed italic mt-1 font-medium">
               "{file.aiSummary}"
             </p>
          </div>
        )}
      </div>

      <div className="flex flex-col items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0">
        <Button 
          variant="secondary" 
          size="sm" 
          onClick={() => onScan(file.id)}
          loading={isScanning}
          className="w-full text-[9px] h-7 mono border-[#bc13fe]/50"
        >
          ANALYSIS
        </Button>
        <Button 
          variant="ghost" 
          size="sm" 
          onClick={() => onDelete(file.id)}
          className="text-red-500/30 hover:text-red-500 hover:bg-red-500/10 w-full h-7 text-[9px] mono"
        >
          PURGE
        </Button>
      </div>
    </div>
  );
};
