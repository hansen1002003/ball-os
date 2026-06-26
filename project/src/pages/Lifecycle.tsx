import { motion } from 'framer-motion';
import { Activity, ArrowLeft } from 'lucide-react';
import { useBallEngine } from '../lib/useBallEngine';
import { Link } from 'react-router-dom';
import { LIFECYCLE_STAGES, STATE_COLORS } from '../lib/types';

export function Lifecycle() {
  const { ball, loading } = useBallEngine();

  if (loading || !ball) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="w-5 h-5 border-2 border-[#00d4ff] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  const currentStateIndex = LIFECYCLE_STAGES.findIndex(s => s.state === ball.current_state);
  const activeIndex = currentStateIndex >= 1 ? currentStateIndex : 1;

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Link to="/" className="flex items-center gap-2 text-sm text-slate-500 hover:text-white transition-colors">
          <ArrowLeft className="w-4 h-4" />
          Back to Dashboard
        </Link>
      </div>

      <div>
        <h2 className="text-xl font-bold text-white tracking-tight">Ball Lifecycle</h2>
        <p className="text-sm text-slate-500 mt-1">Complete lifecycle from manufacture to retirement</p>
      </div>

      <motion.div
        initial={{ opacity: 1, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-[#0f1623] rounded-xl border border-slate-800/50 p-8"
      >
        <div className="flex items-center gap-2 mb-8">
          <Activity className="w-4 h-4 text-[#00d4ff]" />
          <h3 className="text-sm font-semibold text-white">Lifecycle Timeline</h3>
          <span className="ml-auto text-xs text-slate-500">Current: <span style={{ color: STATE_COLORS[ball.current_state] }}>{ball.current_state}</span></span>
        </div>

        <div className="relative">
          {/* Vertical line */}
          <div className="absolute left-5 top-0 bottom-0 w-0.5 bg-slate-800" />

          <div className="space-y-6">
            {LIFECYCLE_STAGES.map((stage, i) => {
              const isActive = i <= activeIndex;
              const isCurrent = stage.state === ball.current_state;
              const color = STATE_COLORS[stage.state];

              return (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.1 }}
                  className="relative flex items-center gap-5"
                >
                  {/* Node */}
                  <div className="relative z-10">
                    <motion.div
                      className={`w-10 h-10 rounded-full flex items-center justify-center border-2 ${isCurrent ? 'animate-pulse' : ''}`}
                      style={{
                        borderColor: isActive ? color : '#334155',
                        backgroundColor: isActive ? `${color}20` : 'transparent',
                      }}
                    >
                      <div
                        className="w-3 h-3 rounded-full"
                        style={{ backgroundColor: isActive ? color : '#334155' }}
                      />
                    </motion.div>
                  </div>

                  {/* Content */}
                  <div className={`flex-1 p-4 rounded-lg border ${isCurrent ? 'border-[#00d4ff]/30 bg-[#00d4ff]/5' : 'border-slate-800/50 bg-slate-800/20'}`}>
                    <div className="flex items-center justify-between">
                      <div>
                        <span className="text-sm font-semibold text-white">{stage.label}</span>
                        <div className="text-xs text-slate-500 mt-0.5">State: {stage.state}</div>
                      </div>
                      {isCurrent && (
                        <span className="text-[10px] px-2 py-1 rounded-full font-medium" style={{ backgroundColor: `${color}20`, color }}>
                          Current
                        </span>
                      )}
                    </div>
                  </div>

                  {i < LIFECYCLE_STAGES.length - 1 && (
                    <div className="absolute left-5 top-10 w-0.5 h-6" style={{ backgroundColor: isActive ? color : '#334155' }} />
                  )}
                </motion.div>
              );
            })}
          </div>
        </div>
      </motion.div>
    </div>
  );
}
