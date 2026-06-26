export type BallState = 'READY' | 'ACTIVE' | 'HEALTHY' | 'MONITOR' | 'WARNING' | 'CRITICAL' | 'REPLACED' | 'RETIRED';

export type ComplianceStatus = 'Compliant' | 'Near Threshold' | 'Non-Compliant';

export type EventType = 'BALL_CREATED' | 'BALL_ACTIVATED' | 'BALL_IN_PLAY' | 'PRESSURE_WARNING' | 'COMPLIANCE_WARNING' | 'BALL_REPLACED' | 'BALL_RETIRED';

export interface Ball {
  id: string;
  ball_id: string;
  manufacture_date: string;
  matches_played: number;
  training_sessions: number;
  activation_count: number;
  health_score: number;
  trust_score: number;
  current_state: BallState;
  match_assignment: string | null;
  compliance_status: ComplianceStatus;
  pressure: number;
  circumference: number;
  weight: number;
  integrity: number;
  temperature: number;
  created_at: string;
  updated_at: string;
}

export interface BallEvent {
  id: string;
  ball_id: string;
  event_type: EventType;
  message: string;
  details: Record<string, unknown>;
  created_at: string;
}

export interface BallMeasurement {
  id: string;
  ball_id: string;
  metric: string;
  value: number;
  created_at: string;
}

export interface BallStateHistory {
  id: string;
  ball_id: string;
  from_state: BallState;
  to_state: BallState;
  reason: string | null;
  created_at: string;
}

export interface PredictiveReading {
  minutes: number;
  pressure: number;
  circumference: number;
  health_score: number;
}

export const STATE_COLORS: Record<BallState, string> = {
  READY: '#22c55e',
  ACTIVE: '#10b981',
  HEALTHY: '#06b6d4',
  MONITOR: '#f59e0b',
  WARNING: '#f97316',
  CRITICAL: '#ef4444',
  REPLACED: '#64748b',
  RETIRED: '#94a3b8',
};

export const STATE_ORDER: BallState[] = ['READY', 'ACTIVE', 'HEALTHY', 'MONITOR', 'WARNING', 'CRITICAL', 'REPLACED', 'RETIRED'];

export const LIFECYCLE_STAGES = [
  { label: 'Manufactured', state: 'READY' as BallState },
  { label: 'Approved', state: 'READY' as BallState },
  { label: 'Match Ready', state: 'READY' as BallState },
  { label: 'In Play', state: 'ACTIVE' as BallState },
  { label: 'Monitoring', state: 'MONITOR' as BallState },
  { label: 'Replacement Candidate', state: 'WARNING' as BallState },
  { label: 'Retired', state: 'RETIRED' as BallState },
];
