'use client';

import { motion, useMotionValue, useTransform, animate } from 'framer-motion';
import { useEffect, useState, useMemo, memo } from 'react';
import { cn } from '@/lib/utils';
import type { CareerNodeData } from './CareerNode';

interface CareerLineProps {
  id: string;
  name: string;
  color: string;
  nodes: CareerNodeData[];
  currentNodeId?: string;
  showTrain?: boolean;
  trainProgress?: number; // 0-100 representing position along the path
  isHighlighted?: boolean;
  connectionPoints?: { x: number; y: number; label?: string }[];
  animated?: boolean;
}

// Generate a smooth path through all nodes
const generatePath = (nodes: CareerNodeData[], curveAmount = 0.5): string => {
  if (nodes.length < 2) return '';

  // Sort nodes by position (x coordinate)
  const sortedNodes = [...nodes].sort((a, b) => a.x - b.x);

  let path = `M ${sortedNodes[0].x} ${sortedNodes[0].y}`;

  for (let i = 1; i < sortedNodes.length; i++) {
    const prev = sortedNodes[i - 1];
    const curr = sortedNodes[i];
    const next = sortedNodes[i + 1];

    // Calculate control points for smooth curves
    const dx = curr.x - prev.x;
    const dy = curr.y - prev.y;

    if (next) {
      // Use quadratic bezier curve for smooth transitions
      const cpX = prev.x + dx * curveAmount;
      const cpY = prev.y + dy * curveAmount;
      path += ` Q ${cpX} ${cpY}, ${curr.x} ${curr.y}`;
    } else {
      // Last node - straight line or simple curve
      path += ` L ${curr.x} ${curr.y}`;
    }
  }

  return path;
};

// Get point along path at given progress
const getPointAlongPath = (
  pathElement: SVGPathElement | null,
  progress: number
): { x: number; y: number } => {
  if (!pathElement) return { x: 0, y: 0 };
  const length = pathElement.getTotalLength();
  const point = pathElement.getPointAtLength(length * (progress / 100));
  return { x: point.x, y: point.y };
};

// Animated train component
const AnimatedTrain = ({
  pathRef,
  progress,
  color,
}: {
  pathRef: React.RefObject<SVGPathElement | null>;
  progress: number;
  color: string;
}) => {
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [rotation, setRotation] = useState(0);

  useEffect(() => {
    if (!pathRef.current) return;

    const updatePosition = () => {
      const point = getPointAlongPath(pathRef.current, progress);
      setPosition(point);

      // Calculate rotation based on direction
      const prevPoint = getPointAlongPath(pathRef.current, Math.max(0, progress - 1));
      const angle = Math.atan2(point.y - prevPoint.y, point.x - prevPoint.x) * (180 / Math.PI);
      setRotation(angle);
    };

    updatePosition();
  }, [progress, pathRef]);

  return (
    <motion.g
      style={{
        transform: `translate(${position.x}px, ${position.y}px) rotate(${rotation}deg)`,
      }}
    >
      {/* Train glow */}
      <motion.circle
        r={12}
        fill={color}
        opacity={0.3}
        animate={{
          scale: [1, 1.3, 1],
          opacity: [0.3, 0.5, 0.3],
        }}
        transition={{
          duration: 2,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
      />
      {/* Train body */}
      <motion.rect
        x={-8}
        y={-5}
        width={16}
        height={10}
        rx={3}
        fill={color}
        stroke="white"
        strokeWidth={1.5}
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ type: 'spring', stiffness: 300, damping: 20 }}
      />
      {/* Train front light */}
      <motion.circle
        cx={6}
        cy={0}
        r={2}
        fill="white"
        animate={{ opacity: [1, 0.5, 1] }}
        transition={{ duration: 1, repeat: Infinity }}
      />
    </motion.g>
  );
};

