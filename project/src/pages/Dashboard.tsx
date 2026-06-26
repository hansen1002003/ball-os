import { motion } from 'framer-motion';
import {
  Shield,
  AlertTriangle,
  Activity,
  TrendingUp,
  Gauge,
  Timer,
  Zap,
  Play,
  RotateCcw,
  AlertCircle,
  Skull,
  ChevronRight,
  Cpu,
  Waves,
  Weight,
  Maximize,
  Thermometer,
  Layers,
  Eye,
} from 'lucide-react';
import { Football3D } from '../components/Football3D';
import { useBallEngine } from '../lib/useBallEngine';
import { STATE_COLORS } from '../lib/types';
import {
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area,
} from 'recharts';

function ScoreRing({ score, label, sublabel, color, size = 120 }: { score: number; label: string; sublabel?: string; color: string; size?: number }) {
  const strokeWidth = 8;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (score / 100) * circumference;

  const getLabel = (s: number) => {
    if (s >= 90) return 'Excellent';
    if (s >= 70) return 'Good';
    if (s >= 40) return 'Warning';
    return 'Critical';
  };

  return (
    <div className="flex flex-col items-center gap-2">
      <div className="relative" style={{ width: size, height: size }}>
        <svg className="rotate-[-90deg]" width={size} height={size}>
          <circle cx={size / 2} cy={size / 2} r={radius} fill="none" stroke="#1e293b" strokeWidth={strokeWidth} />
          <motion.circle
            cx={size / 2} cy={size / 2} r={radius}
            fill="none" stroke={color} strokeWidth={strokeWidth}
            strokeDasharray={circumference}
            initial={{ strokeDashoffset: circumference }}
            animate={{ strokeDashoffset: offset }}
            transition={{ duration: 1.5, ease: 'easeOut' }}
            strokeLinecap="round"
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-xl font-bold text-white">{score}</span>
          <span className="text-[10px] text-slate-500 uppercase tracking-wider">{getLabel(score)}</span>
        </div>
      </div>
      <div className="text-center">
        <div className="text-xs font-medium text-slate-300">{label}</div>
        {sublabel && <div className="text-[10px] text-slate-500">{sublabel}</div>}
      </div>
    </div>
  );
}

function ComplianceRow({ label, value, unit, compliant, icon: Icon }: { label: string; value: number; unit: string; compliant: 'Compliant' | 'Near Threshold' | 'Non-Compliant'; icon: React.ElementType }) {
  const color = compliant === 'Compliant' ? '#22c55e' : compliant === 'Near Threshold' ? '#f59e0b' : '#ef4444';
  const bg = compliant === 'Compliant' ? 'bg-emerald-500/10' : compliant === 'Near Threshold' ? 'bg-amber-500/10' : 'bg-red-500/10';

  return (
    <div className="flex items-center justify-between py-3 border-b border-slate-800/50 last:border-0">
      <div className="flex items-center gap-3">
        <div className="w-8 h-8 rounded-lg bg-slate-800/50 flex items-center justify-center">
          <Icon className="w-4 h-4 text-slate-400" />
        </div>
        <div>
          <div className="text-sm text-slate-300">{label}</div>
          <div className="text-[10px] text-slate-500">{unit}</div>
        </div>
      </div>
      <div className="flex items-center gap-3">
        <span className="text-sm font-medium text-white">{value}</span>
        <span className={`text-[10px] px-2 py-0.5 rounded-full font-medium ${bg}`} style={{ color }}>
          {compliant}
        </span>
      </div>
    </div>
  );
}

function ActionButton({ label, icon: Icon, onClick, variant = 'primary' }: { label: string; icon: React.ElementType; onClick: () => void; variant?: 'primary' | 'warning' | 'danger' }) {
  const bg = variant === 'primary' ? 'bg-[#00d4ff]/10 hover:bg-[#00d4ff]/20 border-[#00d4ff]/20 text-[#00d4ff]' : variant === 'warning' ? 'bg-amber-500/10 hover:bg-amber-500/20 border-amber-500/20 text-amber-400' : 'bg-red-500/10 hover:bg-red-500/20 border-red-500/20 text-red-400';

  return (
    <button onClick={onClick} className={`flex items-center gap-2 px-3 py-2 rounded-lg border text-xs font-medium transition-all duration-200 ${bg}`}>
      <Icon className="w-3.5 h-3.5" />
      {label}
    </button>
  );
}

