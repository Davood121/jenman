import { useState, useEffect } from 'react';

export type AgentStatus = 'ACTIVE' | 'STANDBY' | 'PROCESSING' | 'OFFLINE';

export interface AgentData {
  id: string;
  name: string;
  status: AgentStatus;
  load: number;
}

export interface SystemMetrics {
  cpuUsage: number;
  memoryUsed: number;
  memoryTotal: number;
  networkStatus: string;
  uptime: number;
  location: string;
  version: string;
  powerLevel: number;
}

export interface CommandLog {
  id: string;
  sender: 'USER' | 'JARVIS';
  text: string;
  timestamp: Date;
}

const JARVIS_RESPONSES = [
  "Executing protocol. Stand by, sir.",
  "I've run a quick analysis. Shall I proceed with countermeasures?",
  "Command confirmed. All systems nominal.",
  "Accessing required databases. One moment.",
  "Cross-referencing with known threat signatures. No matches found.",
  "The suit's power supply is at optimal capacity, sir.",
  "Initiating target acquisition protocol.",
  "Running background diagnostics. All systems green.",
  "I've taken the liberty of optimizing your request, sir.",
  "Task complete. Anything else, sir?",
  "Security protocols engaged. Perimeter secured.",
  "Rerouting power to primary systems.",
  "Analysis complete. Probability of success: 94.7%.",
];

export function useJarvisSystem() {
  const [time, setTime] = useState(new Date());
  const [isListening, setIsListening] = useState(false);

  const [metrics, setMetrics] = useState<SystemMetrics>({
    cpuUsage: 42,
    memoryUsed: 8.2,
    memoryTotal: 16.0,
    networkStatus: 'CONNECTED',
    uptime: 15791,
    location: 'ONLINE',
    version: 'JARVIS v3.0.1',
    powerLevel: 87,
  });

  const [agents, setAgents] = useState<AgentData[]>([
    { id: '1', name: 'Voice Agent',    status: 'STANDBY',    load: 12 },
    { id: '2', name: 'Vision Agent',   status: 'ACTIVE',     load: 68 },
    { id: '3', name: 'Memory Agent',   status: 'ACTIVE',     load: 45 },
    { id: '4', name: 'System Agent',   status: 'ACTIVE',     load: 32 },
    { id: '5', name: 'Internet Agent', status: 'STANDBY',    load: 5  },
    { id: '6', name: 'Security Agent', status: 'ACTIVE',     load: 74 },
  ]);

  const [logs, setLogs] = useState<CommandLog[]>([
    { id: '1', sender: 'JARVIS', text: 'Good morning. All systems are operational, sir.', timestamp: new Date(Date.now() - 90000) },
    { id: '2', sender: 'JARVIS', text: 'Running background diagnostics... All clear. No threats detected.', timestamp: new Date(Date.now() - 45000) },
    { id: '3', sender: 'JARVIS', text: 'Ready for your commands, sir.', timestamp: new Date(Date.now() - 10000) },
  ]);

  // Clock tick
  useEffect(() => {
    const t = setInterval(() => {
      setTime(new Date());
      setMetrics(prev => ({ ...prev, uptime: prev.uptime + 1 }));
    }, 1000);
    return () => clearInterval(t);
  }, []);

  // Simulate fluctuating metrics
  useEffect(() => {
    const interval = setInterval(() => {
      setMetrics(prev => {
        const cpu = Math.max(15, Math.min(95, prev.cpuUsage + (Math.random() * 8 - 4)));
        const mem = Math.max(6, Math.min(14.5, prev.memoryUsed + (Math.random() * 0.3 - 0.15)));
        const pwr = Math.max(60, Math.min(100, prev.powerLevel + (Math.random() * 2 - 1)));
        return { ...prev, cpuUsage: cpu, memoryUsed: mem, powerLevel: pwr };
      });

      setAgents(prev => prev.map(a => {
        if (a.status === 'OFFLINE') return a;
        const load = Math.max(2, Math.min(98, a.load + (Math.random() * 12 - 6)));
        return { ...a, load };
      }));
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  const sendCommand = (text: string) => {
    if (!text.trim()) return;
    const userLog: CommandLog = {
      id: Math.random().toString(36).slice(2),
      sender: 'USER',
      text,
      timestamp: new Date(),
    };
    setLogs(prev => [...prev, userLog]);
    setIsListening(true);
    setAgents(prev => prev.map(a =>
      a.name === 'Voice Agent' || a.name === 'System Agent'
        ? { ...a, status: 'PROCESSING', load: 88 } : a
    ));

    const delay = 1200 + Math.random() * 800;
    setTimeout(() => {
      setIsListening(false);
      setAgents(prev => prev.map(a =>
        a.name === 'Voice Agent' || a.name === 'System Agent'
          ? { ...a, status: 'ACTIVE', load: 40 } : a
      ));
      const response = JARVIS_RESPONSES[Math.floor(Math.random() * JARVIS_RESPONSES.length)];
      setLogs(prev => [...prev, {
        id: Math.random().toString(36).slice(2),
        sender: 'JARVIS',
        text: response,
        timestamp: new Date(),
      }]);
    }, delay);
  };

  const formatUptime = (s: number) => {
    const h = Math.floor(s / 3600).toString().padStart(2, '0');
    const m = Math.floor((s % 3600) / 60).toString().padStart(2, '0');
    const sec = (s % 60).toString().padStart(2, '0');
    return `${h}:${m}:${sec}`;
  };

  return { time, metrics, agents, logs, isListening, sendCommand, formatUptime, setIsListening };
}
