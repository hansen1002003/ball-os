import { motion } from 'framer-motion';
import { Shield, Calendar, Trophy, Dumbbell, Zap, CheckCircle, Clock, ArrowLeft } from 'lucide-react';
import { useBallEngine } from '../lib/useBallEngine';
import { Link } from 'react-router-dom';
import { STATE_COLORS } from '../lib/types';

export function Profile() {
  const { ball, loading } = useBallEngine();

  if (loading || !ball) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="w-5 h-5 border-2 border-[#00d4ff] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  const stateColor = STATE_COLORS[ball.current_state] || '#94a3b8';

  const identityCards = [
    { label: 'Ball ID', value: ball.ball_id, icon: Shield, color: '#00d4ff' },
    { label: 'Manufacture Date', value: new Date(ball.manufacture_date).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' }), icon: Calendar, color: '#22c55e' },
    { label: 'Matches Played', value: ball.matches_played.toString(), icon: Trophy, color: '#f59e0b' },
    { label: 'Training Sessions', value: ball.training_sessions.toString(), icon: Dumbbell, color: '#a855f7' },
    { label: 'Activation Count', value: ball.activation_count.toString(), icon: Zap, color: '#f97316' },
    { label: 'Compliance Status', value: ball.compliance_status, icon: CheckCircle, color: ball.compliance_status === 'Compliant' ? '#22c55e' : ball.compliance_status === 'Near Threshold' ? '#f59e0b' : '#ef4444' },
    { label: 'Current State', value: ball.current_state, icon: Shield, color: stateColor },
    { label: 'Last Updated', value: new Date(ball.updated_at).toLocaleTimeString(), icon: Clock, color: '#64748b' },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Link to="/" className="flex items-center gap-2 text-sm text-slate-500 hover:text-white transition-colors">
          <ArrowLeft className="w-4 h-4" />
          Back to Dashboard
        </Link>
      </div>

      <div>
        <h2 className="text-xl font-bold text-white tracking-tight">Ball Digital Identity</h2>
        <p className="text-sm text-slate-500 mt-0.5">Complete forensic profile and compliance record</p>
      </div>

      {/* Identity Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-[#0f1623] rounded-xl border border-slate-800/50 p-6"
      >
        <div className="flex flex-col md:flex-row md:items-center gap-6">
          <div className="w-20 h-20 rounded-xl bg-[#00d4ff]/10 border border-[#00d4ff]/20 flex items-center justify-center">
            <Shield className="w-10 h-10 text-[#00d4ff]" />
          </div>
          <div className="flex-1">
            <h3 className="text-2xl font-bold text-white">{ball.ball_id}</h3>
            <div className="flex items-center gap-3 mt-1">
              <span className="text-sm text-slate-400">{ball.match_assignment || 'Unassigned'}</span>
              <span className="w-1 h-1 rounded-full bg-slate-600" />
              <span className="text-sm font-medium" style={{ color: stateColor }}>{ball.current_state}</span>
            </div>
          </div>
          <div className="flex gap-6">
            <div className="text-center">
              <div className="text-2xl font-bold text-white">{ball.health_score}</div>
              <div className="text-[10px] text-slate-500 uppercase tracking-wider">Health Score</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-white">{ball.trust_score}%</div>
              <div className="text-[10px] text-slate-500 uppercase tracking-wider">Trust Score</div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Identity Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {identityCards.map((card, i) => {
          const Icon = card.icon;
          return (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              className="bg-[#0f1623] rounded-xl border border-slate-800/50 p-4"
            >
              <div className="flex items-center gap-3 mb-3">
                <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ backgroundColor: `${card.color}15` }}>
                  <Icon className="w-4 h-4" style={{ color: card.color }} />
                </div>
                <span className="text-xs text-slate-500">{card.label}</span>
              </div>
              <div className="text-sm font-bold text-white">{card.value}</div>
            </motion.div>
          );
        })}
      </div>

      {/* Compliance Record */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="bg-[#0f1623] rounded-xl border border-slate-800/50 p-5"
      >
        <div className="flex items-center gap-2 mb-4">
          <CheckCircle className="w-4 h-4 text-[#00d4ff]" />
          <h3 className="text-sm font-semibold text-white">Current Compliance Record</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-slate-800/50">
                <th className="text-left text-[10px] text-slate-500 uppercase tracking-wider py-3 px-3">Metric</th>
                <th className="text-left text-[10px] text-slate-500 uppercase tracking-wider py-3 px-3">Current Value</th>
                <th className="text-left text-[10px] text-slate-500 uppercase tracking-wider py-3 px-3">FIFA Law 2 Range</th>
                <th className="text-left text-[10px] text-slate-500 uppercase tracking-wider py-3 px-3">Status</th>
              </tr>
            </thead>
            <tbody>
              {[
                { metric: 'Pressure', value: `${ball.pressure.toFixed(3)} bar`, range: '0.6 - 1.1 bar', status: ball.pressure >= 0.6 && ball.pressure <= 1.1 ? 'Compliant' : ball.pressure >= 0.5 && ball.pressure <= 1.2 ? 'Near Threshold' : 'Non-Compliant' },
                { metric: 'Circumference', value: `${ball.circumference.toFixed(1)} cm`, range: '68.0 - 70.0 cm', status: ball.circumference >= 68 && ball.circumference <= 70 ? 'Compliant' : ball.circumference >= 67 && ball.circumference <= 71 ? 'Near Threshold' : 'Non-Compliant' },
                { metric: 'Weight', value: `${ball.weight.toFixed(0)} g`, range: '410 - 450 g', status: ball.weight >= 410 && ball.weight <= 450 ? 'Compliant' : ball.weight >= 390 && ball.weight <= 470 ? 'Near Threshold' : 'Non-Compliant' },
                { metric: 'Integrity', value: `${ball.integrity.toFixed(0)}%`, range: '85% - 100%', status: ball.integrity >= 85 ? 'Compliant' : ball.integrity >= 50 ? 'Near Threshold' : 'Non-Compliant' },
                { metric: 'Temperature', value: `${ball.temperature.toFixed(0)} C`, range: '10 - 40 C', status: ball.temperature >= 10 && ball.temperature <= 40 ? 'Compliant' : 'Near Threshold' },
              ].map((row, i) => {
                const statusColor = row.status === 'Compliant' ? 'text-emerald-400' : row.status === 'Near Threshold' ? 'text-amber-400' : 'text-red-400';
                return (
                  <tr key={i} className="border-b border-slate-800/30 last:border-0">
                    <td className="py-3 px-3 text-xs text-slate-300">{row.metric}</td>
                    <td className="py-3 px-3 text-xs font-medium text-white">{row.value}</td>
                    <td className="py-3 px-3 text-xs text-slate-500">{row.range}</td>
                    <td className={`py-3 px-3 text-xs font-medium ${statusColor}`}>{row.status}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </motion.div>
    </div>
  );
}
