
import React, { useState, useEffect, useCallback } from 'react';
import { FileMetadata, FileCategory, VaultStats } from './types';
import { MAX_FILE_SIZE } from './constants';
import { Button } from './components/Button';
import { VaultCard } from './components/VaultCard';
import { FileListItem } from './components/FileListItem';
import { VaultAssistant } from './components/VaultAssistant';
import { analyzeFileSecurity, generateFileSummary } from './services/geminiService';

const App: React.FC = () => {
  const [files, setFiles] = useState<FileMetadata[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const [isScanningId, setIsScanningId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  // Load files from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem('darkcyber_vault_files');
    if (saved) {
      setFiles(JSON.parse(saved));
    } else {
      // Mock initial data
      const mockFiles: FileMetadata[] = [
        {
          id: '1',
          name: 'Manifesto_Alpha.txt',
          size: 24500,
          type: 'text/plain',
          category: FileCategory.DOCUMENT,
          uploadDate: new Date().toISOString(),
          isEncrypted: true,
          securityScore: 92,
          aiSummary: 'A high-level overview of the Alpha protocol operations.'
        }
      ];
      setFiles(mockFiles);
    }
  }, []);

  // Save to localStorage whenever files change
  useEffect(() => {
    localStorage.setItem('darkcyber_vault_files', JSON.stringify(files));
  }, [files]);

  const stats: VaultStats = {
    totalStorage: 10 * 1024 * 1024 * 1024, // 10GB
    usedStorage: files.reduce((acc, f) => acc + f.size, 0),
    fileCount: files.length,
    threatLevel: files.some(f => f.securityScore && f.securityScore < 50) ? 'Moderate' : 'Low'
  };

  const formatStorage = (bytes: number) => {
    const mb = bytes / (1024 * 1024);
    if (mb < 1024) return `${mb.toFixed(1)} MB`;
    return `${(mb / 1024).toFixed(1)} GB`;
  };

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (file.size > MAX_FILE_SIZE) {
      alert("Exceeds simulated upload limit (5MB). Data integrity protection active.");
      return;
    }

    setIsUploading(true);
    
    // Simulate encryption and processing
    const reader = new FileReader();
    reader.onload = async (e) => {
      const base64 = e.target?.result as string;
      const category = file.type.includes('image') ? FileCategory.IMAGE : 
                       file.type.includes('text') ? FileCategory.DOCUMENT : 
                       file.name.match(/\.(js|ts|py|c|cpp)$/) ? FileCategory.CODE : FileCategory.OTHER;

      const newFile: FileMetadata = {
        id: Math.random().toString(36).substr(2, 9),
        name: file.name,
        size: file.size,
        type: file.type,
        category,
        uploadDate: new Date().toISOString(),
        isEncrypted: true,
        data: base64
      };

      // Auto-summarize if text
      if (category === FileCategory.DOCUMENT || category === FileCategory.CODE) {
        const summary = await generateFileSummary(file.name, base64);
        newFile.aiSummary = summary;
      }

      setFiles(prev => [newFile, ...prev]);
      setIsUploading(false);
    };
    reader.readAsDataURL(file);
  };

  const handleDelete = (id: string) => {
    setFiles(prev => prev.filter(f => f.id !== id));
  };

  const handleScan = async (id: string) => {
    const file = files.find(f => f.id === id);
    if (!file) return;

    setIsScanningId(id);
    const result = await analyzeFileSecurity(file.name, file.type, file.data);
    
    if (result) {
      setFiles(prev => prev.map(f => f.id === id ? {
        ...f,
        securityScore: result.riskScore !== undefined ? 100 - result.riskScore : 100,
        aiSummary: result.threatSummary || f.aiSummary
      } : f));
    }
    setIsScanningId(null);
  };

  const filteredFiles = files.filter(f => f.name.toLowerCase().includes(searchQuery.toLowerCase()));

  return (
    <div className="flex h-screen overflow-hidden">
      {/* Sidebar Navigation */}
      <aside className="w-20 bg-[#0a0a0a] border-r border-white/5 flex flex-col items-center py-8 gap-8 shrink-0">
        <div className="w-12 h-12 bg-[#00ff9d]/20 border border-[#00ff9d] flex items-center justify-center rounded-lg shadow-[0_0_10px_rgba(0,255,157,0.3)]">
          <span className="text-[#00ff9d] text-2xl font-bold">D</span>
        </div>
        <nav className="flex flex-col gap-6">
          <div className="p-3 bg-white/5 text-[#00ff9d] rounded-lg cursor-pointer">📂</div>
          <div className="p-3 text-gray-500 hover:text-white rounded-lg cursor-pointer transition-colors">🔐</div>
          <div className="p-3 text-gray-500 hover:text-white rounded-lg cursor-pointer transition-colors">📡</div>
          <div className="p-3 text-gray-500 hover:text-white rounded-lg cursor-pointer transition-colors">⚙️</div>
        </nav>
      </aside>

      {/* Main Content Area */}
      <main className="flex-grow flex flex-col bg-[#050505] overflow-y-auto">
        <header className="sticky top-0 z-10 px-8 py-6 bg-[#050505]/80 backdrop-blur-md border-b border-white/5 flex justify-between items-center">
          <div>
            <h1 className="text-xl font-bold neon-text text-[#00ff9d]">DARKCYBER_VAULT v1.0.4</h1>
            <p className="text-[10px] text-gray-500 mono uppercase tracking-[0.2em]">Secure Decentralized Environment</p>
          </div>
          <div className="flex gap-4">
            <div className="relative group">
               <input 
                type="text" 
                placeholder="Search encrypted data..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="bg-[#0a0a0a] border border-white/10 rounded-sm px-4 py-2 text-xs w-64 focus:outline-none focus:border-[#00ff9d] transition-all"
              />
              <span className="absolute right-3 top-2.5 text-gray-600">🔍</span>
            </div>
            <label className="cursor-pointer">
              <input type="file" onChange={handleFileUpload} className="hidden" disabled={isUploading} />
              <Button variant="primary" loading={isUploading}>
                UPLOAD NEW FILE
              </Button>
            </label>
          </div>
        </header>

        <section className="p-8 space-y-8">
          {/* Dashboard Stats */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <VaultCard label="Vault Capacity" value={formatStorage(stats.usedStorage)} icon="💾" trend="OF 10 GB" />
            <VaultCard label="Encrypted Assets" value={stats.fileCount} icon="📦" trend="+2 NEW" color="#bc13fe" />
            <VaultCard label="Threat Level" value={stats.threatLevel} icon="🛡️" trend="GLOBAL STATS" color={stats.threatLevel === 'Low' ? '#00ff9d' : '#ff4d4d'} />
            <VaultCard label="Active Nodes" value="24" icon="⚡" trend="UPTIME 99.9%" color="#00d4ff" />
          </div>

          {/* File Browser Area */}
          <div className="space-y-4">
            <div className="flex justify-between items-end border-b border-white/5 pb-2">
              <h2 className="text-sm font-bold tracking-widest text-gray-400 uppercase">Recent Files</h2>
              <div className="flex gap-4 text-[10px] mono text-gray-600">
                <span>NAME ↑</span>
                <span>SIZE</span>
                <span>STATUS</span>
              </div>
            </div>

            <div className="grid gap-3">
              {filteredFiles.length > 0 ? (
                filteredFiles.map(file => (
                  <FileListItem 
                    key={file.id} 
                    file={file} 
                    onDelete={handleDelete} 
                    onScan={handleScan}
                    isScanning={isScanningId === file.id}
                  />
                ))
              ) : (
                <div className="h-40 flex flex-col items-center justify-center border-2 border-dashed border-white/5 rounded-xl text-gray-600">
                   <span className="text-4xl mb-2 opacity-20">🕳️</span>
                   <p className="text-xs uppercase tracking-widest mono">No data recovered in this sector</p>
                </div>
              )}
            </div>
          </div>
        </section>
      </main>

      {/* AI Assistant Sidebar */}
      <VaultAssistant />
    </div>
  );
};

export default App;
