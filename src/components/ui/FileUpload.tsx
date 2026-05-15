import { useState, useCallback } from 'react';
import { Upload, File, X } from 'lucide-react';
import { cn } from '../../lib/utils';

interface FileUploadProps {
  accept: string[];
  maxSize: number;
  onUpload: (files: File[]) => Promise<void>;
  multiple?: boolean;
  disabled?: boolean;
}

interface UploadedFile {
  file: File;
  id: string;
  progress: number;
}

export function FileUpload({
  accept,
  maxSize,
  onUpload,
  multiple = false,
  disabled = false
}: FileUploadProps) {
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([]);
  const [isDragging, setIsDragging] = useState(false);

  const validateFile = (file: File): { valid: boolean; error?: string } => {
    if (!accept.includes(file.type)) {
      return { valid: false, error: 'Invalid file type' };
    }
    if (file.size > maxSize) {
      return { valid: false, error: `File size exceeds ${maxSize / 1024 / 1024}MB limit` };
    }
    return { valid: true };
  };

  const handleFiles = useCallback((files: FileList) => {
    const newFiles = Array.from(files).map(file => {
      const validation = validateFile(file);
      return {
        file,
        id: Math.random().toString(36).substring(2, 9),
        progress: validation.valid ? 0 : -1
      };
    });

    setUploadedFiles(prev => multiple ? [...prev, ...newFiles] : newFiles);
  }, [accept, maxSize, multiple]);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    if (disabled) return;

    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleFiles(e.dataTransfer.files);
    }
  }, [disabled, handleFiles]);

  const handleRemove = (id: string) => {
    setUploadedFiles(prev => prev.filter(f => f.id !== id));
  };

  const handleUpload = async () => {
    for (const uploadedFile of uploadedFiles) {
      if (uploadedFile.progress === -1) continue;
      
      try {
        uploadedFile.progress = 10;
        setUploadedFiles([...uploadedFiles]);

        await onUpload([uploadedFile.file]);
        uploadedFile.progress = 100;
        setUploadedFiles([...uploadedFiles]);
      } catch (error) {
        uploadedFile.progress = -1;
        setUploadedFiles([...uploadedFiles]);
      }
    }
  };

  return (
    <div className="w-full">
      <div
        className={cn(
          "border-2 border-dashed rounded-lg p-8 text-center transition-colors cursor-pointer",
          isDragging
            ? "border-blue-400 bg-blue-50"
            : "border-slate-300 hover:bg-slate-50",
          disabled && "opacity-50 cursor-not-allowed"
        )}
        onDragOver={(e) => {
          if (!disabled) {
            e.preventDefault();
            e.stopPropagation();
            setIsDragging(true);
          }
        }}
        onDragLeave={(e) => {
          e.preventDefault();
          e.stopPropagation();
          setIsDragging(false);
        }}
        onDrop={handleDrop}
        onClick={() => {
          if (!disabled) {
            document.querySelector<HTMLInputElement[type="file"]')?.click();
          }
        }}
      >
        <input
          type="file"
          className="hidden"
          accept={accept.join(',')}
          multiple={multiple}
          disabled={disabled}
          onChange={(e) => {
            if (e.target.files && e.target.files.length > 0) {
              handleFiles(e.target.files);
            }
          }}
        />
        <Upload className="mx-auto h-12 w-12 text-slate-400 mb-4" />
        <p className="text-sm text-slate-600 mb-2">
          {isDragging ? 'Drop files here' : 'Drag & drop files or click to upload'}
        </p>
        <p className="text-xs text-slate-500">
          Max {maxSize / 1024 / 1024}MB · {accept.join(', ')}
        </p>
      </div>

      {uploadedFiles.length > 0 && (
        <div className="mt-4 space-y-2">
          {uploadedFiles.map((uploadedFile) => (
            <div
              key={uploadedFile.id}
              className="flex items-center justify-between p-3 bg-white border border-slate-200 rounded-lg"
            >
              <div className="flex items-center gap-3 flex-1 min-w-0">
                <File className="w-5 h-5 text-slate-400 flex-shrink-0" />
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-medium truncate">{uploadedFile.file.name}</p>
                  <p className="text-xs text-slate-500">
                    {(uploadedFile.file.size / 1024).toFixed(1)} KB
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                {uploadedFile.progress === 100 && (
                  <span className="text-xs text-green-600">✓</span>
                )}
                {uploadedFile.progress === -1 && (
                  <span className="text-xs text-red-600">✗</span>
                )}
                <button
                  onClick={() => handleRemove(uploadedFile.id)}
                  className="p-1 text-slate-400 hover:text-red-600"
                  disabled={disabled}
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {uploadedFiles.length > 0 && (
        <div className="mt-4">
          <button
            onClick={handleUpload}
            disabled={disabled || uploadedFiles.some(f => f.progress < 0)}
            className="w-full bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded-lg font-medium disabled:opacity-50"
          >
            Upload {uploadedFiles.length} file{uploadedFiles.length > 1 ? 's' : ''}
          </button>
        </div>
      )}
    </div>
  );
}
