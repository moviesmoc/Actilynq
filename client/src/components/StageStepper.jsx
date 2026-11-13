import React from 'react';
import { Check, ChevronRight, ChevronLeft, Plane, Sparkles, SlidersHorizontal } from 'lucide-react';
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
  const currentConfig = STAGE_CONFIG[currentStage] || { label: currentStage };
  const nextStageKey = currentIdx >= 0 && currentIdx < STAGE_FLOW.length - 1 ? STAGE_FLOW[currentIdx + 1] : null;
  const nextConfig = nextStageKey ? STAGE_CONFIG[nextStageKey] : null;
  const prevStageKey = currentIdx > 0 ? STAGE_FLOW[currentIdx - 1] : null;

  const progressPercent = currentIdx >= 0
    ? Math.round(((currentIdx + 1) / STAGE_FLOW.length) * 100)
    : (isTerminalWon ? 100 : 0);

  return (
    <div className="w-full max-w-full bg-white border border-slate-200/90 rounded-2xl p-3.5 sm:p-5 shadow-2xs overflow-hidden">
      {/* Top Meta Bar */}
      <div className="flex items-center justify-between mb-3 gap-2 flex-wrap">
        <div className="flex items-center gap-2 min-w-0">
          <Plane className="w-4 h-4 text-teal-600 -rotate-45 flex-shrink-0" />
          <span className="text-xs font-bold text-slate-900 uppercase tracking-wider truncate">
            Travel Sales Progression Track
          </span>
          <span className="text-[10px] text-slate-400 font-medium hidden sm:inline">
            (Step {currentIdx >= 0 ? currentIdx + 1 : '—'} of {STAGE_FLOW.length})
          </span>
        </div>

        <div className="flex items-center gap-2">
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
      </div>

      {/* MOBILE COMPACT VIEW (< md screens) */}
      <div className="block md:hidden space-y-2.5">
        <div className="bg-slate-50 p-3 rounded-xl border border-slate-200/80">
          <div className="flex items-center justify-between text-xs mb-1.5">
            <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
              Step {currentIdx >= 0 ? currentIdx + 1 : '—'} of {STAGE_FLOW.length}
            </span>
            <span className="font-extrabold text-teal-700 text-xs">
              {progressPercent}% Complete
            </span>
          </div>

          {/* Progress Bar */}
          <div className="h-2 w-full bg-slate-200 rounded-full overflow-hidden mb-2">
            <div
              className="h-full bg-gradient-to-r from-teal-600 to-teal-500 rounded-full transition-all duration-300"
              style={{ width: `${progressPercent}%` }}
            />
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5">
              <span className="text-[11px] text-slate-500">Current:</span>
              <span className="text-xs font-bold text-slate-900">
                {currentConfig.label}
              </span>
            </div>

            {/* Quick dropdown for mobile stage jumping */}
            {!isTerminalLost && !isTerminalWon && onSelectTargetStage && (
              <select
                aria-label="Change stage"
                value={currentStage}
                onChange={(e) => onSelectTargetStage(e.target.value)}
                className="text-[11px] font-semibold py-1 px-2 border border-slate-200 rounded-lg bg-white text-teal-800 focus:outline-none"
              >
                {STAGE_FLOW.map((sk) => (
                  <option key={sk} value={sk}>
                    {STAGE_CONFIG[sk]?.label}
                  </option>
                ))}
                <option value={STAGES.LOST}>Closed Lost</option>
              </select>
            )}
          </div>
        </div>

        {/* Quick Mobile Action Buttons */}
        {!isTerminalLost && !isTerminalWon && nextStageKey && onSelectTargetStage && (
          <div className="flex items-center gap-2 pt-1">
            {prevStageKey && (
              <button
                type="button"
                onClick={() => onSelectTargetStage(prevStageKey)}
                className="px-2.5 py-1.5 rounded-lg border border-slate-200 bg-white text-slate-600 text-xs font-semibold hover:bg-slate-50 flex items-center gap-1 active:scale-95"
                title="Go back to previous stage"
              >
                <ChevronLeft className="w-3.5 h-3.5" />
                <span>Prev</span>
              </button>
            )}

            <button
              type="button"
              onClick={() => onSelectTargetStage(nextStageKey)}
              className="flex-1 py-1.5 px-3 rounded-lg bg-teal-700 hover:bg-teal-800 text-white text-xs font-bold flex items-center justify-center gap-1 shadow-xs active:scale-95 transition-all"
            >
              <span>Advance to {nextConfig?.label}</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>
        )}
      </div>

      {/* DESKTOP FULL STEPPER VIEW (>= md screens) */}
      <div className="hidden md:flex items-center justify-between overflow-x-auto py-2 gap-1.5 sm:gap-2 custom-scroll w-full max-w-full min-w-0">
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
            <div key={stageKey} className="flex items-center flex-1 min-w-[95px] lg:min-w-[105px]">
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
