import { motion } from 'framer-motion';
import { Sparkles, ArrowLeft, Brain, Cpu, Globe, Shield, Target, Radio } from 'lucide-react';
import { Link } from 'react-router-dom';

const researchAreas = [
  {
    icon: Brain,
    title: 'Smart Ball Sensors',
    subtitle: 'Embedded Intelligence Layer',
    description: 'Next-generation micro-sensors embedded within the ball bladder, providing real-time pressure, temperature, and deformation data at 1000Hz sampling rate.',
    status: 'Research Phase',
    color: '#00d4ff',
  },
  {
    icon: Cpu,
    title: 'Digital Twin Footballs',
    subtitle: 'Virtual Ball Modelling',
    description: 'Complete digital twin representation of every match ball, enabling pre-match simulation and predictive degradation modeling across environmental conditions.',
    status: 'Development',
    color: '#22c55e',
  },
  {
    icon: Target,
    title: 'Predictive Compliance',
    subtitle: 'AI-Driven Forecasting',
    description: 'Machine learning models trained on historical match data to predict compliance failures before they occur, enabling proactive ball replacement decisions.',
    status: 'Beta Testing',
    color: '#f59e0b',
  },
  {
    icon: Shield,
    title: 'Referee Support Systems',
    subtitle: 'Official Decision Aid',
    description: 'Real-time ball state telemetry transmitted to match officials, supporting Law 2 enforcement decisions with objective data streams.',
    status: 'Concept',
    color: '#a855f7',
  },
  {
    icon: Globe,
    title: 'Match Equipment Intelligence',
    subtitle: 'Stadium-Wide Network',
    description: 'Distributed intelligence network connecting all match equipment — balls, goals, corner flags — into a unified operational picture for match control.',
    status: 'Research Phase',
    color: '#f97316',
  },
  {
    icon: Radio,
    title: 'Blockchain Verification',
    subtitle: 'Immutable Compliance Record',
    description: 'Cryptographic compliance certificates stored on blockchain, providing tamper-proof ball lifecycle records for regulatory and audit purposes.',
    status: 'Concept',
    color: '#ec4899',
  },
];