const CareerLineComponent = ({
  id,
  name,
  color,
  nodes,
  currentNodeId,
  showTrain = true,
  trainProgress = 0,
  isHighlighted = false,
  connectionPoints = [],
  animated = true,
}: CareerLineProps) => {
  const pathRef = useState<SVGPathElement | null>(null)[0];
  const setPathRef = useState<SVGPathElement | null>(null)[1];
  const [pathLength, setPathLength] = useState(0);
  const progress = useMotionValue(0);

  // Generate path string
  const pathD = useMemo(() => generatePath(nodes), [nodes]);

  // Animate path drawing on mount
  useEffect(() => {
    if (pathRef) {
      const length = pathRef.getTotalLength();
      // Use requestAnimationFrame to avoid synchronous setState warning
      requestAnimationFrame(() => {
        setPathLength(length);
      });
      if (animated) {
        animate(progress, 1, { duration: 1.5, ease: 'easeInOut' });
      } else {
        progress.set(1);
      }
    }
  }, [pathRef, animated]);

  const strokeDasharray = useTransform(progress, (latest) => {
    const length = pathLength || 1000;
    return `${latest * length} ${length}`;
  });

  // Find current node index
  const currentNodeIndex = nodes.findIndex(n => n.id === currentNodeId);

  return (
    <g className="career-line" data-line-id={id}>
      {/* Line glow effect */}
      <motion.path
        d={pathD}
        fill="none"
        stroke={color}
        strokeWidth={isHighlighted ? 12 : 8}
        strokeLinecap="round"
        strokeLinejoin="round"
        opacity={isHighlighted ? 0.3 : 0.15}
        filter="blur(4px)"
        initial={{ pathLength: 0 }}
        animate={{ pathLength: 1 }}
        transition={{ duration: 1.5, ease: 'easeInOut' }}
      />

      {/* Main line */}
      <motion.path
        ref={(el) => {
          if (el) {
            setPathRef(el);
          }
        }}
        d={pathD}
        fill="none"
        stroke={color}
        strokeWidth={isHighlighted ? 5 : 3}
        strokeLinecap="round"
        strokeLinejoin="round"
        style={{
          strokeDasharray,
          opacity: isHighlighted ? 1 : 0.7,
        }}
        initial={{ pathLength: 0 }}
        animate={{ pathLength: 1 }}
        transition={{ duration: 1.5, ease: 'easeInOut' }}
      />

      {/* Progress indicator (filled portion up to current node) */}
      {currentNodeIndex >= 0 && (
        <motion.path
          d={generatePath(nodes.slice(0, currentNodeIndex + 1))}
          fill="none"
          stroke={color}
          strokeWidth={isHighlighted ? 5 : 3}
          strokeLinecap="round"
          strokeLinejoin="round"
          opacity={1}
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 1, ease: 'easeInOut', delay: 0.5 }}
        />
      )}

      {/* Animated train */}
      {showTrain && trainProgress > 0 && (
        <AnimatedTrain
          pathRef={{ current: pathRef }}
          progress={trainProgress}
          color={color}
        />
      )}

      {/* Connection points (transfer stations) */}
      {connectionPoints.map((point, index) => (
        <g key={`connection-${index}`} transform={`translate(${point.x}, ${point.y})`}>
          {/* Outer ring */}
          <circle
            r={16}
            fill="var(--background)"
            stroke={color}
            strokeWidth={2}
            strokeDasharray="3 2"
          />
          {/* Inner circle */}
          <circle r={8} fill={color} />
          {/* Connection icon */}
          <circle
            r={3}
            fill="white"
            cx={-3}
          />
          <circle
            r={3}
            fill="white"
            cx={3}
          />
          {point.label && (
            <text
              y={25}
              textAnchor="middle"
              className="text-[10px] fill-muted-foreground"
            >
              {point.label}
            </text>
          )}
        </g>
      ))}

      {/* Station markers (small dots along the line) */}
      {nodes.map((node, index) => (
        <motion.g
          key={node.id}
          initial={{ opacity: 0, scale: 0 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.1 * index + 0.5 }}
        >
          {/* Small connector dots between nodes */}
          {index < nodes.length - 1 && (
            <>
              {[0.33, 0.66].map((t, i) => {
                const nextNode = nodes[index + 1];
                const x = node.x + (nextNode.x - node.x) * t;
                const y = node.y + (nextNode.y - node.y) * t;
                return (
                  <circle
                    key={`dot-${index}-${i}`}
                    cx={x}
                    cy={y}
                    r={2}
                    fill={color}
                    opacity={0.4}
                  />
                );
              })}
            </>
          )}
        </motion.g>
      ))}

      {/* Line label */}
      <motion.g
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1 }}
      >
        {nodes[0] && (
          <g transform={`translate(${nodes[0].x - 40}, ${nodes[0].y})`}>
            <rect
              x={-30}
              y={-10}
              width={60}
              height={20}
              rx={4}
              fill={color}
            />
            <text
              x={0}
              y={0}
              textAnchor="middle"
              dominantBaseline="middle"
              className="text-[10px] font-bold fill-white"
            >
              {name}
            </text>
          </g>
        )}
      </motion.g>
    </g>
  );
};

export const CareerLine = memo(CareerLineComponent);
