import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Search,
  Filter,
  Plus,
  Users,
  MapPin,
  Calendar,
  Phone,
  MessageCircle,
  Archive,
  RefreshCw,
  AlertCircle,
  ChevronLeft,
  ChevronRight,
  Plane,
  Clock,
  Compass,
  ArrowUpRight
} from 'lucide-react';
import api from '../api/client';
import StatusBadge from '../components/StatusBadge';
import { STAGES, STAGE_CONFIG, TRAVEL_TYPES } from '../utils/constants';
import { formatCurrency, formatDate, formatRelativeTime } from '../utils/formatters';
import { createWhatsAppUrl, createTelUrl } from '../utils/whatsapp';
import WhatsAppConfirmModal from '../components/WhatsAppConfirmModal';
import CallOutcomeModal from '../components/CallOutcomeModal';

export default function LeadsList() {
  const [leads, setLeads] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  // Filters & Search
  const [search, setSearch] = useState('');
  const [stageFilter, setStageFilter] = useState('');
  const [typeFilter, setTypeFilter] = useState('');
  const [includeArchived, setIncludeArchived] = useState(false);
  const [pagination, setPagination] = useState({ page: 1, limit: 25, total: 0, pages: 1 });

  // Modals state
  const [selectedLead, setSelectedLead] = useState(null);
  const [modalType, setModalType] = useState(null);

  const fetchLeads = async (page = 1) => {
    try {
      setLoading(true);
      setError('');
      const params = new URLSearchParams({
        page,
        limit: 25,
        includeArchived: includeArchived ? 'true' : 'false'
      });

      if (search.trim()) params.append('search', search.trim());
      if (stageFilter) params.append('stage', stageFilter);
      if (typeFilter) params.append('travelType', typeFilter);

      const res = await api.get(`/leads?${params.toString()}`);
      if (res.data?.success) {
        setLeads(res.data.leads || []);
        setPagination(res.data.pagination || { page: 1, limit: 25, total: 0, pages: 1 });
      }
    } catch (err) {
      setError(err.message || 'Failed to fetch enquiries');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLeads(1);
  }, [stageFilter, typeFilter, includeArchived]);

  const handleSearch = (e) => {
    e.preventDefault();
    fetchLeads(1);
  };

  if (loading) {
    return (
      <div className="space-y-4 animate-pulse">
        <div className="h-14 bg-slate-200/80 rounded-xl" />
        <div className="h-10 bg-slate-200/80 rounded-lg" />
        <div className="space-y-2.5">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="h-20 bg-slate-200/80 rounded-xl" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl sm:text-2xl md:text-3xl font-extrabold text-slate-900 tracking-tight">
              Travel Enquiries
            </h1>
            <span className="px-2 py-0.5 rounded-full text-xs font-bold bg-slate-100 text-slate-700 border border-slate-200">
              {pagination.total} Total
            </span>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            Manage your travel client enquiries, itinerary requests, and trip stages.
          </p>
        </div>

        <Link
          to="/app/leads/new"
          className="btn-primary text-xs font-bold py-2.5 self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>New Travel Enquiry</span>
        </Link>
      </div>

      {/* Error State */}
      {error && (
        <div className="p-4 bg-rose-50 border border-rose-200 rounded-xl flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-rose-700 flex-shrink-0 mt-0.5" />
          <div>
            <p className="text-xs font-bold text-rose-900">Error loading enquiries</p>
            <p className="text-xs text-rose-700 mt-0.5">{error}</p>
          </div>
        </div>
      )}

      {/* Search & Filter Bar */}
      <div className="bg-white p-3.5 sm:p-4 rounded-xl border border-slate-200/90 shadow-2xs space-y-3">
        <form onSubmit={handleSearch} className="flex gap-2">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
            <input
              type="text"
              placeholder="Search by customer name, phone, email, or destination..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="input-base text-xs sm:text-sm pl-9"
            />
          </div>
          <button type="submit" className="btn-secondary text-xs sm:text-sm px-4">
            Search
          </button>
        </form>

        <div className="flex items-center gap-2.5 flex-wrap pt-1 border-t border-slate-100 text-xs">
          <Filter className="w-3.5 h-3.5 text-slate-400 flex-shrink-0" />

          {/* Stage Filter */}
          <select
            value={stageFilter}
            onChange={(e) => setStageFilter(e.target.value)}
            className="px-2.5 py-1.5 border border-slate-200 rounded-lg text-xs font-medium bg-slate-50 text-slate-700 focus:bg-white"
          >
            <option value="">All Workflow Stages</option>
            {Object.entries(STAGES).map(([key, stage]) => (
              <option key={stage} value={stage}>
                {STAGE_CONFIG[stage]?.label}
              </option>
            ))}
          </select>

          {/* Travel Type Filter */}
          <select
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
            className="px-2.5 py-1.5 border border-slate-200 rounded-lg text-xs font-medium bg-slate-50 text-slate-700 focus:bg-white"
          >
            <option value="">All Travel Types</option>
            {TRAVEL_TYPES.map((type) => (
              <option key={type.value} value={type.value}>
                {type.label}
              </option>
            ))}
          </select>

          {/* Include Archived */}
          <label className="flex items-center gap-1.5 text-xs text-slate-600 cursor-pointer ml-auto">
            <input
              type="checkbox"
              checked={includeArchived}
              onChange={(e) => setIncludeArchived(e.target.checked)}
              className="w-3.5 h-3.5 rounded border-slate-300 text-teal-600 focus:ring-teal-500"
            />
            <span>Include archived</span>
          </label>
        </div>
      </div>

      {/* Responsive View: Desktop Table + Mobile Cards */}
      {leads.length === 0 ? (
        <div className="p-10 bg-white border border-slate-200/90 rounded-2xl text-center shadow-xs">
          <Plane className="w-10 h-10 text-slate-300 mx-auto mb-2.5 -rotate-45" />
          <h3 className="text-sm font-bold text-slate-800">No enquiries found</h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto mt-1">
            {search || stageFilter || typeFilter
              ? 'Try clearing your filters or search keywords.'
              : 'Start by capturing your first customer trip enquiry.'}
          </p>
          <Link to="/app/leads/new" className="mt-3.5 btn-primary btn-sm inline-flex">
            <Plus className="w-3.5 h-3.5" />
            <span>Create Enquiry</span>
          </Link>
        </div>
      ) : (
        <>
          {/* Mobile Cards View (< 768px) */}
          <div className="md:hidden space-y-3">
            {leads.map((lead) => (
              <div
                key={lead._id}
                className="bg-white p-4 rounded-xl border border-slate-200/90 shadow-2xs space-y-3"
              >
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <Link
                      to={`/app/leads/${lead._id}`}
                      className="text-sm font-bold text-slate-900 hover:text-teal-700 transition-colors"
                    >
                      {lead.customerName}
                    </Link>
                    <div className="text-xs text-slate-500 mt-0.5">
                      {lead.phone} {lead.email ? `• ${lead.email}` : ''}
                    </div>
                  </div>
                  <StatusBadge stage={lead.stage} size="sm" />
                </div>

                <div className="flex items-center gap-2 flex-wrap text-xs text-slate-600 bg-slate-50 p-2.5 rounded-lg">
                  <span className="inline-flex items-center gap-1 font-semibold text-slate-900">
                    <Plane className="w-3.5 h-3.5 text-teal-600 -rotate-45" />
                    <span>{lead.destination || 'Destination TBD'}</span>
                  </span>

                  {lead.travellerCount !== null && lead.travellerCount !== undefined && (
                    <span className="inline-flex items-center gap-1 text-slate-600">
                      • <Users className="w-3 h-3 text-slate-400" />
                      <span>{lead.travellerCount} pax</span>
                    </span>
                  )}

                  {lead.travelStartDate && (
                    <span className="inline-flex items-center gap-1 text-slate-600">
                      • <Calendar className="w-3 h-3 text-slate-400" />
                      <span>{formatDate(lead.travelStartDate)}</span>
                    </span>
                  )}
                </div>

                <div className="flex items-center justify-between pt-2 border-t border-slate-100">
                  <span className="text-[11px] text-slate-400 flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    <span>{formatRelativeTime(lead.lastActivityAt)}</span>
                  </span>

                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      title="WhatsApp outreach"
                      onClick={() => {
                        const url = createWhatsAppUrl(lead.phone, `Hi ${lead.customerName}, regarding your travel enquiry...`);
                        if (url) {
                          window.open(url, '_blank', 'noopener,noreferrer');
                          setSelectedLead(lead);
                          setModalType('whatsapp');
                        }
                      }}
                      className="p-1.5 rounded-lg bg-emerald-50 text-emerald-700 border border-emerald-200"
                    >
                      <MessageCircle className="w-4 h-4" />
                    </button>

                    <button
                      type="button"
                      title="Call customer"
                      onClick={() => {
                        const url = createTelUrl(lead.phone);
                        if (url) {
                          window.location.href = url;
                          setSelectedLead(lead);
                          setModalType('call');
                        }
                      }}
                      className="p-1.5 rounded-lg bg-slate-100 text-slate-700 border border-slate-200"
                    >
                      <Phone className="w-4 h-4" />
                    </button>

                    <Link
                      to={`/app/leads/${lead._id}`}
                      className="px-2.5 py-1 text-xs font-bold text-teal-700 bg-teal-50 border border-teal-200 rounded-lg"
                    >
                      View
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Desktop Table View (>= 768px) */}
          <div className="hidden md:block bg-white rounded-xl border border-slate-200/90 shadow-2xs overflow-x-auto w-full max-w-full custom-scroll">
            <table className="w-full text-left text-xs sm:text-sm">
              <thead className="bg-slate-50/80 border-b border-slate-200 text-slate-600 font-bold uppercase tracking-wider text-[11px]">
                <tr>
                  <th className="px-5 py-3.5">Customer & Contact</th>
                  <th className="px-4 py-3.5">Destination & Pax</th>
                  <th className="px-4 py-3.5">Travel Dates</th>
                  <th className="px-4 py-3.5">Workflow Stage</th>
                  <th className="px-4 py-3.5">Last Activity</th>
                  <th className="px-4 py-3.5 text-right">Quick Outreach</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {leads.map((lead) => (
                  <tr key={lead._id} className="hover:bg-teal-50/20 transition-colors group">
                    <td className="px-5 py-3.5">
                      <Link
                        to={`/app/leads/${lead._id}`}
                        className="font-bold text-slate-900 group-hover:text-teal-700 flex items-center gap-1"
                      >
                        <span>{lead.customerName}</span>
                        <ArrowUpRight className="w-3 h-3 opacity-0 group-hover:opacity-100 text-teal-600 transition-opacity" />
                      </Link>
                      <div className="text-xs text-slate-500 mt-0.5">
                        {lead.phone} {lead.email ? `• ${lead.email}` : ''}
                      </div>
                    </td>

                    <td className="px-4 py-3.5">
                      <div className="font-semibold text-slate-800 flex items-center gap-1.5">
                        <Plane className="w-3.5 h-3.5 text-teal-600 -rotate-45" />
                        <span>{lead.destination || <em className="text-slate-400 font-normal">TBD</em>}</span>
                      </div>
                      <div className="text-xs text-slate-500">
                        {lead.travellerCount !== null && lead.travellerCount !== undefined ? `${lead.travellerCount} pax` : 'Pax TBD'}
                      </div>
                    </td>

                    <td className="px-4 py-3.5 text-xs text-slate-600">
                      {lead.travelStartDate ? (
                        <span className="flex items-center gap-1">
                          <Calendar className="w-3.5 h-3.5 text-slate-400" />
                          <span>{formatDate(lead.travelStartDate)}</span>
                        </span>
                      ) : (
                        <span className="text-slate-400 italic">Dates flexible</span>
                      )}
                    </td>

                    <td className="px-4 py-3.5">
                      <StatusBadge stage={lead.stage} size="sm" />
                    </td>

                    <td className="px-4 py-3.5 text-xs text-slate-500">
                      {formatRelativeTime(lead.lastActivityAt)}
                    </td>

                    <td className="px-4 py-3.5 text-right">
                      <div className="inline-flex items-center gap-1.5">
                        <button
                          type="button"
                          title="Send prefilled WhatsApp"
                          onClick={() => {
                            const url = createWhatsAppUrl(lead.phone, `Hi ${lead.customerName}, regarding your travel enquiry...`);
                            if (url) {
                              window.open(url, '_blank', 'noopener,noreferrer');
                              setSelectedLead(lead);
                              setModalType('whatsapp');
                            }
                          }}
                          className="p-1.5 rounded-lg text-emerald-700 hover:bg-emerald-50 border border-transparent hover:border-emerald-200 transition-colors"
                        >
                          <MessageCircle className="w-4 h-4" />
                        </button>

                        <button
                          type="button"
                          title="Call customer"
                          onClick={() => {
                            const url = createTelUrl(lead.phone);
                            if (url) {
                              window.location.href = url;
                              setSelectedLead(lead);
                              setModalType('call');
                            }
                          }}
                          className="p-1.5 rounded-lg text-slate-700 hover:bg-slate-100 border border-transparent hover:border-slate-200 transition-colors"
                        >
                          <Phone className="w-4 h-4" />
                        </button>

                        <Link
                          to={`/app/leads/${lead._id}`}
                          className="px-2.5 py-1 text-xs font-bold text-teal-700 hover:bg-teal-50 rounded-lg transition-colors"
                        >
                          Details
                        </Link>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}

      {/* Pagination Controls */}
      {pagination.pages > 1 && (
        <div className="flex items-center justify-between text-xs text-slate-600 pt-2">
          <div>
            Showing {(pagination.page - 1) * pagination.limit + 1} to {Math.min(pagination.page * pagination.limit, pagination.total)} of {pagination.total} enquiries
          </div>
          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => fetchLeads(pagination.page - 1)}
              disabled={pagination.page === 1}
              className="btn-secondary btn-sm disabled:opacity-40"
            >
              <ChevronLeft className="w-3.5 h-3.5" />
              <span>Previous</span>
            </button>
            <button
              type="button"
              onClick={() => fetchLeads(pagination.page + 1)}
              disabled={pagination.page === pagination.pages}
              className="btn-secondary btn-sm disabled:opacity-40"
            >
              <span>Next</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      )}

      {/* Verified Outreach Modals */}
      {modalType === 'whatsapp' && selectedLead && (
        <WhatsAppConfirmModal
          isOpen={true}
          lead={selectedLead}
          onClose={() => {
            setSelectedLead(null);
            setModalType(null);
          }}
          onConfirm={() => {
            setSelectedLead(null);
            setModalType(null);
            fetchLeads(pagination.page);
          }}
        />
      )}

      {modalType === 'call' && selectedLead && (
        <CallOutcomeModal
          isOpen={true}
          lead={selectedLead}
          onClose={() => {
            setSelectedLead(null);
            setModalType(null);
          }}
          onConfirm={() => {
            setSelectedLead(null);
            setModalType(null);
            fetchLeads(pagination.page);
          }}
        />
      )}
    </div>
  );
}
