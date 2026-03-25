import { SystemMetrics } from "@/hooks/use-jarvis-system";
import { motion } from "framer-motion";

interface SystemPanelProps {
  metrics: SystemMetrics;
  formatUptime: (s: number) => string;
}

const BarGauge = ({ label, value, max, unit, warn = 75, danger = 90 }:
  { label: string; value: number; max: number; unit: string; warn?: number; danger?: number }) => {
  const pct = Math.min(100, (value / max) * 100);
  const color = pct >= danger ? "var(--j-red)" : pct >= warn ? "#ffb700" : "var(--j-teal)";
  const segs = 30;
  return (
    <div className="flex flex-col gap-1">
      <div className="flex justify-between font-mono text-[10px]">
        <span className="tracking-widest opacity-55" style={{ color: "var(--j-cyan)" }}>{label}</span>
        <span style={{ color }}>{value.toFixed(1)} {unit}</span>
      </div>
      <div className="flex gap-[2px] h-[5px]">
        {Array.from({ length: segs }).map((_, i) => {
          const lit = i < Math.round(pct / (100 / segs));
          const c = lit ? (i > segs * 0.9 ? "var(--j-red)" : i > segs * 0.75 ? "#ffb700" : "var(--j-teal)") : "rgba(0,207,255,0.08)";
          return <div key={i} style={{ flex: 1, borderRadius: 1, background: c, boxShadow: lit ? `0 0 4px ${c}` : "none" }} />;
        })}
      </div>
    </div>
  );
};

const DataRow = ({ label, value, accent = false }: { label: string; value: string; accent?: boolean }) => (
  <div className="flex items-baseline justify-between py-1.5 font-mono"
    style={{ borderBottom: "1px solid rgba(0,207,255,0.08)" }}>
    <span className="text-[10px] tracking-widest opacity-45" style={{ color: "var(--j-cyan)" }}>{label}</span>
    <span className="text-xs font-semibold tracking-wider"
      style={{ color: accent ? "var(--j-teal)" : "hsl(195 80% 85%)",
        textShadow: accent ? "0 0 8px var(--j-teal)" : "none" }}>
      {value}
    </span>
  </div>
);

export function SystemPanel({ metrics, formatUptime }: SystemPanelProps) {
  const memPct = (metrics.memoryUsed / metrics.memoryTotal) * 100;

  return (
    <div className="flex flex-col gap-3 w-full md:w-[260px] shrink-0 z-20">

      {/* Panel header */}
      <div className="flex items-center gap-2 pb-2 font-display font-semibold"
        style={{ borderBottom: "1px solid rgba(0,207,255,0.2)", color: "var(--j-cyan)" }}>
        <span className="text-base tracking-widest j-glow" style={{ color: "var(--j-cyan)" }}>SUIT DIAGNOSTICS</span>
        <span className="ml-auto font-mono text-[10px] opacity-50">v3.0</span>
      </div>

      {/* Main panel */}
      <motion.div
        initial={{ opacity: 0, x: 30 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5 }}
        className="j-panel j-bracket p-3 flex flex-col gap-3 relative"
      >
        {/* Scan line */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <motion.div
            animate={{ y: ["-100%", "200%"] }}
            transition={{ duration: 5, repeat: Infinity, ease: "linear" }}
            style={{ height: "2px", background: "linear-gradient(to right, transparent, rgba(0,207,255,0.3), transparent)" }}
          />
        </div>

        {/* Gauges */}
        <div className="flex flex-col gap-3 relative z-10">
          <BarGauge label="CPU PROCESSING" value={metrics.cpuUsage} max={100} unit="%" warn={70} danger={88} />
          <BarGauge label="MEMORY ALLOC" value={metrics.memoryUsed} max={metrics.memoryTotal} unit="GB" warn={70} danger={88} />
        </div>

        {/* Circular arc mini gauges */}
        <div className="flex justify-around relative z-10 py-1">
          {[
            { label: "HULL", value: 98 },
            { label: "WEAPONS", value: 75 },
            { label: "SHIELDS", value: 62 },
          ].map(({ label, value }) => {
            const TAU = Math.PI * 2;
            const arc = (value / 100) * TAU * 0.75;
            const start = Math.PI * 0.625;
            const r = 22;
            const size = 54;
            const col = value > 80 ? "var(--j-teal)" : value > 50 ? "#ffb700" : "var(--j-red)";
            return (
              <div key={label} className="flex flex-col items-center gap-0.5">
                <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
                  {/* Track */}
                  <circle cx={size/2} cy={size/2} r={r}
                    fill="none" stroke="rgba(0,207,255,0.1)" strokeWidth="3"
                    strokeDasharray={`${TAU * 0.75 * r} ${TAU * 0.25 * r + 1}`}
                    strokeDashoffset={0}
                    strokeLinecap="round"
                    transform={`rotate(${start * 180 / Math.PI} ${size/2} ${size/2})`}
                  />
                  {/* Fill */}
                  <circle cx={size/2} cy={size/2} r={r}
                    fill="none" stroke={col} strokeWidth="3"
                    strokeDasharray={`${arc * r} 9999`}
                    strokeLinecap="round"
                    style={{ filter: `drop-shadow(0 0 4px ${col})` }}
                    transform={`rotate(${start * 180 / Math.PI} ${size/2} ${size/2})`}
                  />
                  <text x={size/2} y={size/2 + 1} textAnchor="middle" dominantBaseline="middle"
                    fill={col} fontFamily="Share Tech Mono" fontSize="10" fontWeight="bold">
                    {value}
                  </text>
                </svg>
                <span className="font-mono text-[8px] opacity-50 tracking-widest" style={{ color: "var(--j-cyan)" }}>
                  {label}
                </span>
              </div>
            );
          })}
        </div>

        {/* Data rows */}
        <div className="flex flex-col relative z-10">
          <DataRow label="NETWORK" value={metrics.networkStatus} accent={metrics.networkStatus === "CONNECTED"} />
          <DataRow label="UPTIME" value={formatUptime(metrics.uptime)} />
          <DataRow label="LOCATION" value={metrics.location} />
          <DataRow label="FIRMWARE" value={metrics.version} />
        </div>
      </motion.div>

      {/* Threat panel */}
      <div className="j-panel j-bracket p-3 flex flex-col gap-2 relative z-10">
        <div className="font-mono text-[10px] tracking-widest opacity-50 mb-1" style={{ color: "var(--j-cyan)" }}>
          THREAT ASSESSMENT
        </div>
        {[
          { label: "AIR", level: 0 },
          { label: "GROUND", level: 0 },
          { label: "CYBER", level: 1 },
        ].map(({ label, level }) => (
          <div key={label} className="flex items-center gap-2">
            <span className="font-mono text-[9px] w-14 opacity-60" style={{ color: "var(--j-cyan)" }}>{label}</span>
            <div className="flex gap-[3px] h-[4px] flex-1">
              {Array.from({ length: 5 }).map((_, i) => (
                <div key={i} style={{
                  flex: 1, borderRadius: 1,
                  background: i < level ? "var(--j-red)" : "rgba(0,207,255,0.08)",
                  boxShadow: i < level ? "0 0 4px var(--j-red)" : "none",
                }} />
              ))}
            </div>
            <span className="font-mono text-[9px] w-8 text-right"
              style={{ color: level > 3 ? "var(--j-red)" : level > 1 ? "#ffb700" : "rgba(0,207,255,0.4)" }}>
              {level === 0 ? "NIL" : level < 3 ? "LOW" : level < 5 ? "MED" : "CRIT"}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
