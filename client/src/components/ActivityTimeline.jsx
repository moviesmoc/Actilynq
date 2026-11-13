import React from 'react';
import {
  Phone,
  MessageCircle,
  Mail,
  Users,
  FileText,
  TrendingUp,
  Tag,
  CheckCircle2,
  Calendar
} from 'lucide-react';
import { formatDateTime, formatRelativeTime, formatCurrency } from '../utils/formatters';

const TYPE_ICONS = {
  call: Phone,
  whatsapp: MessageCircle,
  email: Mail,
  meeting: Users,
  note: FileText,
  stage_change: TrendingUp,
  quotation_sent: Tag,
  requirement_update: FileText,
  follow_up: Calendar
};

const TYPE_COLORS = {
  call: 'bg-blue-100 text-blue-700 border-blue-200',
  whatsapp: 'bg-emerald-100 text-emerald-700 border-emerald-200',
  email: 'bg-sky-100 text-sky-700 border-sky-200',
  meeting: 'bg-indigo-100 text-indigo-700 border-indigo-200',
  note: 'bg-slate-100 text-slate-700 border-slate-200',
  stage_change: 'bg-purple-100 text-purple-700 border-purple-200',
  quotation_sent: 'bg-amber-100 text-amber-700 border-amber-200',
  requirement_update: 'bg-teal-100 text-teal-700 border-teal-200',
  follow_up: 'bg-rose-100 text-rose-700 border-rose-200'
};

export default function ActivityTimeline({ activities = [] }) {
  if (!activities || activities.length === 0) {
    return (
      <div className="py-8 text-center text-xs text-slate-500 bg-slate-50 rounded-lg border border-dashed border-slate-200">
        No activities or notes recorded yet.
      </div>
    );
  }

  return (
    <div className="flow-root">
      <ul className="-mb-8">
        {activities.map((activity, idx) => {
          const Icon = TYPE_ICONS[activity.type] || FileText;
          const colorClass = TYPE_COLORS[activity.type] || 'bg-slate-100 text-slate-700 border-slate-200';
          const isLast = idx === activities.length - 1;

          return (
            <li key={activity._id || idx}>
              <div className="relative pb-8">
                {!isLast && (
                  <span
                    className="absolute top-4 left-4 -ml-px h-full w-0.5 bg-slate-200"
                    aria-hidden="true"
                  />
                )}
                <div className="relative flex items-start space-x-3">
                  {/* Icon Node */}
                  <div className={`h-8 w-8 rounded-full border flex items-center justify-center flex-shrink-0 ${colorClass}`}>
                    <Icon className="h-4 w-4" />
                  </div>

                  {/* Content Box */}
                  <div className="min-w-0 flex-1 bg-white p-3.5 rounded-lg border border-slate-200/90 shadow-2xs">
                    <div className="flex items-center justify-between gap-2 flex-wrap mb-1">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-semibold text-slate-900">
                          {activity.title}
                        </span>
                        {activity.isCustomerContact && (
                          <span className="inline-flex items-center gap-1 text-[10px] font-medium text-emerald-700 bg-emerald-50 border border-emerald-200 px-1.5 py-0.2 rounded">
                            <CheckCircle2 className="w-3 h-3" />
                            Confirmed Contact
                          </span>
                        )}
                      </div>
                      <span className="text-[11px] text-slate-400" title={formatDateTime(activity.occurredAt)}>
                        {formatRelativeTime(activity.occurredAt)}
                      </span>
                    </div>

                    {activity.description && (
                      <p className="text-xs text-slate-600 leading-relaxed whitespace-pre-line">
                        {activity.description}
                      </p>
                    )}

                    {/* Metadata details */}
                    {activity.metadata && (
                      <div className="mt-2 text-[11px] text-slate-500 space-y-0.5">
                        {activity.metadata.contactOutcome && (
                          <div>Outcome: <span className="font-medium text-slate-700 capitalize">{activity.metadata.contactOutcome.replace('_', ' ')}</span></div>
                        )}
                        {activity.metadata.quotationAmount && (
                          <div>Quotation: <span className="font-semibold text-slate-800">{formatCurrency(activity.metadata.quotationAmount)}</span></div>
                        )}
                        {activity.metadata.reopenReason && (
                          <div className="italic text-amber-700">Reopen note: "{activity.metadata.reopenReason}"</div>
                        )}
                      </div>
                    )}

                    <div className="mt-2 pt-2 border-t border-slate-100 flex items-center justify-between text-[10px] text-slate-400">
                      <span>Logged by {activity.userId?.name || 'Sales Agent'}</span>
                      <span>{formatDateTime(activity.occurredAt)}</span>
                    </div>
                  </div>
                </div>
              </div>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
