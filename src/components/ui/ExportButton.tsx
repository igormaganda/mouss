import { Button } from './Button';
import { Download, FileSpreadsheet } from 'lucide-react';

interface ExportButtonProps {
  onExport: (format: 'csv' | 'pdf') => void;
  disabled?: boolean;
  loading?: boolean;
}

export function ExportButton({ onExport, disabled = false, loading = false }: ExportButtonProps) {
  return (
    <div className="flex gap-2">
      <Button
        variant="outline"
        size="sm"
        onClick={() => onExport('csv')}
        disabled={disabled || loading}
        className="flex items-center gap-2"
      >
        <Download className="w-4 h-4" />
        CSV
      </Button>
    </div>
  );
}
