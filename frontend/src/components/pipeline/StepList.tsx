import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import type { DragEndEvent } from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { Plus, ListOrdered } from 'lucide-react';
import type { PipelineStep, ProcessingEndpoint } from '../../types';
import StepCard from './StepCard';

interface StepListProps {
  steps: PipelineStep[];
  setSteps: (steps: PipelineStep[] | ((prev: PipelineStep[]) => PipelineStep[])) => void;
}

const StepList = ({ steps, setSteps }: StepListProps) => {
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    
    if (over && active.id !== over.id) {
      setSteps((items) => {
        const oldIndex = items.findIndex((i) => i.id === active.id);
        const newIndex = items.findIndex((i) => i.id === over.id);
        return arrayMove(items, oldIndex, newIndex);
      });
    }
  };

  const addStep = (module: ProcessingEndpoint) => {
    const newStep: PipelineStep = {
      id: `step_${Date.now()}`,
      module,
      config: {},
      enabled: true
    };
    
    // Default configs
    if (module === 'windowing') newStep.config = { preset: 'lung' };
    if (module === 'noise-removal') newStep.config = { method: 'gaussian' };
    if (module === 'edge-detection') newStep.config = { method: 'sobel' };
    if (module === 'segmentation') newStep.config = { min_thresh: 100, max_thresh: 200 };
    
    setSteps([...steps, newStep]);
  };

  const updateStep = (id: string, updates: Partial<PipelineStep>) => {
    setSteps(steps.map(step => 
      step.id === id ? { ...step, ...updates } : step
    ));
  };

  const removeStep = (id: string) => {
    setSteps(steps.filter(step => step.id !== id));
  };

  return (
    <div className="bg-white border border-gray-300 p-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-sm font-bold text-slate-900 uppercase tracking-widest flex items-center gap-2">
          <ListOrdered className="w-5 h-5 text-cyan-600" /> Pipeline Steps
        </h2>
        <span className="text-xs text-slate-400 font-mono">{steps.length} STEPS</span>
      </div>

      <div className="mb-6">
        <DndContext 
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragEnd={handleDragEnd}
        >
          <SortableContext 
            items={steps}
            strategy={verticalListSortingStrategy}
          >
            {steps.map((step, index) => (
              <StepCard
                key={step.id}
                step={step}
                index={index}
                onUpdate={updateStep}
                onRemove={removeStep}
              />
            ))}
          </SortableContext>
        </DndContext>
        
        {steps.length === 0 && (
          <div className="text-center py-8 border-2 border-dashed border-gray-200 text-slate-400 text-sm font-bold uppercase tracking-widest">
            No steps configured. Select a preset or add steps manually.
          </div>
        )}
      </div>

      <div className="border-t border-gray-200 pt-4">
        <label className="text-xs font-bold text-slate-500 uppercase tracking-tight block mb-2">ADD NEW STEP</label>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-2">
          <button onClick={() => addStep('windowing')} className="flex items-center justify-center gap-1 py-2 bg-gray-50 hover:bg-gray-100 border border-gray-200 text-xs font-bold text-slate-600">
            <Plus className="w-3 h-3" /> WINDOWING
          </button>
          <button onClick={() => addStep('noise-removal')} className="flex items-center justify-center gap-1 py-2 bg-gray-50 hover:bg-gray-100 border border-gray-200 text-xs font-bold text-slate-600">
            <Plus className="w-3 h-3" /> DENOISE
          </button>
          <button onClick={() => addStep('edge-detection')} className="flex items-center justify-center gap-1 py-2 bg-gray-50 hover:bg-gray-100 border border-gray-200 text-xs font-bold text-slate-600">
            <Plus className="w-3 h-3" /> EDGE
          </button>
          <button onClick={() => addStep('segmentation')} className="flex items-center justify-center gap-1 py-2 bg-gray-50 hover:bg-gray-100 border border-gray-200 text-xs font-bold text-slate-600">
            <Plus className="w-3 h-3" /> ROI
          </button>
        </div>
      </div>
    </div>
  );
};

export default StepList;