export function Dashboard() {
  const {
    ball, events, measurements, predictiveReadings, demoMode, loading, error,
    activateBall, simulateInPlay, simulatePressureDrop, simulateComplianceWarning,
    replaceBall, retireBall, resetBall, toggleDemoMode,
  } = useBallEngine();

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="flex items-center gap-3">
          <div className="w-5 h-5 border-2 border-[#00d4ff] border-t-transparent rounded-full animate-spin" />
          <span className="text-sm text-slate-400">Loading BallOS systems...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="flex items-center gap-3 text-red-400">
          <AlertCircle className="w-5 h-5" />
          <span className="text-sm">System error: {error}</span>
        </div>
      </div>
    );
  }

  if (!ball) return null;

  const stateColor = STATE_COLORS[ball.current_state] || '#94a3b8';

  // Get recent measurement data for charts
  const pressureHistory = measurements
    .filter(m => m.metric === 'pressure')
    .sort((a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime())
    .slice(-20)
    .map((m, i) => ({ index: i, value: m.value, time: new Date(m.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) }));

  const healthHistory = measurements
    .filter(m => m.metric === 'health')
    .sort((a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime())
    .slice(-20)
    .map((m, i) => ({ index: i, value: m.value, time: new Date(m.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) }));

  // For demo, if not enough real data, generate some
  const chartData = pressureHistory.length >= 3 ? pressureHistory : [
    { index: 0, value: 0.6, time: '12:00' },
    { index: 1, value: 0.59, time: '12:05' },
    { index: 2, value: 0.58, time: '12:10' },
    { index: 3, value: 0.57, time: '12:15' },
    { index: 4, value: 0.56, time: '12:20' },
    { index: 5, value: 0.55, time: '12:25' },
    { index: 6, value: 0.54, time: '12:30' },
    { index: 7, value: 0.53, time: '12:35' },
    { index: 8, value: 0.52, time: '12:40' },
    { index: 9, value: 0.51, time: '12:45' },
    ...(ball.pressure !== 0.6 ? [{ index: 10, value: ball.pressure, time: '12:50' }] : []),
  ];

  const healthChartData = healthHistory.length >= 3 ? healthHistory : [
    { index: 0, value: 100, time: '12:00' },
    { index: 1, value: 98, time: '12:05' },
    { index: 2, value: 97, time: '12:10' },
    { index: 3, value: 95, time: '12:15' },
    { index: 4, value: 92, time: '12:20' },
    { index: 5, value: 88, time: '12:25' },
    { index: 6, value: 84, time: '12:30' },
    { index: 7, value: 79, time: '12:35' },
    { index: 8, value: 73, time: '12:40' },
    { index: 9, value: 66, time: '12:45' },
    { index: 10, value: ball.health_score, time: '12:50' },
  ];

  const determineCompliance = (metric: string, value: number) => {
    if (metric === 'pressure') {
      return value >= 0.6 && value <= 1.1 ? 'Compliant' : value >= 0.5 && value <= 1.2 ? 'Near Threshold' : 'Non-Compliant';
    }
    if (metric === 'circumference') {
      return value >= 68 && value <= 70 ? 'Compliant' : value >= 67 && value <= 71 ? 'Near Threshold' : 'Non-Compliant';
    }
    if (metric === 'weight') {
      return value >= 410 && value <= 450 ? 'Compliant' : value >= 390 && value <= 470 ? 'Near Threshold' : 'Non-Compliant';
    }
    if (metric === 'integrity') {
      return value >= 90 ? 'Compliant' : value >= 50 ? 'Near Threshold' : 'Non-Compliant';
    }
    return 'Compliant';
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-white tracking-tight">Active Match Ball</h2>
          <p className="text-sm text-slate-500 mt-0.5">Real-time compliance monitoring and operational intelligence</p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={toggleDemoMode}
            className={`flex items-center gap-2 px-3 py-2 rounded-lg border text-xs font-medium transition-all duration-200 ${
              demoMode
                ? 'bg-amber-500/10 border-amber-500/20 text-amber-400'
                : 'bg-slate-800/50 border-slate-700 text-slate-400 hover:text-white'
            }`}
          >
            <Cpu className="w-3.5 h-3.5" />
            {demoMode ? 'Demo Mode Active' : 'Research Demo Mode'}
          </button>
        </div>
      </div>

      {/* Main Row: Ball + Identity + State */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Ball Visual */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-[#0f1623] rounded-xl border border-slate-800/50 overflow-hidden"
        >
          <div className="h-[380px]">
            <Football3D />
          </div>
          <div className="px-4 py-3 border-t border-slate-800/50 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full animate-pulse" style={{ backgroundColor: stateColor }} />
              <span className="text-xs font-medium text-slate-300">{ball.ball_id}</span>
            </div>
            <span className="text-[10px] text-slate-500 tracking-wider uppercase">3D Active Model</span>
          </div>
        </motion.div>

        {/* Ball Identity */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-[#0f1623] rounded-xl border border-slate-800/50 p-5 flex flex-col"
        >
          <div className="flex items-center gap-2 mb-4">
            <Shield className="w-4 h-4 text-[#00d4ff]" />
            <h3 className="text-sm font-semibold text-white">Digital Identity</h3>
          </div>
          <div className="space-y-3 flex-1">
            {[
              { label: 'Ball ID', value: ball.ball_id },
              { label: 'Match Assignment', value: ball.match_assignment || 'Unassigned' },
              { label: 'Manufacture Date', value: new Date(ball.manufacture_date).toLocaleDateString() },
              { label: 'Matches Played', value: ball.matches_played.toString() },
              { label: 'Training Sessions', value: ball.training_sessions.toString() },
              { label: 'Activation Count', value: ball.activation_count.toString() },
            ].map((item, i) => (
              <div key={i} className="flex items-center justify-between">
                <span className="text-xs text-slate-500">{item.label}</span>
                <span className="text-xs font-medium text-slate-200">{item.value}</span>
              </div>
            ))}
          </div>
          <div className="mt-4 pt-4 border-t border-slate-800/50">
            <div className="flex items-center justify-between">
              <span className="text-xs text-slate-500">Current Status</span>
              <span className="text-xs font-medium" style={{ color: stateColor }}>
                {ball.current_state}
              </span>
            </div>
          </div>
        </motion.div>

        {/* State + Scores */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-[#0f1623] rounded-xl border border-slate-800/50 p-5 flex flex-col gap-4"
        >
          {/* State Badge */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg flex items-center justify-center" style={{ backgroundColor: `${stateColor}15` }}>
              <Activity className="w-5 h-5" style={{ color: stateColor }} />
            </div>
            <div>
              <div className="text-xs text-slate-500">Current State</div>
              <div className="text-lg font-bold text-white" style={{ color: stateColor }}>
                {ball.current_state}
              </div>
            </div>
          </div>

          {/* Scores */}
          <div className="flex items-center justify-around py-3">
            <ScoreRing
              score={ball.health_score}
              label="Health Score"
              sublabel="0-100"
              color={ball.health_score >= 80 ? '#22c55e' : ball.health_score >= 60 ? '#f59e0b' : '#ef4444'}
              size={100}
            />
            <ScoreRing
              score={ball.trust_score}
              label="Trust Score"
              sublabel="Confidence"
              color={ball.trust_score >= 80 ? '#06b6d4' : ball.trust_score >= 60 ? '#f59e0b' : '#ef4444'}
              size={100}
            />
          </div>

          {/* Compliance Badge */}
          <div className="flex items-center justify-between py-3 px-3 rounded-lg bg-slate-800/30">
            <span className="text-xs text-slate-400">Compliance Status</span>
            <span className={`text-xs font-bold px-2 py-0.5 rounded ${
              ball.compliance_status === 'Compliant' ? 'bg-emerald-500/10 text-emerald-400' :
              ball.compliance_status === 'Near Threshold' ? 'bg-amber-500/10 text-amber-400' :
              'bg-red-500/10 text-red-400'
            }`}>
              {ball.compliance_status}
            </span>
          </div>

          {/* Actions */}
          <div className="grid grid-cols-2 gap-2 mt-auto">
            <ActionButton label="Activate" icon={Play} onClick={activateBall} variant="primary" />
            <ActionButton label="In Play" icon={Zap} onClick={simulateInPlay} variant="primary" />
            <ActionButton label="Pressure Drop" icon={Waves} onClick={simulatePressureDrop} variant="warning" />
            <ActionButton label="Compliance" icon={AlertTriangle} onClick={simulateComplianceWarning} variant="warning" />
            <ActionButton label="Replace" icon={RotateCcw} onClick={replaceBall} variant="danger" />
            <ActionButton label="Retire" icon={Skull} onClick={retireBall} variant="danger" />
          </div>
          {ball.current_state === 'RETIRED' || ball.current_state === 'REPLACED' ? (
            <button onClick={resetBall} className="flex items-center justify-center gap-2 px-3 py-2 rounded-lg bg-slate-800/50 border border-slate-700 text-xs text-slate-400 hover:text-white transition-all duration-200">
              <RotateCcw className="w-3.5 h-3.5" />
              Reset Ball
            </button>
          ) : null}
        </motion.div>
      </div>

      {/* Compliance Intelligence Panel */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-[#0f1623] rounded-xl border border-slate-800/50 p-5"
        >
          <div className="flex items-center gap-2 mb-4">
            <Gauge className="w-4 h-4 text-[#00d4ff]" />
            <h3 className="text-sm font-semibold text-white">Compliance Intelligence Panel</h3>
          </div>
          <div className="space-y-1">
            <ComplianceRow
              label="Pressure"
              value={ball.pressure}
              unit="bar (Law 2: 0.6-1.1)"
              compliant={determineCompliance('pressure', ball.pressure)}
              icon={Waves}
            />
            <ComplianceRow
              label="Circumference"
              value={ball.circumference}
              unit="cm (Law 2: 68-70)"
              compliant={determineCompliance('circumference', ball.circumference)}
              icon={Maximize}
            />
            <ComplianceRow
              label="Weight"
              value={ball.weight}
              unit="g (Law 2: 410-450)"
              compliant={determineCompliance('weight', ball.weight)}
              icon={Weight}
            />
            <ComplianceRow
              label="Integrity"
              value={ball.integrity}
              unit="% (Structural)"
              compliant={determineCompliance('integrity', ball.integrity)}
              icon={Layers}
            />
            <ComplianceRow
              label="Temperature"
              value={ball.temperature}
              unit="C (Operational)"
              compliant={ball.temperature >= 10 && ball.temperature <= 40 ? 'Compliant' : 'Near Threshold'}
              icon={Thermometer}
            />
          </div>
        </motion.div>

        {/* Predictive Compliance Engine */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-[#0f1623] rounded-xl border border-slate-800/50 p-5"
        >
          <div className="flex items-center gap-2 mb-4">
            <TrendingUp className="w-4 h-4 text-[#00d4ff]" />
            <h3 className="text-sm font-semibold text-white">Predictive Compliance Engine</h3>
          </div>
          <div className="grid grid-cols-2 gap-4 mb-4">
            <div className="p-3 rounded-lg bg-slate-800/30">
              <div className="text-[10px] text-slate-500 uppercase tracking-wider mb-1">Current Pressure</div>
              <div className="text-lg font-bold text-white">{ball.pressure.toFixed(3)} <span className="text-xs font-normal text-slate-400">bar</span></div>
            </div>
            <div className="p-3 rounded-lg bg-slate-800/30">
              <div className="text-[10px] text-slate-500 uppercase tracking-wider mb-1">Current Health</div>
              <div className="text-lg font-bold text-white">{ball.health_score} <span className="text-xs font-normal text-slate-400">/100</span></div>
            </div>
          </div>
          <div className="space-y-3">
            {predictiveReadings.map((reading, i) => (
              <div key={i} className="flex items-center gap-4">
                <div className="w-16 text-[10px] text-slate-500 text-right">{reading.minutes} min</div>
                <div className="flex-1 h-6 bg-slate-800/50 rounded overflow-hidden relative">
                  <motion.div
                    className="h-full rounded"
                    initial={{ width: 0 }}
                    animate={{ width: `${reading.health_score}%` }}
                    transition={{ delay: 0.5 + i * 0.2, duration: 1 }}
                    style={{
                      backgroundColor: reading.health_score >= 80 ? '#22c55e' : reading.health_score >= 40 ? '#f59e0b' : '#ef4444',
                      opacity: 0.7,
                    }}
                  />
                  <div className="absolute inset-0 flex items-center justify-between px-2">
                    <span className="text-[10px] text-white font-medium">{reading.pressure.toFixed(3)} bar</span>
                    <span className="text-[10px] text-white/70">{reading.health_score}%</span>
                  </div>
                </div>
                <ChevronRight className="w-3 h-3 text-slate-600" />
              </div>
            ))}
          </div>
          <div className="mt-4 flex items-center gap-2 text-[10px] text-slate-500">
            <Timer className="w-3 h-3" />
            Predictions based on current degradation model and match conditions
          </div>
        </motion.div>
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="bg-[#0f1623] rounded-xl border border-slate-800/50 p-5"
        >
          <div className="flex items-center gap-2 mb-4">
            <Waves className="w-4 h-4 text-[#00d4ff]" />
            <h3 className="text-sm font-semibold text-white">Pressure History</h3>
          </div>
          <div className="h-48">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData}>
                <defs>
                  <linearGradient id="pressureGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#00d4ff" stopOpacity={0.3} />
                    <stop offset="100%" stopColor="#00d4ff" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                <XAxis dataKey="time" stroke="#475569" fontSize={10} tickLine={false} />
                <YAxis stroke="#475569" fontSize={10} tickLine={false} domain={['dataMin - 0.1', 'dataMax + 0.1']} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#0f1623', border: '1px solid #1e293b', borderRadius: '8px', fontSize: '12px' }}
                  labelStyle={{ color: '#94a3b8' }}
                  itemStyle={{ color: '#00d4ff' }}
                />
                <Area type="monotone" dataKey="value" stroke="#00d4ff" strokeWidth={2} fill="url(#pressureGrad)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="bg-[#0f1623] rounded-xl border border-slate-800/50 p-5"
        >
          <div className="flex items-center gap-2 mb-4">
            <Activity className="w-4 h-4 text-[#00d4ff]" />
            <h3 className="text-sm font-semibold text-white">Health Score Trend</h3>
          </div>
          <div className="h-48">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={healthChartData}>
                <defs>
                  <linearGradient id="healthGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#22c55e" stopOpacity={0.3} />
                    <stop offset="100%" stopColor="#22c55e" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                <XAxis dataKey="time" stroke="#475569" fontSize={10} tickLine={false} />
                <YAxis stroke="#475569" fontSize={10} tickLine={false} domain={[0, 100]} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#0f1623', border: '1px solid #1e293b', borderRadius: '8px', fontSize: '12px' }}
                  labelStyle={{ color: '#94a3b8' }}
                  itemStyle={{ color: '#22c55e' }}
                />
                <Area type="monotone" dataKey="value" stroke="#22c55e" strokeWidth={2} fill="url(#healthGrad)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </motion.div>
      </div>

      {/* Recent Events */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.7 }}
        className="bg-[#0f1623] rounded-xl border border-slate-800/50 p-5"
      >
        <div className="flex items-center gap-2 mb-4">
          <Eye className="w-4 h-4 text-[#00d4ff]" />
          <h3 className="text-sm font-semibold text-white">Recent Ball Events</h3>
          <span className="ml-auto text-[10px] text-slate-500">{events.length} total events</span>
        </div>
        <div className="space-y-2">
          {events.slice(0, 8).map((event, i) => (
            <div key={i} className="flex items-center gap-3 py-2 px-3 rounded-lg hover:bg-slate-800/30 transition-colors">
              <div className="w-2 h-2 rounded-full flex-shrink-0" style={{
                backgroundColor: event.event_type.includes('WARNING') ? '#f59e0b' :
                  event.event_type.includes('CRITICAL') ? '#ef4444' :
                  event.event_type.includes('REPLACED') ? '#64748b' :
                  event.event_type.includes('RETIRED') ? '#94a3b8' :
                  '#00d4ff',
              }} />
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <span className="text-[10px] text-slate-500 font-mono">{new Date(event.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                  <span className="text-xs font-medium text-[#00d4ff] truncate">{event.event_type}</span>
                </div>
                <div className="text-xs text-slate-400 mt-0.5 truncate">{event.message}</div>
              </div>
              <ChevronRight className="w-3 h-3 text-slate-600 flex-shrink-0" />
            </div>
          ))}
          {events.length === 0 && (
            <div className="text-xs text-slate-500 py-4 text-center">No events recorded yet</div>
          )}
        </div>
      </motion.div>
    </div>
  );
}
