import { motion } from 'framer-motion';
import { FileText, ArrowLeft, AlertTriangle, Zap, RotateCcw, CheckCircle, PlayCircle, XCircle } from 'lucide-react';
import { useBallEngine } from '../lib/useBallEngine';
import { Link } from 'react-router-dom';

const EVENT_ICONS: Record<string, React.ElementType> = {
  BALL_CREATED: CheckCircle,
  BALL_ACTIVATED: PlayCircle,
  BALL_IN_PLAY: Zap,
  PRESSURE_WARNING: AlertTriangle,
  COMPLIANCE_WARNING: AlertTriangle,
  BALL_REPLACED: RotateCcw,
  BALL_RETIRED: XCircle,
};

const EVENT_COLORS: Record<string, string> = {
  BALL_CREATED: '#22c55e',
  BALL_ACTIVATED: '#00d4ff',
  BALL_IN_PLAY: '#00d4ff',
  PRESSURE_WARNING: '#f59e0b',
  COMPLIANCE_WARNING: '#f59e0b',
  BALL_REPLACED: '#64748b',
  BALL_RETIRED: '#ef4444',
};

export function Events() {
  const { ball, events, loading } = useBallEngine();

  if (loading || !ball) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="w-5 h-5 border-2 border-[#00d4ff] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Link to="/" className="flex items-center gap-2 text-sm text-slate-500 hover:text-white transition-colors">
          <ArrowLeft className="w-4 h-4" />
          Back to Dashboard
        </Link>
      </div>

      <div>
        <h2 className="text-xl font-bold text-white tracking-tight">Incident Timeline</h2>
        <p className="text-sm text-slate-500 mt-1">Complete event history and ball event language</p>
      </div>

      {/* Event Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {[
          { label: 'Total Events', value: events.length, color: '#00d4ff' },
          { label: 'Warnings', value: events.filter(e => e.event_type.includes('WARNING')).length, color: '#f59e0b' },
          { label: 'State Changes', value: events.filter(e => e.event_type.includes('ACTIVATED') || e.event_type.includes('REPLACED') || e.event_type.includes('RETIRED')).length, color: '#64748b' },
          { label: 'Compliance', value: events.filter(e => e.event_type.includes('COMPLIANCE')).length, color: '#22c55e' },
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

      {/* Timeline */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-[#0f1623] rounded-xl border border-slate-800/50 p-5"
      >
        <div className="flex items-center gap-2 mb-6">
          <FileText className="w-4 h-4 text-[#00d4ff]" />
          <h3 className="text-sm font-semibold text-white">Event Log</h3>
        </div>

        <div className="space-y-0">
          {events.length === 0 && (
            <div className="text-center py-12 text-slate-500 text-sm">No events recorded yet</div>
          )}

          {events.map((event, i) => {
            const Icon = EVENT_ICONS[event.event_type] || FileText;
            const color = EVENT_COLORS[event.event_type] || '#94a3b8';
            const time = new Date(event.created_at);

            return (
              <motion.div
                key={event.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.03 }}
                className="relative flex items-start gap-4 py-4 border-b border-slate-800/30 last:border-0"
              >
                {/* Timeline line */}
                <div className="absolute left-4 top-8 bottom-0 w-px bg-slate-800" />
                {i === 0 && <div className="absolute left-4 top-0 h-4 w-px bg-slate-800" />}

                {/* Icon */}
                <div className="relative z-10 w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0" style={{ backgroundColor: `${color}20`, border: `1px solid ${color}40` }}>
                  <Icon className="w-4 h-4" style={{ color }} />
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-[10px] text-slate-500 font-mono">{time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}</span>
                    <span className="text-xs text-slate-600">{time.toLocaleDateString()}</span>
                    <span className="text-[10px] px-1.5 py-0.5 rounded font-medium" style={{ backgroundColor: `${color}20`, color }}>
                      {event.event_type}
                    </span>
                  </div>
                  <div className="text-sm text-slate-300 mt-1">{event.message}</div>
                  {event.details && Object.keys(event.details).length > 0 && (
                    <div className="mt-2 flex flex-wrap gap-2">
                      {Object.entries(event.details).map(([key, value]) => (
                        <span key={key} className="text-[10px] text-slate-500 bg-slate-800/50 px-2 py-1 rounded font-mono">
                          {key}: {String(value)}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </motion.div>
            );
          })}
        </div>
      </motion.div>
    </div>
  );
}
