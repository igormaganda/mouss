'use client';

import { useState, useRef, useEffect, useCallback, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ZoomIn,
  ZoomOut,
  Maximize,
  Minimize,
  RotateCcw,
  GripVertical,
  Map,
  Layers,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { CareerLine } from './CareerLine';
import { CareerNode, type CareerNodeData } from './CareerNode';
import { NodeDetailPanel } from './NodeDetailPanel';
import CareerPathSelector, { type CareerPathInfo } from './CareerPathSelector';

// Types
interface CareerPath {
  id: string;
  name: string;
  description?: string;
  color: string;
  isPrimary: boolean;
  nodes: CareerNodeData[];
}

interface CareerMapProps {
  careerPaths: CareerPath[];
  userSkills?: string[];
  onNodeSelect?: (node: CareerNodeData) => void;
  onSetTarget?: (nodeId: string) => void;
  onViewJobs?: (nodeId: string) => void;
  onAddPath?: (name: string, color: string, description?: string) => void;
  onDeletePath?: (pathId: string) => void;
  onSetPrimaryPath?: (pathId: string) => void;
  onEditPath?: (pathId: string, updates: { name?: string; color?: string; description?: string }) => void;
  className?: string;
  isLoading?: boolean;
}

// Constants
const MIN_ZOOM = 0.3;
const MAX_ZOOM = 2;
const ZOOM_STEP = 0.1;
const MAP_PADDING = 100;

// Default career paths for demo
const DEFAULT_PATHS: CareerPath[] = [
  {
    id: 'path-1',
    name: 'Tech Lead',
    color: '#10B981',
    isPrimary: true,
    nodes: [
      { id: 'n1', title: 'Junior Developer', nodeType: 'job', x: 100, y: 200, isCurrent: true, salaryMin: 35000, salaryMax: 45000, growthRate: 8, requirements: ['JavaScript', 'React', 'Node.js'] },
      { id: 'n2', title: 'Mid Developer', nodeType: 'job', x: 300, y: 200, salaryMin: 50000, salaryMax: 65000, growthRate: 12, requirements: ['TypeScript', 'System Design', 'Testing'] },
      { id: 'n3', title: 'Senior Developer', nodeType: 'job', x: 500, y: 200, salaryMin: 70000, salaryMax: 90000, growthRate: 15, requirements: ['Architecture', 'Mentoring', 'DevOps'] },
      { id: 'n4', title: 'Tech Lead', nodeType: 'milestone', x: 700, y: 200, isTarget: true, salaryMin: 90000, salaryMax: 120000, growthRate: 18, requirements: ['Leadership', 'Project Management', 'Strategy'] },
    ],
  },
  {
    id: 'path-2',
    name: 'Data Engineer',
    color: '#F59E0B',
    isPrimary: false,
    nodes: [
      { id: 'd1', title: 'Data Analyst', nodeType: 'job', x: 100, y: 400, salaryMin: 40000, salaryMax: 55000, growthRate: 10, requirements: ['SQL', 'Python', 'Excel'] },
      { id: 'd2', title: 'Data Engineer', nodeType: 'job', x: 300, y: 400, salaryMin: 55000, salaryMax: 75000, growthRate: 20, requirements: ['Spark', 'Airflow', 'Cloud Platforms'] },
      { id: 'd3', title: 'Senior Data Eng', nodeType: 'job', x: 500, y: 400, salaryMin: 80000, salaryMax: 110000, growthRate: 22, requirements: ['Architecture', 'ML Pipelines', 'Team Lead'] },
    ],
  },
  {
    id: 'path-3',
    name: 'Product Manager',
    color: '#A855F7',
    isPrimary: false,
    nodes: [
      { id: 'p1', title: 'Business Analyst', nodeType: 'job', x: 100, y: 600, salaryMin: 45000, salaryMax: 60000, growthRate: 8, requirements: ['Analysis', 'Documentation', 'Stakeholder Management'] },
      { id: 'p2', title: 'Associate PM', nodeType: 'job', x: 300, y: 600, salaryMin: 60000, salaryMax: 80000, growthRate: 12, requirements: ['Product Strategy', 'User Research', 'Agile'] },
      { id: 'p3', title: 'Product Manager', nodeType: 'job', x: 500, y: 600, salaryMin: 85000, salaryMax: 110000, growthRate: 15, requirements: ['Roadmap', 'Metrics', 'Leadership'] },
      { id: 'p4', title: 'Senior PM', nodeType: 'milestone', x: 700, y: 600, salaryMin: 110000, salaryMax: 150000, growthRate: 18, requirements: ['Vision', 'Executive Communication', 'Team Building'] },
    ],
  },
];

const CareerMap = ({
  careerPaths: initialPaths,
  userSkills = [],
  onNodeSelect,
  onSetTarget,
  onViewJobs,
  onAddPath,
  onDeletePath,
  onSetPrimaryPath,
  onEditPath,
  className,
  isLoading = false,
}: CareerMapProps) => {
  // State - use DEFAULT_PATHS if no paths provided
  const [paths, setPaths] = useState<CareerPath[]>(
    initialPaths && initialPaths.length > 0 ? initialPaths : DEFAULT_PATHS
  );
  const [selectedPathId, setSelectedPathId] = useState<string | null>(paths.find(p => p.isPrimary)?.id || paths[0]?.id || null);
  const [selectedNode, setSelectedNode] = useState<CareerNodeData | null>(null);
  const [isPanelOpen, setIsPanelOpen] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showLegend, setShowLegend] = useState(true);

  // Pan & Zoom state
  const [zoom, setZoom] = useState(1);
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });

  // Refs
  const containerRef = useRef<HTMLDivElement>(null);
  const svgRef = useRef<SVGSVGElement>(null);

  // Calculate bounds
  const bounds = useMemo(() => {
    let minX = Infinity, minY = Infinity, maxX = -Infinity, maxY = -Infinity;
    
    paths.forEach(path => {
      path.nodes.forEach(node => {
        minX = Math.min(minX, node.x - 50);
        minY = Math.min(minY, node.y - 50);
        maxX = Math.max(maxX, node.x + 100);
        maxY = Math.max(maxY, node.y + 100);
      });
    });

    return {
      minX: minX === Infinity ? 0 : minX,
      minY: minY === Infinity ? 0 : minY,
      maxX: maxX === -Infinity ? 800 : maxX,
      maxY: maxY === -Infinity ? 800 : maxY,
      width: maxX - minX + MAP_PADDING * 2 || 800,
      height: maxY - minY + MAP_PADDING * 2 || 800,
    };
  }, [paths]);

  // Zoom handlers
  const handleZoomIn = useCallback(() => {
    setZoom(z => Math.min(MAX_ZOOM, z + ZOOM_STEP));
  }, []);

  const handleZoomOut = useCallback(() => {
    setZoom(z => Math.max(MIN_ZOOM, z - ZOOM_STEP));
  }, []);

  const handleResetView = useCallback(() => {
    setZoom(1);
    setPan({ x: 0, y: 0 });
  }, []);

  // Pan handlers
  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    if (e.button === 0) {
      setIsDragging(true);
      setDragStart({ x: e.clientX - pan.x, y: e.clientY - pan.y });
    }
  }, [pan]);

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    if (isDragging) {
      setPan({
        x: e.clientX - dragStart.x,
        y: e.clientY - dragStart.y,
      });
    }
  }, [isDragging, dragStart]);

  const handleMouseUp = useCallback(() => {
    setIsDragging(false);
  }, []);

  // Touch handlers for mobile
  const handleTouchStart = useCallback((e: React.TouchEvent) => {
    if (e.touches.length === 1) {
      setIsDragging(true);
      setDragStart({
        x: e.touches[0].clientX - pan.x,
        y: e.touches[0].clientY - pan.y,
      });
    }
  }, [pan]);

  const handleTouchMove = useCallback((e: React.TouchEvent) => {
    if (isDragging && e.touches.length === 1) {
      setPan({
        x: e.touches[0].clientX - dragStart.x,
        y: e.touches[0].clientY - dragStart.y,
      });
    }
  }, [isDragging, dragStart]);

  const handleTouchEnd = useCallback(() => {
    setIsDragging(false);
  }, []);

  // Wheel zoom - only zoom with Ctrl key, otherwise let page scroll
  const handleWheel = useCallback((e: React.WheelEvent) => {
    // Only zoom when Ctrl key is pressed (like Google Maps)
    if (!e.ctrlKey && !e.metaKey) {
      return; // Let the page scroll naturally
    }
    e.preventDefault();
    const delta = e.deltaY > 0 ? -ZOOM_STEP : ZOOM_STEP;
    setZoom(z => Math.max(MIN_ZOOM, Math.min(MAX_ZOOM, z + delta)));
  }, []);

  // Node selection
  const handleNodeSelect = useCallback((nodeId: string) => {
    const node = paths.flatMap(p => p.nodes).find(n => n.id === nodeId);
    if (node) {
      setSelectedNode(node);
      setIsPanelOpen(true);
      onNodeSelect?.(node);
    }
  }, [paths, onNodeSelect]);

  const handleClosePanel = useCallback(() => {
    setIsPanelOpen(false);
  }, []);

  // Path management
  const handleSelectPath = useCallback((pathId: string) => {
    setSelectedPathId(pathId);
    handleResetView();
  }, [handleResetView]);

  const handleAddPath = useCallback((name: string, color: string, description?: string) => {
    const newPath: CareerPath = {
      id: `path-${Date.now()}`,
      name,
      color,
      description,
      isPrimary: paths.length === 0,
      nodes: [],
    };
    setPaths(prev => [...prev, newPath]);
    setSelectedPathId(newPath.id);
    onAddPath?.(name, color, description);
  }, [paths.length, onAddPath]);

  const handleDeletePath = useCallback((pathId: string) => {
    setPaths(prev => prev.filter(p => p.id !== pathId));
    if (selectedPathId === pathId) {
      setSelectedPathId(paths.find(p => p.id !== pathId)?.id || null);
    }
    onDeletePath?.(pathId);
  }, [selectedPathId, paths, onDeletePath]);

  const handleSetPrimary = useCallback((pathId: string) => {
    setPaths(prev => prev.map(p => ({
      ...p,
      isPrimary: p.id === pathId,
    })));
    onSetPrimaryPath?.(pathId);
  }, [onSetPrimaryPath]);

  const handleEditPath = useCallback((pathId: string, updates: { name?: string; color?: string; description?: string }) => {
    setPaths(prev => prev.map(p => p.id === pathId ? { ...p, ...updates } : p));
    onEditPath?.(pathId, updates);
  }, [onEditPath]);

  // Selected path
  const selectedPath = paths.find(p => p.id === selectedPathId);

  // Convert paths to selector format
  const pathInfos: CareerPathInfo[] = paths.map(p => ({
    id: p.id,
    name: p.name,
    description: p.description,
    color: p.color,
    isPrimary: p.isPrimary,
    nodeCount: p.nodes.length,
  }));

  return (
    <TooltipProvider>
      <div
        ref={containerRef}
        className={cn(
          "relative overflow-hidden bg-muted/30 rounded-lg",
          isFullscreen ? "fixed inset-0 z-50" : "h-[600px]",
          className
        )}
      >
        {/* Header Controls */}
        <div className="absolute top-4 left-4 right-4 z-10 flex items-center justify-between gap-4 flex-wrap">
          {/* Path Selector */}
          <CareerPathSelector
            paths={pathInfos}
            selectedPathId={selectedPathId}
            onSelectPath={handleSelectPath}
            onAddPath={handleAddPath}
            onDeletePath={handleDeletePath}
            onSetPrimary={handleSetPrimary}
            onEditPath={handleEditPath}
          />

          {/* View Controls */}
          <div className="flex items-center gap-1">
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="outline" size="icon" onClick={handleZoomOut}>
                  <ZoomOut className="w-4 h-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>Zoom arrière</TooltipContent>
            </Tooltip>

            <div className="px-2 py-1 text-sm font-medium min-w-[60px] text-center">
              {Math.round(zoom * 100)}%
            </div>

            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="outline" size="icon" onClick={handleZoomIn}>
                  <ZoomIn className="w-4 h-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>Zoom avant</TooltipContent>
            </Tooltip>

            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="outline" size="icon" onClick={handleResetView}>
                  <RotateCcw className="w-4 h-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>Réinitialiser la vue</TooltipContent>
            </Tooltip>

            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => setIsFullscreen(!isFullscreen)}
                >
                  {isFullscreen ? (
                    <Minimize className="w-4 h-4" />
                  ) : (
                    <Maximize className="w-4 h-4" />
                  )}
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                {isFullscreen ? 'Quitter le plein écran' : 'Plein écran'}
              </TooltipContent>
            </Tooltip>
          </div>
        </div>

        {/* Main SVG Canvas */}
        <svg
          ref={svgRef}
          className="w-full h-full cursor-grab active:cursor-grabbing"
          style={{
            touchAction: 'none',
          }}
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseUp}
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
          onWheel={handleWheel}
        >
          {/* Background grid */}
          <defs>
            <pattern
              id="grid"
              width="40"
              height="40"
              patternUnits="userSpaceOnUse"
              patternTransform={`scale(${zoom})`}
            >
              <path
                d="M 40 0 L 0 0 0 40"
                fill="none"
                stroke="var(--muted)"
                strokeWidth="0.5"
                opacity="0.3"
              />
            </pattern>
          </defs>

          <g transform={`translate(${pan.x}, ${pan.y}) scale(${zoom})`}>
            {/* Grid background */}
            <rect
              x={bounds.minX - MAP_PADDING}
              y={bounds.minY - MAP_PADDING}
              width={bounds.width}
              height={bounds.height}
              fill="url(#grid)"
              className="pointer-events-none"
            />

            {/* Career Lines */}
            {paths.map(path => (
              <CareerLine
                key={path.id}
                id={path.id}
                name={path.name}
                color={path.color}
                nodes={path.nodes}
                isHighlighted={path.id === selectedPathId}
                currentNodeId={path.nodes.find(n => n.isCurrent)?.id}
              />
            ))}

            {/* Career Nodes */}
            {paths.map(path => (
              <g key={`nodes-${path.id}`}>
                {path.nodes.map(node => (
                  <CareerNode
                    key={node.id}
                    node={node}
                    lineColor={path.color}
                    isSelected={selectedNode?.id === node.id}
                    onSelect={handleNodeSelect}
                    onSetTarget={onSetTarget}
                    userSkills={userSkills}
                    scale={zoom}
                  />
                ))}
              </g>
            ))}
          </g>
        </svg>

        {/* Legend */}
        <AnimatePresence>
          {showLegend && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              className="absolute bottom-4 left-4 p-3 bg-card border rounded-lg shadow-lg"
            >
              <div className="flex items-center justify-between mb-2">
                <h4 className="text-sm font-medium flex items-center gap-2">
                  <Map className="w-4 h-4" />
                  Légende
                </h4>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-6 w-6"
                  onClick={() => setShowLegend(false)}
                >
                  ×
                </Button>
              </div>
              <div className="space-y-2">
                {paths.map(path => (
                  <div key={path.id} className="flex items-center gap-2">
                    <div
                      className="w-4 h-1 rounded"
                      style={{ backgroundColor: path.color }}
                    />
                    <span className="text-xs text-muted-foreground">
                      {path.name}
                    </span>
                    {path.isPrimary && (
                      <Badge variant="outline" className="text-[10px] h-4 px-1">
                        Principal
                      </Badge>
                    )}
                  </div>
                ))}
              </div>
              <div className="mt-3 pt-2 border-t space-y-1">
                <div className="flex items-center gap-2 text-xs">
                  <div className="w-3 h-3 rounded-full border-2 border-dashed border-emerald-500" />
                  <span className="text-muted-foreground">Position actuelle</span>
                </div>
                <div className="flex items-center gap-2 text-xs">
                  <div className="w-3 h-3 rounded-full bg-amber-500 flex items-center justify-center">
                    <span className="text-[8px] text-white">★</span>
                  </div>
                  <span className="text-muted-foreground">Objectif</span>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Show Legend Button */}
        {!showLegend && (
          <Button
            variant="outline"
            size="sm"
            className="absolute bottom-4 left-4"
            onClick={() => setShowLegend(true)}
          >
            <Layers className="w-4 h-4 mr-2" />
            Légende
          </Button>
        )}

        {/* Drag indicator */}
        <div className="absolute bottom-4 right-4 flex items-center gap-2 text-xs text-muted-foreground">
          <GripVertical className="w-4 h-4" />
          <span className="hidden sm:inline">Glisser pour naviguer</span>
          <span className="sm:hidden">Pincer pour zoomer</span>
        </div>

        {/* Loading overlay */}
        {isLoading && (
          <div className="absolute inset-0 bg-background/50 flex items-center justify-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
          </div>
        )}

        {/* Detail Panel */}
        {selectedPath && selectedNode && (
          <NodeDetailPanel
            node={selectedNode}
            lineColor={selectedPath.color}
            lineName={selectedPath.name}
            onClose={handleClosePanel}
            onSetTarget={onSetTarget}
            onViewJobs={onViewJobs}
            userSkills={userSkills}
            isOpen={isPanelOpen}
          />
        )}
      </div>
    </TooltipProvider>
  );
};

export default CareerMap;