export function Future() {
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Link to="/" className="flex items-center gap-2 text-sm text-slate-500 hover:text-white transition-colors">
          <ArrowLeft className="w-4 h-4" />
          Back to Dashboard
        </Link>
      </div>

      <div>
        <h2 className="text-xl font-bold text-white tracking-tight">Future Ball Intelligence Research</h2>
        <p className="text-sm text-slate-500 mt-1">Next-generation football technology research and development roadmap</p>
      </div>

      {/* Hero Banner */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative bg-[#0f1623] rounded-xl border border-slate-800/50 p-8 overflow-hidden"
      >
        <div className="absolute top-0 right-0 w-96 h-96 bg-[#00d4ff]/5 rounded-full blur-3xl" />
        <div className="relative z-10">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-lg bg-[#00d4ff]/10 flex items-center justify-center">
              <Sparkles className="w-5 h-5 text-[#00d4ff]" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-white">BallOS Research Division</h3>
              <p className="text-xs text-slate-500">FIFA Technology Innovation Lab</p>
            </div>
          </div>
          <p className="text-sm text-slate-400 max-w-2xl leading-relaxed">
            BallOS is continuously evolving. The Research Division explores frontier technologies that will transform how football equipment is monitored, validated, and integrated into the modern match ecosystem. Each research area represents a strategic investment in the future of football integrity.
          </p>
          <div className="flex items-center gap-6 mt-6">
            <div className="text-center">
              <div className="text-xl font-bold text-[#00d4ff]">6</div>
              <div className="text-[10px] text-slate-500 uppercase tracking-wider">Research Areas</div>
            </div>
            <div className="w-px h-8 bg-slate-800" />
            <div className="text-center">
              <div className="text-xl font-bold text-emerald-400">3</div>
              <div className="text-[10px] text-slate-500 uppercase tracking-wider">Active Projects</div>
            </div>
            <div className="w-px h-8 bg-slate-800" />
            <div className="text-center">
              <div className="text-xl font-bold text-amber-400">2</div>
              <div className="text-[10px] text-slate-500 uppercase tracking-wider">Beta Programs</div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Research Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {researchAreas.map((area, i) => {
          const Icon = area.icon;
          return (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.08 }}
              className="bg-[#0f1623] rounded-xl border border-slate-800/50 p-5 hover:border-slate-700 transition-colors group"
            >
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 rounded-lg flex items-center justify-center" style={{ backgroundColor: `${area.color}15` }}>
                  <Icon className="w-5 h-5" style={{ color: area.color }} />
                </div>
                <div>
                  <h4 className="text-sm font-semibold text-white">{area.title}</h4>
                  <p className="text-[10px] text-slate-500">{area.subtitle}</p>
                </div>
              </div>
              <p className="text-xs text-slate-400 leading-relaxed mb-4">{area.description}</p>
              <div className="flex items-center justify-between">
                <span className="text-[10px] px-2 py-1 rounded font-medium" style={{ backgroundColor: `${area.color}15`, color: area.color }}>
                  {area.status}
                </span>
                <div className="w-6 h-6 rounded-full bg-slate-800/50 flex items-center justify-center group-hover:bg-slate-700 transition-colors">
                  <Sparkles className="w-3 h-3 text-slate-500" />
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Technology Roadmap */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="bg-[#0f1623] rounded-xl border border-slate-800/50 p-5"
      >
        <div className="flex items-center gap-2 mb-6">
          <Sparkles className="w-4 h-4 text-[#00d4ff]" />
          <h3 className="text-sm font-semibold text-white">Technology Roadmap</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-slate-800/50">
                <th className="text-left text-[10px] text-slate-500 uppercase tracking-wider py-3 px-3">Technology</th>
                <th className="text-left text-[10px] text-slate-500 uppercase tracking-wider py-3 px-3">2024</th>
                <th className="text-left text-[10px] text-slate-500 uppercase tracking-wider py-3 px-3">2025</th>
                <th className="text-left text-[10px] text-slate-500 uppercase tracking-wider py-3 px-3">2026</th>
                <th className="text-left text-[10px] text-slate-500 uppercase tracking-wider py-3 px-3">2027</th>
                <th className="text-left text-[10px] text-slate-500 uppercase tracking-wider py-3 px-3">Status</th>
              </tr>
            </thead>
            <tbody>
              {[
                { tech: 'Smart Ball Sensors', y2024: 'R&D', y2025: 'Prototype', y2026: 'Pilot', y2027: 'Deploy', status: 'On Track' },
                { tech: 'Digital Twin', y2024: 'Concept', y2025: 'R&D', y2026: 'Prototype', y2027: 'Pilot', status: 'On Track' },
                { tech: 'Predictive Compliance', y2024: 'Beta', y2025: 'Deploy', y2026: 'Scale', y2027: 'Global', status: 'Ahead' },
                { tech: 'Referee Systems', y2024: 'Concept', y2025: 'R&D', y2026: 'Prototype', y2027: 'Pilot', status: 'On Track' },
                { tech: 'Equipment Network', y2024: 'R&D', y2025: 'Prototype', y2026: 'Pilot', y2027: 'Deploy', status: 'On Track' },
                { tech: 'Blockchain Verify', y2024: 'Concept', y2025: 'R&D', y2026: 'Prototype', y2027: 'Pilot', status: 'On Track' },
              ].map((row, i) => (
                <tr key={i} className="border-b border-slate-800/30 last:border-0">
                  <td className="py-3 px-3 text-xs text-slate-300 font-medium">{row.tech}</td>
                  <td className="py-3 px-3 text-xs text-slate-500">{row.y2024}</td>
                  <td className="py-3 px-3 text-xs text-slate-500">{row.y2025}</td>
                  <td className="py-3 px-3 text-xs text-slate-500">{row.y2026}</td>
                  <td className="py-3 px-3 text-xs text-slate-500">{row.y2027}</td>
                  <td className="py-3 px-3">
                    <span className={`text-[10px] px-2 py-0.5 rounded font-medium ${
                      row.status === 'Ahead' ? 'bg-emerald-500/10 text-emerald-400' : 'bg-[#00d4ff]/10 text-[#00d4ff]'
                    }`}>
                      {row.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </motion.div>
    </div>
  );
}
