import { NextResponse } from 'next/server';

// Simple in-memory store for rate limiting, in a real app we are supposed to use redis
const rateLimitMap = new Map();

export async function POST(request) {
  const { heartRate } = await request.json();
  const ip = request.headers.get('x-forwarded-for') || 'unknown-ip';

  // --- SECURITY CHECK 1: Rate Limiting (DoS Detection) ---
  const currentTime = Date.now();
  const lastRequestTime = rateLimitMap.get(ip) || 0;
  
  // If requests are less than 1 second apart, flag as attack
  if (currentTime - lastRequestTime < 1000) {
    return NextResponse.json(
      { message: 'Attack Detected: Rate limit exceeded (DoS attempt)', status: 'BLOCKED' },
      { status: 429 }
    );
  }
  rateLimitMap.set(ip, currentTime);

  // --- SECURITY CHECK 2: Semantic Validation (Data Tampering) ---
  // A human heart rate cannot realistically be 0 or 300+ while alive/resting
  if (heartRate < 30 || heartRate > 220) {
    return NextResponse.json(
      { message: `Attack Detected: Anomalous physiological value (${heartRate} bpm)`, status: 'FLAGGED' },
      { status: 400 }
    );
  }

  // If checks pass:
  return NextResponse.json(
    { message: 'Data accepted', status: 'NORMAL', heartRate },
    { status: 200 }
  );
}