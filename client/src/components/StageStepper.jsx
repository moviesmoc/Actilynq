import React from 'react';
import { Check, ChevronRight, Plane, Sparkles } from 'lucide-react';
import { STAGES, STAGE_CONFIG } from '../utils/constants';

const STAGE_FLOW = [
  STAGES.NEW_ENQUIRY,
  STAGES.CONTACTED,
  STAGES.REQUIREMENTS_COLLECTED,
  STAGES.PACKAGE_PREPARATION,
  STAGES.QUOTATION_SENT,
  STAGES.FOLLOW_UP,
  STAGES.NEGOTIATION,
  STAGES.BOOKING_CONFIRMED
];

export default function StageStepper({
  currentStage,
  onSelectTargetStage
}) {
  const isTerminalLost = currentStage === STAGES.LOST;
  const isTerminalWon = currentStage === STAGES.BOOKING_CONFIRMED;

  const currentIdx = STAGE_FLOW.indexOf(currentStage);

  return (
    <div className="w-full bg-white border border-slate-200/90 rounded-2xl p-4 sm:p-5 shadow-2xs">
      <div className="flex items-center justify-between mb-3.5">
        <div className="flex items-center gap-2">
          <Plane className="w-4 h-4 text-teal-600 -rotate-45" />
          <span className="text-xs font-bold text-slate-900 uppercase tracking-wider">
            Travel Sales Progression Track
          </span>
          <span className="text-[10px] text-slate-400 font-medium hidden sm:inline">
            (Step {currentIdx >= 0 ? currentIdx + 1 : '—'} of {STAGE_FLOW.length})
          </span>
        </div>

        {isTerminalLost && (
          <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-rose-50 text-rose-700 border border-rose-200">
            Closed Lost
          </span>
        )}
        {isTerminalWon && (
          <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 flex items-center gap-1">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Confirmed Won!</span>
          </span>
        )}
      </div>

      {/* Stepper Track */}
      <div className="flex items-center justify-between overflow-x-auto py-2 gap-1.5 sm:gap-2 custom-scroll">
        {STAGE_FLOW.map((stageKey, idx) => {
          const config = STAGE_CONFIG[stageKey] || { label: stageKey };
          const isPassed = !isTerminalLost && currentIdx > idx;
          const isCurrent = currentStage === stageKey;
          const isFuture = !isTerminalLost && currentIdx < idx;

          let stepClass = 'bg-slate-50 text-slate-400 border-slate-200';
          if (isPassed) {
            stepClass = 'bg-teal-50/70 text-teal-800 border-teal-300 font-semibold';
          } else if (isCurrent) {
            stepClass = 'bg-gradient-to-r from-teal-700 to-teal-800 text-white border-teal-700 font-bold ring-2 ring-teal-600/30 shadow-xs';
          }

          return (
            <div key={stageKey} className="flex items-center flex-1 min-w-[105px]">
              <button
                type="button"
                onClick={() => {
                  if (onSelectTargetStage && !isCurrent) {
                    onSelectTargetStage(stageKey);
                  }
                }}
                disabled={isTerminalLost || isTerminalWon}
                className={`w-full py-2 px-2 rounded-xl border text-center text-xs transition-all duration-150 flex items-center justify-center gap-1.5 ${stepClass} ${
                  !isTerminalLost && !isTerminalWon && !isCurrent ? 'hover:border-teal-400 hover:text-teal-900 cursor-pointer active:scale-95' : ''
                }`}
                title={`Advance enquiry to ${config.label}`}
              >
                {isPassed ? (
                  <Check className="w-3 h-3 text-teal-600 flex-shrink-0" />
                ) : isCurrent ? (
                  <Plane className="w-3 h-3 text-white -rotate-45 flex-shrink-0 animate-bounce" />
                ) : (
                  <span className="text-[10px] font-bold opacity-60">
                    {idx + 1}
                  </span>
                )}
                <span className="truncate text-[11px]">{config.label}</span>
              </button>

              {idx < STAGE_FLOW.length - 1 && (
                <ChevronRight className="w-3.5 h-3.5 text-slate-300 flex-shrink-0 mx-0.5" />
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
