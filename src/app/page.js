'use client';
import { useState } from 'react';

export default function Home() {
  const [logs, setLogs] = useState([]);


  // this is a reusable function for sending the vitals to the api
  const sendData = async (bpm, type) => {
    try {
      const res = await fetch('/api/vitals', {
        method: 'POST',
        body: JSON.stringify({
          heartRate: bpm,
        }),
      });

      const data = await res.json();
      const logMessage = `[${type}] sent ${bpm} BPM -> Response: ${data.message}`;
      setLogs((prev) => [logMessage, ...prev]);
    } catch (err) {
      setLogs((prev) => [`Error connecting to server`, ...prev]);
    }
  };

  // Simulates a flooding attack
  const launchDoSAttack = () => {
    for (let i = 0; i < 10; i++) {
      sendData(80, 'DoS ATTACK'); // Sending 10 requests instantly
    }
  };

  return (
    <div className="p-10 max-w-2xl mx-auto font-sans">
      <h1 className="text-3xl font-bold mb-6">IoMT Security Demo</h1>

      <div className="grid gap-4 mb-8 p-6 border rounded bg-gray-50">
        <h2 className="font-bold text-xl">Device Simulator</h2>

        {/* Normal Behavior */}
        <button
          onClick={() => sendData(75, 'Normal')}
          className="bg-green-500 text-white p-2 rounded hover:bg-green-600 transition"
        >
          Send Normal Vitals (75 BPM)
        </button>

        {/* Attack 1: Data Tampering */}
        <button
          onClick={() => sendData(999, 'Spoofing')}
          className="bg-orange-500 text-white p-2 rounded hover:bg-orange-600 transition"
        >
          Attack: Send Impossible Data (999 BPM)
        </button>

        {/* Attack 2: DoS */}
        <button
          onClick={launchDoSAttack}
          className="bg-red-600 text-white p-2 rounded hover:bg-red-700 transition"
        >
          Attack: Flood Server (DoS)
        </button>
      </div>

      <div className="border p-4 rounded bg-black text-green-400 font-mono h-64 overflow-y-auto">
        <h3 className="text-white border-b border-gray-700 mb-2">Security Logs</h3>
        {logs.map((log, i) => (
          <div key={i} className="text-sm mb-1">{log}</div>
        ))}
      </div>
    </div>
  );
}