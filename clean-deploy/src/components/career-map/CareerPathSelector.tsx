'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ChevronDown,
  Plus,
  Star,
  Trash2,
  Check,
  Edit2,
  MoreHorizontal,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

export interface CareerPathInfo {
  id: string;
  name: string;
  description?: string;
  color: string;
  isPrimary: boolean;
  nodeCount: number;
}

interface CareerPathSelectorProps {
  paths: CareerPathInfo[];
  selectedPathId: string | null;
  onSelectPath: (pathId: string) => void;
  onAddPath: (name: string, color: string, description?: string) => void;
  onDeletePath: (pathId: string) => void;
  onSetPrimary: (pathId: string) => void;
  onEditPath?: (pathId: string, updates: { name?: string; color?: string; description?: string }) => void;
  className?: string;
}

// Available colors for career paths (no indigo/blue as per requirement)
const PATH_COLORS = [
  { value: '#10B981', label: 'Émeraude' },
  { value: '#F59E0B', label: 'Ambre' },
  { value: '#A855F7', label: 'Violet' },
  { value: '#F43F5E', label: 'Rose' },
  { value: '#06B6D4', label: 'Cyan' },
  { value: '#F97316', label: 'Orange' },
  { value: '#84CC16', label: 'Lime' },
  { value: '#EC4899', label: 'Rose foncé' },
];

