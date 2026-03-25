import { Mic, Eye, BrainCircuit, Cpu, Globe, ShieldCheck } from "lucide-react";
import { AgentData, AgentStatus } from "@/hooks/use-jarvis-system";
import { motion } from "framer-motion";

interface AgentPanelProps {
  agents: AgentData[];
}

const iconMap: Record<string, React.ReactNode> = {
  'Voice Agent':    <Mic className="w-4 h-4" />,
  'Vision Agent':   <Eye className="w-4 h-4" />,
  'Memory Agent':   <BrainCircuit className="w-4 h-4" />,
  'System Agent':   <Cpu className="w-4 h-4" />,
  'Internet Agent': <Globe className="w-4 h-4" />,
  'Security Agent': <ShieldCheck className="w-4 h-4" />,
};

const statusStyle: Record<AgentStatus, { color: string; label: string; glow: string }> = {
  ACTIVE:     { color: "var(--j-teal)",  label: "ACTIVE",   glow: "0 0 6px rgba(0,255,247,0.7)" },
  STANDBY:    { color: "var(--j-cyan)",  label: "STANDBY",  glow: "0 0 6px rgba(0,207,255,0.5)" },
  PROCESSING: { color: "#ffb700",        label: "PROCESS",  glow: "0 0 6px rgba(255,183,0,0.7)" },
  OFFLINE:    { color: "var(--j-red)",   label: "OFFLINE",  glow: "0 0 6px rgba(255,60,60,0.5)" },
};

export function AgentPanel({ agents }: AgentPanelProps) {
  return (
    <div className="flex flex-col gap-3 w-full md:w-[260px] shrink-0 z-20">

      {/* Panel header */}
      <div className="flex items-center gap-2 pb-2 font-display font-semibold"
        style={{ borderBottom: "1px solid rgba(0,207,255,0.2)", color: "var(--j-cyan)" }}>
        <Cpu className="w-4 h-4" style={{ filter: "drop-shadow(0 0 5px var(--j-cyan))" }} />
        <span className="tracking-widest text-base j-glow" style={{ color: "var(--j-cyan)" }}>SUBSYSTEMS</span>
        <span className="ml-auto font-mono text-[10px] opacity-50">06/{agents.length.toString().padStart(2,"0")}</span>
      </div>

      {/* Agent cards */}
      <div className="flex flex-col gap-2">
        {agents.map((agent, i) => {
          const s = statusStyle[agent.status];
          const loadW = `${agent.load.toFixed(0)}%`;

          return (
            <motion.div
              key={agent.id}
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.08, duration: 0.4 }}
              className="relative j-panel j-bracket p-2.5 flex flex-col gap-2 overflow-hidden"
              style={{ borderColor: `${s.color}30` }}
            >
              {/* Scan line */}
              <div className="absolute inset-0 pointer-events-none overflow-hidden">
                <motion.div
                  animate={{ y: ["-100%", "200%"] }}
                  transition={{ duration: 3 + i * 0.5, repeat: Infinity, ease: "linear", delay: i * 0.4 }}
                  style={{ height: "2px", background: `linear-gradient(to right, transparent, ${s.color}40, transparent)` }}
                />
              </div>

              {/* Row 1: icon + name + status badge */}
              <div className="flex items-center gap-2 relative z-10">
                <div className="p-1.5 rounded" style={{ background: `${s.color}18`, color: s.color, boxShadow: s.glow }}>
                  {iconMap[agent.name] || <Cpu className="w-4 h-4" />}
                </div>
                <span className="flex-1 font-display font-semibold text-xs tracking-wider"
                  style={{ color: "hsl(195 80% 85%)" }}>
                  {agent.name.replace(" Agent", "").toUpperCase()}
                </span>
                <span className="font-mono text-[9px] px-1.5 py-0.5 rounded"
                  style={{ border: `1px solid ${s.color}50`, color: s.color }}>
                  {s.label}
                </span>
              </div>

              {/* Row 2: segmented load bar */}
              <div className="relative z-10 flex flex-col gap-0.5">
                <div className="flex justify-between font-mono text-[9px] opacity-50">
                  <span>LOAD</span>
                  <span style={{ color: s.color }}>{loadW}</span>
                </div>
                <div className="flex gap-[2px] h-[5px]">
                  {Array.from({ length: 20 }).map((_, j) => {
                    const lit = j < Math.round(agent.load / 5);
                    return (
                      <div key={j} style={{
                        flex: 1, borderRadius: 1,
                        background: lit ? s.color : "rgba(0,207,255,0.08)",
                        boxShadow: lit ? `0 0 3px ${s.color}` : "none",
                      }} />
                    );
                  })}
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
