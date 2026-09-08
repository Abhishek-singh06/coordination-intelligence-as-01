'use client';

import React, { useEffect, useState, useRef } from 'react';
import { useStore } from '@/lib/store';
import { TaskNode } from './TaskNode';
import { Layers } from 'lucide-react';

export const DependencyGraph: React.FC = () => {
  const { getCurrentTasks, getCurrentDependencies, selectedTaskId, setSelectedTaskId } = useStore();

  const tasks = getCurrentTasks();
  const dependencies = getCurrentDependencies();

  const containerRef = useRef<HTMLDivElement>(null);
  const nodeRefs = useRef<Record<string, HTMLDivElement | null>>({});

  const [lines, setLines] = useState<
    { id: string; source: string; target: string; isBlocked: boolean; path: string }[]
  >([]);

  const columns = [
    { col: 1, title: 'Phase 1: Design' },
    { col: 2, title: 'Phase 2: MEP' },
    { col: 3, title: 'Phase 3: Fab & Frame' },
    { col: 4, title: 'Phase 4: Compliance' },
    { col: 5, title: 'Phase 5: Drywall' },
    { col: 6, title: 'Phase 6: Handover' },
  ];

  const updateLines = () => {
    if (!containerRef.current) return;
    const containerRect = containerRef.current.getBoundingClientRect();

    const newLines = dependencies.map((edge) => {
      const sourceEl = nodeRefs.current[edge.source];
      const targetEl = nodeRefs.current[edge.target];

      if (!sourceEl || !targetEl) {
        return { id: edge.id, source: edge.source, target: edge.target, isBlocked: false, path: '' };
      }

      const sourceRect = sourceEl.getBoundingClientRect();
      const targetRect = targetEl.getBoundingClientRect();

      const startX = sourceRect.right - containerRect.left;
      const startY = sourceRect.top + sourceRect.height / 2 - containerRect.top;

      const endX = targetRect.left - containerRect.left;
      const endY = targetRect.top + targetRect.height / 2 - containerRect.top;

      const dx = Math.max(40, (endX - startX) / 2);
      const path = `M ${startX} ${startY} C ${startX + dx} ${startY}, ${endX - dx} ${endY}, ${endX} ${endY}`;

      const sourceTask = tasks.find((t) => t.id === edge.source);
      const targetTask = tasks.find((t) => t.id === edge.target);

      const isBlocked = (sourceTask?.status === 'BLOCKED') || (targetTask?.status === 'BLOCKED');

      return {
        id: edge.id,
        source: edge.source,
        target: edge.target,
        isBlocked,
        path,
      };
    });

    setLines(newLines);
  };

  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
    updateLines();
    const handleResize = () => updateLines();
    window.addEventListener('resize', handleResize);
    const timer = setTimeout(updateLines, 100);
    return () => {
      window.removeEventListener('resize', handleResize);
      clearTimeout(timer);
    };
  }, [tasks, dependencies]);

  return (
    <div className="bg-[#323522] border border-[#81815D]/40 rounded-xl p-5 shadow-lg relative overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between mb-4 border-b border-[#81815D]/30 pb-3">
        <div className="flex items-center gap-2">
          <Layers className="h-5 w-5 text-rose-200" />
          <h2 className="text-sm font-bold text-slate-100 uppercase tracking-wide">
            Dependency Graph & Flow DAG
          </h2>
        </div>
        <div className="flex items-center gap-4 text-xs font-medium text-slate-300">
          <span className="flex items-center gap-1.5">
            <span className="h-2 w-2 rounded-full bg-emerald-400"></span> Completed
          </span>
          <span className="flex items-center gap-1.5">
            <span className="h-2 w-2 rounded-full bg-rose-200"></span> In Progress
          </span>
          <span className="flex items-center gap-1.5">
            <span className="h-2 w-2 rounded-full bg-rose-400"></span> Blocked
          </span>
          <span className="flex items-center gap-1.5">
            <span className="h-2 w-2 rounded-full bg-[#81815D]"></span> Pending/Not Started
          </span>
        </div>
      </div>

      {/* Main Canvas */}
      <div ref={containerRef} className="relative min-h-[460px] w-full overflow-x-auto py-2">
        <svg className="absolute inset-0 w-full h-full pointer-events-none z-10">
          <defs>
            <marker
              id="arrow-normal"
              viewBox="0 0 10 10"
              refX="8"
              refY="5"
              markerWidth="6"
              markerHeight="6"
              orient="auto-start-reverse"
            >
              <path d="M 0 0 L 10 5 L 0 10 z" fill="#81815D" />
            </marker>
            <marker
              id="arrow-blocked"
              viewBox="0 0 10 10"
              refX="8"
              refY="5"
              markerWidth="6"
              markerHeight="6"
              orient="auto-start-reverse"
            >
              <path d="M 0 0 L 10 5 L 0 10 z" fill="#6F2B34" />
            </marker>
          </defs>

          {isMounted &&
            lines.map((line) => (
              <path
                key={line.id}
                d={line.path}
                fill="none"
                stroke={line.isBlocked ? '#6F2B34' : '#81815D'}
                strokeWidth={line.isBlocked ? '2.5' : '1.5'}
                strokeDasharray={line.isBlocked ? '6 4' : undefined}
                markerEnd={line.isBlocked ? 'url(#arrow-blocked)' : 'url(#arrow-normal)'}
                className={line.isBlocked ? 'animate-pulse' : 'transition-all duration-300'}
              />
            ))}
        </svg>

        <div className="grid grid-cols-6 gap-4 min-w-[900px] relative z-20">
          {columns.map((col) => {
            const colTasks = tasks.filter((t) => t.gridCol === col.col);
            return (
              <div key={col.col} className="flex flex-col gap-4">
                <div className="text-[11px] font-bold text-slate-300 uppercase tracking-wider bg-[#111506]/70 px-2.5 py-1.5 rounded-md border border-[#81815D]/30 text-center font-mono">
                  {col.title}
                </div>
                <div className="flex flex-col gap-4 justify-around min-h-[380px]">
                  {colTasks.map((task) => (
                    <div
                      key={task.id}
                      ref={(el) => {
                        nodeRefs.current[task.id] = el;
                      }}
                      className="w-full"
                    >
                      <TaskNode
                        task={task}
                        isSelected={selectedTaskId === task.id}
                        onClick={() => setSelectedTaskId(task.id)}
                      />
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
