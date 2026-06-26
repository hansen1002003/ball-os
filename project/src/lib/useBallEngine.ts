import { useState, useCallback, useEffect, useRef } from 'react';
import { supabase } from './supabase';
import type { Ball, BallEvent, BallMeasurement, BallState, ComplianceStatus, PredictiveReading } from './types';

interface BallEngineState {
  ball: Ball | null;
  events: BallEvent[];
  measurements: BallMeasurement[];
  demoMode: boolean;
  predictiveReadings: PredictiveReading[];
  loading: boolean;
  error: string | null;
}

export function useBallEngine() {
  const [state, setState] = useState<BallEngineState>({
    ball: null,
    events: [],
    measurements: [],
    demoMode: false,
    predictiveReadings: [],
    loading: true,
    error: null,
  });

  const intervalRef = useRef<number | null>(null);

  const calculateHealthScore = (pressure: number, circumference: number, weight: number, integrity: number): number => {
    const pressureScore = pressure >= 0.6 && pressure <= 1.1 ? 100 : pressure >= 0.5 && pressure <= 1.2 ? 60 : 20;
    const circumferenceScore = circumference >= 68 && circumference <= 70 ? 100 : circumference >= 67 && circumference <= 71 ? 60 : 20;
    const weightScore = weight >= 410 && weight <= 450 ? 100 : weight >= 390 && weight <= 470 ? 60 : 20;
    const integrityScore = integrity;
    return Math.round((pressureScore + circumferenceScore + weightScore + integrityScore) / 4);
  };

  const calculateTrustScore = (healthScore: number, historyLength: number): number => {
    const historyBonus = Math.min(historyLength * 0.5, 10);
    const stabilityBonus = healthScore > 80 ? 5 : 0;
    const base = Math.min(healthScore + historyBonus + stabilityBonus, 100);
    return Math.round(base * 10) / 10;
  };

  const calculateComplianceStatus = (pressure: number, circumference: number, weight: number): ComplianceStatus => {
    const pressureOK = pressure >= 0.6 && pressure <= 1.1;
    const circumferenceOK = circumference >= 68 && circumference <= 70;
    const weightOK = weight >= 410 && weight <= 450;
    const allNear = pressure >= 0.5 && pressure <= 1.2 && circumference >= 67 && circumference <= 71 && weight >= 390 && weight <= 470;
    if (pressureOK && circumferenceOK && weightOK) return 'Compliant';
    if (allNear) return 'Near Threshold';
    return 'Non-Compliant';
  };

  const determineState = (healthScore: number, complianceStatus: ComplianceStatus, integrity: number): BallState => {
    if (integrity <= 10) return 'RETIRED';
    if (integrity <= 30) return 'REPLACED';
    if (complianceStatus === 'Non-Compliant' || healthScore <= 20) return 'CRITICAL';
    if (healthScore <= 40) return 'WARNING';
    if (healthScore <= 60) return 'MONITOR';
    if (healthScore <= 80) return 'HEALTHY';
    if (healthScore > 80 && complianceStatus === 'Compliant') return 'ACTIVE';
    return 'READY';
  };

  const generatePredictiveReadings = (currentPressure: number, currentCircumference: number, currentHealth: number): PredictiveReading[] => {
    const readings: PredictiveReading[] = [];
    for (const minutes of [15, 30, 45]) {
      const decayFactor = 1 - (minutes / 180);
      const noise = (Math.random() - 0.5) * 0.02;
      readings.push({
        minutes,
        pressure: Math.round((currentPressure * decayFactor + noise) * 1000) / 1000,
        circumference: Math.round((currentCircumference + (Math.random() - 0.5) * 0.2) * 100) / 100,
        health_score: Math.round(currentHealth * decayFactor - minutes * 0.05),
      });
    }
    return readings;
  };

  const addEvent = async (ballId: string, eventType: string, message: string, details?: Record<string, unknown>) => {
    await supabase.from('ball_events').insert({
      ball_id: ballId,
      event_type: eventType,
      message,
      details: details || {},
    });
  };

  const addMeasurement = async (ballId: string, metric: string, value: number) => {
    await supabase.from('ball_measurements').insert({
      ball_id: ballId,
      metric,
      value,
    });
  };

  const addStateHistory = async (ballId: string, fromState: string, toState: string, reason?: string) => {
    await supabase.from('ball_state_history').insert({
      ball_id: ballId,
      from_state: fromState,
      to_state: toState,
      reason,
    });
  };

  const updateBall = async (updates: Partial<Ball>, ballId: string) => {
    const { error } = await supabase.from('balls').update(updates).eq('id', ballId);
    if (error) throw error;
  };

  const loadData = useCallback(async () => {
    try {
      const { data: ballData, error: ballError } = await supabase.from('balls').select('*').limit(1).single();
      if (ballError) throw ballError;

      const { data: eventsData } = await supabase.from('ball_events').select('*').order('created_at', { ascending: false }).limit(50);
      const { data: measurementsData } = await supabase.from('ball_measurements').select('*').order('created_at', { ascending: false }).limit(100);

      const predictive = generatePredictiveReadings(ballData.pressure, ballData.circumference, ballData.health_score);

      setState(prev => ({
        ...prev,
        ball: ballData,
        events: eventsData || [],
        measurements: measurementsData || [],
        predictiveReadings: predictive,
        loading: false,
        error: null,
      }));
    } catch (err) {
      setState(prev => ({ ...prev, loading: false, error: (err as Error).message }));
    }
  }, []);

  const activateBall = useCallback(async () => {
    if (!state.ball) return;
    const ball = state.ball;
    const newState = 'ACTIVE' as BallState;
    const newActivationCount = ball.activation_count + 1;

    await updateBall({
      current_state: newState,
      activation_count: newActivationCount,
      match_assignment: ball.match_assignment || 'Active Match',
    }, ball.id);

    await addStateHistory(ball.id, ball.current_state, newState, 'Ball activated for match play');
    await addEvent(ball.id, 'BALL_ACTIVATED', `Ball ${ball.ball_id} activated for match play`, {
      activation_count: newActivationCount,
      match_assignment: ball.match_assignment || 'Active Match',
    });
    await addMeasurement(ball.id, 'activation', newActivationCount);
    await loadData();
  }, [state.ball, loadData]);

  const simulateInPlay = useCallback(async () => {
    if (!state.ball) return;
    const ball = state.ball;

    await addEvent(ball.id, 'BALL_IN_PLAY', 'Ball entered active play conditions');
    await addMeasurement(ball.id, 'match_play', ball.matches_played + 1);
    await loadData();
  }, [state.ball, loadData]);

  const simulatePressureDrop = useCallback(async () => {
    if (!state.ball) return;
    const ball = state.ball;
    const newPressure = Math.max(0.3, ball.pressure - (0.05 + Math.random() * 0.1));
    const newHealth = calculateHealthScore(newPressure, ball.circumference, ball.weight, ball.integrity);
    const newTrust = calculateTrustScore(newHealth, state.events.length);
    const newCompliance = calculateComplianceStatus(newPressure, ball.circumference, ball.weight);
    const newState = determineState(newHealth, newCompliance, ball.integrity);

    await updateBall({
      pressure: newPressure,
      health_score: newHealth,
      trust_score: newTrust,
      compliance_status: newCompliance,
      current_state: newState,
    }, ball.id);

    await addEvent(ball.id, 'PRESSURE_WARNING', `Pressure drop detected: ${newPressure.toFixed(3)} bar`, { pressure: newPressure });
    await addMeasurement(ball.id, 'pressure', newPressure);

    if (newState !== ball.current_state) {
      await addStateHistory(ball.id, ball.current_state, newState, 'Pressure drop triggered state change');
    }
    await loadData();
  }, [state.ball, state.events, loadData]);

  const simulateComplianceWarning = useCallback(async () => {
    if (!state.ball) return;
    const ball = state.ball;
    const newCircumference = ball.circumference + (Math.random() > 0.5 ? 0.8 : -0.8);
    const newWeight = ball.weight + (Math.random() > 0.5 ? 15 : -15);
    const newHealth = calculateHealthScore(ball.pressure, newCircumference, newWeight, ball.integrity);
    const newTrust = calculateTrustScore(newHealth, state.events.length);
    const newCompliance = calculateComplianceStatus(ball.pressure, newCircumference, newWeight);
    const newState = determineState(newHealth, newCompliance, ball.integrity);

    await updateBall({
      circumference: newCircumference,
      weight: newWeight,
      health_score: newHealth,
      trust_score: newTrust,
      compliance_status: newCompliance,
      current_state: newState,
    }, ball.id);

    await addEvent(ball.id, 'COMPLIANCE_WARNING', `Compliance threshold warning: circumference ${newCircumference.toFixed(1)}cm, weight ${newWeight.toFixed(0)}g`, {
      circumference: newCircumference,
      weight: newWeight,
    });
    await addMeasurement(ball.id, 'circumference', newCircumference);
    await addMeasurement(ball.id, 'weight', newWeight);

    if (newState !== ball.current_state) {
      await addStateHistory(ball.id, ball.current_state, newState, 'Compliance warning triggered state change');
    }
    await loadData();
  }, [state.ball, state.events, loadData]);

  const replaceBall = useCallback(async () => {
    if (!state.ball) return;
    const ball = state.ball;
    const newState = 'REPLACED' as BallState;

    await updateBall({
      current_state: newState,
      match_assignment: null,
    }, ball.id);

    await addStateHistory(ball.id, ball.current_state, newState, 'Ball replaced during match');
    await addEvent(ball.id, 'BALL_REPLACED', `Ball ${ball.ball_id} replaced by match official`, {
      previous_state: ball.current_state,
      matches_played: ball.matches_played,
    });
    await loadData();
  }, [state.ball, loadData]);

  const retireBall = useCallback(async () => {
    if (!state.ball) return;
    const ball = state.ball;
    const newState = 'RETIRED' as BallState;

    await updateBall({
      current_state: newState,
      match_assignment: null,
      integrity: Math.max(0, ball.integrity - 50),
    }, ball.id);

    await addStateHistory(ball.id, ball.current_state, newState, 'Ball retired from service');
    await addEvent(ball.id, 'BALL_RETIRED', `Ball ${ball.ball_id} retired from active service`, {
      final_health_score: ball.health_score,
      total_matches: ball.matches_played,
    });
    await loadData();
  }, [state.ball, loadData]);

  const resetBall = useCallback(async () => {
    if (!state.ball) return;
    const ball = state.ball;

    await updateBall({
      current_state: 'READY',
      compliance_status: 'Compliant',
      health_score: 100,
      trust_score: 100,
      pressure: 0.6,
      circumference: 68.5,
      weight: 430,
      integrity: 100,
      matches_played: 0,
      activation_count: 0,
    }, ball.id);

    await addEvent(ball.id, 'BALL_CREATED', 'Football re-registered and reset to compliance standards');
    await addMeasurement(ball.id, 'pressure', 0.6);
    await addMeasurement(ball.id, 'circumference', 68.5);
    await addMeasurement(ball.id, 'weight', 430);
    await loadData();
  }, [state.ball, loadData]);

  const toggleDemoMode = useCallback(() => {
    setState(prev => ({ ...prev, demoMode: !prev.demoMode }));
  }, []);

  // Demo mode simulation
  useEffect(() => {
    if (!state.demoMode) {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
      return;
    }

    intervalRef.current = window.setInterval(async () => {
      if (!state.ball) return;
      const ball = state.ball;
      const rand = Math.random();

      if (rand < 0.15) {
        // Simulate pressure change
        const drift = (Math.random() - 0.5) * 0.08;
        const newPressure = Math.max(0.3, Math.min(1.5, ball.pressure + drift));
        const newHealth = calculateHealthScore(newPressure, ball.circumference, ball.weight, ball.integrity);
        const newCompliance = calculateComplianceStatus(newPressure, ball.circumference, ball.weight);
        const newState = determineState(newHealth, newCompliance, ball.integrity);

        await updateBall({
          pressure: newPressure,
          health_score: newHealth,
          trust_score: calculateTrustScore(newHealth, state.events.length + 1),
          compliance_status: newCompliance,
          current_state: newState,
        }, ball.id);

        await addMeasurement(ball.id, 'pressure', newPressure);

        if (newPressure < 0.5 || newPressure > 1.2) {
          await addEvent(ball.id, 'PRESSURE_WARNING', `Pressure anomaly: ${newPressure.toFixed(3)} bar`, { pressure: newPressure });
        }

        if (newState !== ball.current_state) {
          await addStateHistory(ball.id, ball.current_state, newState, 'Demo simulation state change');
        }
        await loadData();
      } else if (rand < 0.25) {
        // Simulate temperature change
        const newTemp = Math.round(18 + Math.random() * 12);
        await updateBall({ temperature: newTemp }, ball.id);
        await addMeasurement(ball.id, 'temperature', newTemp);
        await loadData();
      }
    }, 3000);

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [state.demoMode, state.ball, state.events, loadData]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  return {
    ...state,
    activateBall,
    simulateInPlay,
    simulatePressureDrop,
    simulateComplianceWarning,
    replaceBall,
    retireBall,
    resetBall,
    toggleDemoMode,
    refresh: loadData,
  };
}
