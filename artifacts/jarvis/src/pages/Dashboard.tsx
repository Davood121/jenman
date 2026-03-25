import { useJarvisSystem } from "@/hooks/use-jarvis-system";
import { TopBar } from "@/components/TopBar";
import { AgentPanel } from "@/components/AgentPanel";
import { SystemPanel } from "@/components/SystemPanel";
import { AiCore } from "@/components/AiCore";
import { CommandInterface } from "@/components/CommandInterface";

export default function Dashboard() {
  const { time, metrics, agents, logs, isListening, sendCommand, formatUptime } = useJarvisSystem();

  return (
    <div className="h-screen w-full flex flex-col overflow-hidden relative"
      style={{ background: "var(--j-bg)" }}>

      {/* Subtle grid overlay (Iron Man lab holographic floor grid) */}
      <div className="absolute inset-0 pointer-events-none z-0" style={{
        backgroundImage: `
          linear-gradient(rgba(0,207,255,0.025) 1px, transparent 1px),
          linear-gradient(90deg, rgba(0,207,255,0.025) 1px, transparent 1px)
        `,
        backgroundSize: "40px 40px",
      }} />

      {/* Radial vignette */}
      <div className="absolute inset-0 pointer-events-none z-0" style={{
        background: "radial-gradient(ellipse 80% 60% at 50% 50%, transparent 30%, rgba(4,10,24,0.85) 100%)"
      }} />

      {/* Corner decorations (Iron Man HUD corner brackets) */}
      {[
        { top: 6, left: 6 },
        { top: 6, right: 6 },
        { bottom: 6, left: 6 },
        { bottom: 6, right: 6 },
      ].map((style, i) => (
        <div key={i} className="absolute pointer-events-none z-10 w-12 h-12" style={style}>
          <svg width="48" height="48" viewBox="0 0 48 48" fill="none">
            {i === 0 && <><line x1="0" y1="0" x2="20" y2="0" stroke="rgba(0,207,255,0.5)" strokeWidth="1.5" /><line x1="0" y1="0" x2="0" y2="20" stroke="rgba(0,207,255,0.5)" strokeWidth="1.5" /></>}
            {i === 1 && <><line x1="48" y1="0" x2="28" y2="0" stroke="rgba(0,207,255,0.5)" strokeWidth="1.5" /><line x1="48" y1="0" x2="48" y2="20" stroke="rgba(0,207,255,0.5)" strokeWidth="1.5" /></>}
            {i === 2 && <><line x1="0" y1="48" x2="20" y2="48" stroke="rgba(0,207,255,0.5)" strokeWidth="1.5" /><line x1="0" y1="48" x2="0" y2="28" stroke="rgba(0,207,255,0.5)" strokeWidth="1.5" /></>}
            {i === 3 && <><line x1="48" y1="48" x2="28" y2="48" stroke="rgba(0,207,255,0.5)" strokeWidth="1.5" /><line x1="48" y1="48" x2="48" y2="28" stroke="rgba(0,207,255,0.5)" strokeWidth="1.5" /></>}
          </svg>
        </div>
      ))}

      {/* Scan line */}
      <div className="absolute inset-0 pointer-events-none z-1 overflow-hidden">
        <div className="j-scan absolute inset-0" />
      </div>

      {/* ── TOP BAR ── */}
      <div className="relative z-20 shrink-0">
        <TopBar
          time={time}
          status={metrics.location}
          powerLevel={metrics.powerLevel}
          uptime={metrics.uptime}
          formatUptime={formatUptime}
        />
      </div>

      {/* ── MAIN BODY ── */}
      <div className="relative z-10 flex-1 flex flex-col md:flex-row gap-4 px-4 py-3 min-h-0 overflow-hidden">

        {/* Left — Agent subsystems */}
        <div className="hidden md:flex flex-col overflow-y-auto pr-1">
          <AgentPanel agents={agents} />
        </div>

        {/* Center — Arc Reactor / Diagnostic widget */}
        <div className="flex-1 flex items-center justify-center min-w-0">
          <AiCore
            isListening={isListening}
            cpuLoad={metrics.cpuUsage}
            powerLevel={metrics.powerLevel}
          />
        </div>

        {/* Right — Suit diagnostics */}
        <div className="hidden md:flex flex-col overflow-y-auto pl-1">
          <SystemPanel metrics={metrics} formatUptime={formatUptime} />
        </div>
      </div>

      {/* ── COMM LINK (bottom) ── */}
      <div className="relative z-20 shrink-0 h-[220px]">
        <CommandInterface
          logs={logs}
          onCommand={sendCommand}
          isListening={isListening}
        />
      </div>

      {/* CRT scanline overlay */}
      <div className="pointer-events-none absolute inset-0 z-50 opacity-[0.025]"
        style={{ background: "repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,0,0,1) 2px, rgba(0,0,0,1) 4px)" }} />
    </div>
  );
}
