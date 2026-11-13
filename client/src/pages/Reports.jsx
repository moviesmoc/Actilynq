import React, { useState, useEffect } from 'react';
import {
  BarChart3,
  AlertCircle,
  RefreshCw,
  TrendingUp,
  Users,
  Award
} from 'lucide-react';
import {
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from 'recharts';
import api from '../api/client';
import { formatCurrency } from '../utils/formatters';

export default function Reports() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchReports = async () => {
    try {
      setLoading(true);
      setError('');
      const res = await api.get('/reports/analytics');
      if (res.data?.success) {
        setData(res.data.analytics || res.data);
      }
    } catch (err) {
      setError(err.message || 'Failed to load reports');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReports();
  }, []);

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="animate-pulse space-y-4">
          <div className="h-10 bg-neutral-200 rounded-lg" />
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-24 bg-neutral-200 rounded-lg" />
            ))}
          </div>
          <div className="h-64 bg-neutral-200 rounded-lg" />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6 bg-red-50 border border-red-200 rounded-lg flex items-start gap-3">
        <AlertCircle className="w-5 h-5 text-red-700 flex-shrink-0 mt-0.5" />
        <div>
          <h3 className="font-semibold text-red-900">Error loading reports</h3>
          <p className="text-sm text-red-800 mt-1">{error}</p>
          <button
            onClick={fetchReports}
            className="mt-3 text-sm font-medium text-red-700 hover:text-red-900 flex items-center gap-1"
          >
            <RefreshCw className="w-4 h-4" />
            Try again
          </button>
        </div>
      </div>
    );
  }

  const COLORS = ['#0f766e', '#14b8a6', '#2dd4bf', '#5eead4'];

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-neutral-900 mb-2 flex items-center gap-2">
            <BarChart3 className="w-8 h-8 text-brand-700" />
            Reports & Analytics
          </h1>
          <p className="text-neutral-600">Track your sales performance and enquiry metrics</p>
        </div>
        <button
          onClick={fetchReports}
          className="btn-secondary flex items-center gap-2"
        >
          <RefreshCw className="w-4 h-4" />
          Refresh
        </button>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="card-sm">
          <p className="text-2xs font-semibold text-neutral-500 uppercase tracking-wide mb-1">Total Enquiries</p>
          <p className="text-2xl font-bold text-neutral-900">{data?.totalEnquiries || 0}</p>
        </div>

        <div className="card-sm">
          <p className="text-2xs font-semibold text-neutral-500 uppercase tracking-wide mb-1">Won</p>
          <p className="text-2xl font-bold text-emerald-700">{data?.totalWon || 0}</p>
        </div>

        <div className="card-sm">
          <p className="text-2xs font-semibold text-neutral-500 uppercase tracking-wide mb-1">Lost</p>
          <p className="text-2xl font-bold text-red-700">{data?.totalLost || 0}</p>
        </div>

        <div className="card-sm">
          <p className="text-2xs font-semibold text-neutral-500 uppercase tracking-wide mb-1">Win Rate</p>
          <p className="text-2xl font-bold text-brand-700">
            {data?.totalEnquiries > 0
              ? `${Math.round((data.totalWon / data.totalEnquiries) * 100)}%`
              : '—'}
          </p>
        </div>
      </div>

      {/* Charts Grid */}
      <div className="grid lg:grid-cols-2 gap-6">
        {/* Enquiries by Stage */}
        {data?.byStage && data.byStage.length > 0 && (
          <div className="card">
            <h3 className="text-lg font-bold text-neutral-900 mb-4">Enquiries by Stage</h3>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={data.byStage}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis dataKey="stage" tick={{ fontSize: 12 }} />
                <YAxis tick={{ fontSize: 12 }} />
                <Tooltip contentStyle={{ backgroundColor: '#f3f4f6', border: '1px solid #d1d5db', borderRadius: '0.5rem' }} />
                <Bar dataKey="count" fill="#0f766e" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        )}

        {/* Enquiries by Source */}
        {data?.bySource && data.bySource.length > 0 && (
          <div className="card">
            <h3 className="text-lg font-bold text-neutral-900 mb-4">Enquiries by Source</h3>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={data.bySource}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ source, count }) => `${source}: ${count}`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="count"
                >
                  {data.bySource.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        )}

        {/* Win/Loss Distribution */}
        {data && (
          <div className="card">
            <h3 className="text-lg font-bold text-neutral-900 mb-4">Outcomes</h3>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={[
                    { name: 'Won', value: data.totalWon || 0, fill: '#10b981' },
                    { name: 'Lost', value: data.totalLost || 0, fill: '#ef4444' },
                    { name: 'In Progress', value: (data.totalEnquiries || 0) - (data.totalWon || 0) - (data.totalLost || 0), fill: '#f59e0b' }
                  ]}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, value }) => value > 0 ? `${name}: ${value}` : ''}
                  outerRadius={80}
                  dataKey="value"
                >
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        )}

        {/* Enquiries by Type */}
        {data?.byType && data.byType.length > 0 && (
          <div className="card">
            <h3 className="text-lg font-bold text-neutral-900 mb-4">Enquiries by Type</h3>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={data.byType}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis dataKey="type" tick={{ fontSize: 12 }} />
                <YAxis tick={{ fontSize: 12 }} />
                <Tooltip contentStyle={{ backgroundColor: '#f3f4f6', border: '1px solid #d1d5db', borderRadius: '0.5rem' }} />
                <Bar dataKey="count" fill="#14b8a6" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        )}
      </div>

      {/* Summary Stats */}
      {data && (
        <div className="grid md:grid-cols-2 gap-6">
          <div className="card">
            <h3 className="text-lg font-bold text-neutral-900 mb-4 flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-brand-700" />
              Total Pipeline Value
            </h3>
            <p className="text-3xl font-bold text-brand-700 mb-2">
              {formatCurrency(data.totalPipelineValue || 0, data.currency)}
            </p>
            <p className="text-sm text-neutral-600">
              Open enquiries estimated value
            </p>
          </div>

          <div className="card">
            <h3 className="text-lg font-bold text-neutral-900 mb-4 flex items-center gap-2">
              <Award className="w-5 h-5 text-emerald-700" />
              Value Won
            </h3>
            <p className="text-3xl font-bold text-emerald-700 mb-2">
              {formatCurrency(data.totalValueWon || 0, data.currency)}
            </p>
            <p className="text-sm text-neutral-600">
              Confirmed bookings value
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
