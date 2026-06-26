import { motion } from 'framer-motion';
import { BarChart3, ArrowLeft, TrendingUp, Activity, Layers } from 'lucide-react';
import { useBallEngine } from '../lib/useBallEngine';
import { Link } from 'react-router-dom';
import {
  LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend,
} from 'recharts';

export function Analytics() {
  const { ball, measurements, events, loading } = useBallEngine();

  if (loading || !ball) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="w-5 h-5 border-2 border-[#00d4ff] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  // Generate chart data
  const pressureData = measurements
    .filter(m => m.metric === 'pressure')
    .sort((a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime())
    .slice(-30)
    .map((m, i) => ({ name: i + 1, value: m.value }));

  const circumferenceData = measurements
    .filter(m => m.metric === 'circumference')
    .sort((a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime())
    .slice(-30)
    .map((m, i) => ({ name: i + 1, value: m.value }));

  const weightData = measurements
    .filter(m => m.metric === 'weight')
    .sort((a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime())
    .slice(-30)
    .map((m, i) => ({ name: i + 1, value: m.value }));

  // Event type distribution
  const eventCounts: Record<string, number> = {};
  events.forEach(e => {
    eventCounts[e.event_type] = (eventCounts[e.event_type] || 0) + 1;
  });
  const eventDistribution = Object.entries(eventCounts).map(([type, count]) => ({ type, count }));



  // Fallback data
  const fallbackPressureData = [
    { name: 1, value: 0.6 }, { name: 2, value: 0.59 }, { name: 3, value: 0.58 }, { name: 4, value: 0.57 }, { name: 5, value: 0.56 },
    { name: 6, value: 0.55 }, { name: 7, value: 0.54 }, { name: 8, value: 0.53 }, { name: 9, value: 0.52 }, { name: 10, value: ball.pressure },
  ];

  const fallbackCircumferenceData = [
    { name: 1, value: 68.5 }, { name: 2, value: 68.5 }, { name: 3, value: 68.5 }, { name: 4, value: 68.5 }, { name: 5, value: 68.5 },
    { name: 6, value: 68.5 }, { name: 7, value: 68.5 }, { name: 8, value: 68.5 }, { name: 9, value: 68.5 }, { name: 10, value: ball.circumference },
  ];

  const fallbackWeightData = [
    { name: 1, value: 430 }, { name: 2, value: 430 }, { name: 3, value: 430 }, { name: 4, value: 430 }, { name: 5, value: 430 },
    { name: 6, value: 430 }, { name: 7, value: 430 }, { name: 8, value: 430 }, { name: 9, value: 430 }, { name: 10, value: ball.weight },
  ];

  const usePressureData = pressureData.length >= 3 ? pressureData : fallbackPressureData;
  const useCircumferenceData = circumferenceData.length >= 3 ? circumferenceData : fallbackCircumferenceData;
  const useWeightData = weightData.length >= 3 ? weightData : fallbackWeightData;

  const chartCard = (title: string, icon: React.ElementType, data: any[], color: string, chartType: 'line' | 'bar', dataKey?: string) => {
    const Icon = icon;
    const Chart = chartType === 'line' ? LineChart : BarChart;
    const DataElement = chartType === 'line' ? Line : Bar;
    const key = dataKey || (chartType === 'line' ? 'value' : 'count');

    return (
      <div className="bg-[#0f1623] rounded-xl border border-slate-800/50 p-5">
        <div className="flex items-center gap-2 mb-4">
          <Icon className="w-4 h-4 text-[#00d4ff]" />
          <h3 className="text-sm font-semibold text-white">{title}</h3>
        </div>
        <div className="h-48">
          <ResponsiveContainer width="100%" height="100%">
            <Chart data={data}>
              <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
              <XAxis dataKey={chartType === 'bar' ? 'type' : 'name'} stroke="#475569" fontSize={10} tickLine={false} />
              <YAxis stroke="#475569" fontSize={10} tickLine={false} />
              <Tooltip
                contentStyle={{ backgroundColor: '#0f1623', border: '1px solid #1e293b', borderRadius: '8px', fontSize: '12px' }}
                labelStyle={{ color: '#94a3b8' }}
                itemStyle={{ color }}
              />
              <DataElement type="monotone" dataKey={key} stroke={color} strokeWidth={2} fill={chartType === 'bar' ? `${color}40` : undefined} fillOpacity={chartType === 'bar' ? 0.6 : undefined} />
            </Chart>
          </ResponsiveContainer>
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Link to="/" className="flex items-center gap-2 text-sm text-slate-500 hover:text-white transition-colors">
          <ArrowLeft className="w-4 h-4" />
          Back to Dashboard
        </Link>
      </div>

      <div>
        <h2 className="text-xl font-bold text-white tracking-tight">Research Analytics</h2>
        <p className="text-sm text-slate-500 mt-1">Comprehensive data analysis and compliance metrics</p>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {[
          { label: 'Avg Pressure', value: ball.pressure.toFixed(3) + ' bar', color: '#00d4ff' },
          { label: 'Avg Circumference', value: ball.circumference.toFixed(1) + ' cm', color: '#22c55e' },
          { label: 'Current Weight', value: ball.weight.toFixed(0) + ' g', color: '#f59e0b' },
          { label: 'Integrity Level', value: ball.integrity.toFixed(0) + '%', color: '#a855f7' },
        ].map((stat, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
            className="bg-[#0f1623] rounded-xl border border-slate-800/50 p-4"
          >
            <div className="text-2xl font-bold text-white">{stat.value}</div>
            <div className="text-[10px] text-slate-500 uppercase tracking-wider mt-1">{stat.label}</div>
          </motion.div>
        ))}
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {chartCard('Pressure History', TrendingUp, usePressureData, '#00d4ff', 'line')}
        {chartCard('Circumference History', Activity, useCircumferenceData, '#22c55e', 'line')}
        {chartCard('Weight History', Layers, useWeightData, '#f59e0b', 'line')}
        {chartCard('Event Distribution', BarChart3, eventDistribution, '#a855f7', 'bar', 'count')}
      </div>

      {/* Compliance Trend */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-[#0f1623] rounded-xl border border-slate-800/50 p-5"
      >
        <div className="flex items-center gap-2 mb-4">
          <Activity className="w-4 h-4 text-[#00d4ff]" />
          <h3 className="text-sm font-semibold text-white">Compliance Trend Analysis</h3>
        </div>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={usePressureData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
              <XAxis dataKey="name" stroke="#475569" fontSize={10} tickLine={false} />
              <YAxis stroke="#475569" fontSize={10} tickLine={false} />
              <Tooltip
                contentStyle={{ backgroundColor: '#0f1623', border: '1px solid #1e293b', borderRadius: '8px', fontSize: '12px' }}
              />
              <Legend wrapperStyle={{ fontSize: '12px' }} />
              <Line type="monotone" dataKey="value" name="Pressure (bar)" stroke="#00d4ff" strokeWidth={2} dot={false} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </motion.div>
    </div>
  );
}
