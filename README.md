# Ball OS: Real-Time Law 2 Compliance Middleware

Ball OS is an open-source middleware that infers football inflation pressure from Inertial Measurement Unit (IMU) sensor data, enabling real-time IFAB Law 2 compliance monitoring.

## Features

- Real-time pressure inference from IMU data
- Physics-informed LSTM neural network
- Standardised JSON schema for ball health data
- VAR dashboard with compliance alerts
- Incident logging and audit trail

## Dashboard

The Ball OS dashboard provides:
- 3D ball visualisation with status-based glow
- Real-time PASS/FAIL for all Law 2 metrics
- Pressure history trend graph
- Incident timeline with audit log
- Predictive health score

## JSON Schema

The Ball OS defines a standardised JSON schema for Law 2 compliance:

```json
{
"ball_id": "WC-2026-009",
"timestamp": "2026-06-24T20:18:45.678Z",
"law_2_metrics": {
"pressure_atm": 0.48,
"circumference_cm": 68.5,
"weight_g": 430,
"structural_integrity": 93
},
"law_2_status": {
"pressure_status": "FAIL",
"overall_compliance": "DEFECTIVE"
},
"alert": {
"severity": "CRITICAL",
"message": "BALL PRESSURE BELOW LEGAL LIMIT"
}
}