const CareerPathSelector = ({
  paths,
  selectedPathId,
  onSelectPath,
  onAddPath,
  onDeletePath,
  onSetPrimary,
  onEditPath,
  className,
}: CareerPathSelectorProps) => {
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [editingPath, setEditingPath] = useState<CareerPathInfo | null>(null);
  const [newPathName, setNewPathName] = useState('');
  const [newPathColor, setNewPathColor] = useState(PATH_COLORS[0].value);
  const [newPathDescription, setNewPathDescription] = useState('');

  const selectedPath = paths.find(p => p.id === selectedPathId);

  const handleAddPath = () => {
    if (newPathName.trim()) {
      onAddPath(newPathName.trim(), newPathColor, newPathDescription.trim() || undefined);
      setNewPathName('');
      setNewPathColor(PATH_COLORS[0].value);
      setNewPathDescription('');
      setIsAddDialogOpen(false);
    }
  };

  const handleEditPath = () => {
    if (editingPath && onEditPath) {
      onEditPath(editingPath.id, {
        name: newPathName.trim() || undefined,
        color: newPathColor,
        description: newPathDescription.trim() || undefined,
      });
      setEditingPath(null);
      setIsEditDialogOpen(false);
    }
  };

  const openEditDialog = (path: CareerPathInfo) => {
    setEditingPath(path);
    setNewPathName(path.name);
    setNewPathColor(path.color);
    setNewPathDescription(path.description || '');
    setIsEditDialogOpen(true);
  };

  return (
    <div className={cn('flex items-center gap-2', className)}>
      {/* Main dropdown */}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="outline"
            className="min-w-[200px] justify-between"
          >
            <div className="flex items-center gap-2">
              {selectedPath && (
                <div
                  className="w-3 h-3 rounded-full"
                  style={{ backgroundColor: selectedPath.color }}
                />
              )}
              <span className="truncate">
                {selectedPath?.name || 'Sélectionner un parcours'}
              </span>
              {selectedPath?.isPrimary && (
                <Star className="w-3 h-3 text-amber-500 fill-amber-500" />
              )}
            </div>
            <ChevronDown className="w-4 h-4 ml-2 shrink-0" />
          </Button>
        </DropdownMenuTrigger>

        <DropdownMenuContent align="start" className="w-[280px]">
          <div className="p-2">
            <p className="text-xs text-muted-foreground mb-2">Mes parcours</p>
          </div>

          <DropdownMenuSeparator />

          {/* Path list */}
          <div className="max-h-[300px] overflow-y-auto">
            {paths.map((path) => (
              <DropdownMenuItem
                key={path.id}
                onClick={() => onSelectPath(path.id)}
                className="flex items-center justify-between py-3"
              >
                <div className="flex items-center gap-3">
                  <div
                    className="w-4 h-4 rounded-full shrink-0"
                    style={{ backgroundColor: path.color }}
                  />
                  <div className="flex flex-col">
                    <span className="font-medium">{path.name}</span>
                    <span className="text-xs text-muted-foreground">
                      {path.nodeCount} étapes
                    </span>
                  </div>
                </div>
                <div className="flex items-center gap-1">
                  {path.isPrimary && (
                    <Star className="w-3 h-3 text-amber-500 fill-amber-500" />
                  )}
                  {selectedPathId === path.id && (
                    <Check className="w-4 h-4 text-emerald-500" />
                  )}
                </div>
              </DropdownMenuItem>
            ))}
          </div>

          {paths.length > 0 && <DropdownMenuSeparator />}

          {/* Path actions */}
          {selectedPath && (
            <>
              <DropdownMenuItem onClick={() => openEditDialog(selectedPath)}>
                <Edit2 className="w-4 h-4 mr-2" />
                Modifier le parcours
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => onSetPrimary(selectedPath.id)}
                disabled={selectedPath.isPrimary}
              >
                <Star className="w-4 h-4 mr-2" />
                Définir comme principal
              </DropdownMenuItem>
              {paths.length > 1 && (
                <DropdownMenuItem
                  onClick={() => onDeletePath(selectedPath.id)}
                  className="text-rose-600 focus:text-rose-600"
                >
                  <Trash2 className="w-4 h-4 mr-2" />
                  Supprimer
                </DropdownMenuItem>
              )}
              <DropdownMenuSeparator />
            </>
          )}

          {/* Add new path */}
          <DropdownMenuItem onClick={() => setIsAddDialogOpen(true)}>
            <Plus className="w-4 h-4 mr-2" />
            Nouveau parcours
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      {/* Quick actions */}
      {selectedPath && (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon">
              <MoreHorizontal className="w-4 h-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={() => openEditDialog(selectedPath)}>
              <Edit2 className="w-4 h-4 mr-2" />
              Modifier
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => onSetPrimary(selectedPath.id)}
              disabled={selectedPath.isPrimary}
            >
              <Star className="w-4 h-4 mr-2" />
              Définir comme principal
            </DropdownMenuItem>
            {paths.length > 1 && (
              <>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  onClick={() => onDeletePath(selectedPath.id)}
                  className="text-rose-600 focus:text-rose-600"
                >
                  <Trash2 className="w-4 h-4 mr-2" />
                  Supprimer
                </DropdownMenuItem>
              </>
            )}
          </DropdownMenuContent>
        </DropdownMenu>
      )}

      {/* Add Path Dialog */}
      <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Nouveau parcours</DialogTitle>
            <DialogDescription>
              Créez un nouveau parcours professionnel pour visualiser votre trajectoire.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="name">Nom du parcours</Label>
              <Input
                id="name"
                placeholder="Ex: Développeur Full Stack"
                value={newPathName}
                onChange={(e) => setNewPathName(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="color">Couleur</Label>
              <div className="flex flex-wrap gap-2">
                {PATH_COLORS.map((color) => (
                  <button
                    key={color.value}
                    type="button"
                    className={cn(
                      "w-8 h-8 rounded-full border-2 transition-all",
                      newPathColor === color.value
                        ? "border-foreground scale-110"
                        : "border-transparent hover:scale-105"
                    )}
                    style={{ backgroundColor: color.value }}
                    onClick={() => setNewPathColor(color.value)}
                    title={color.label}
                  />
                ))}
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="description">Description (optionnel)</Label>
              <Input
                id="description"
                placeholder="Description courte..."
                value={newPathDescription}
                onChange={(e) => setNewPathDescription(e.target.value)}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
              Annuler
            </Button>
            <Button onClick={handleAddPath} disabled={!newPathName.trim()}>
              Créer
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Path Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Modifier le parcours</DialogTitle>
            <DialogDescription>
              Modifiez les informations de votre parcours professionnel.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="edit-name">Nom du parcours</Label>
              <Input
                id="edit-name"
                value={newPathName}
                onChange={(e) => setNewPathName(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label>Couleur</Label>
              <div className="flex flex-wrap gap-2">
                {PATH_COLORS.map((color) => (
                  <button
                    key={color.value}
                    type="button"
                    className={cn(
                      "w-8 h-8 rounded-full border-2 transition-all",
                      newPathColor === color.value
                        ? "border-foreground scale-110"
                        : "border-transparent hover:scale-105"
                    )}
                    style={{ backgroundColor: color.value }}
                    onClick={() => setNewPathColor(color.value)}
                    title={color.label}
                  />
                ))}
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-description">Description</Label>
              <Input
                id="edit-description"
                value={newPathDescription}
                onChange={(e) => setNewPathDescription(e.target.value)}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
              Annuler
            </Button>
            <Button onClick={handleEditPath}>
              Enregistrer
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default CareerPathSelector;
