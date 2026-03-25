import { format } from "date-fns";
import { motion } from "framer-motion";

interface TopBarProps {
  time: Date;
  status: string;
  powerLevel: number;
  uptime: number;
  formatUptime: (s: number) => string;
}

export function TopBar({ time, status, powerLevel, uptime, formatUptime }: TopBarProps) {
  return (
    <header className="relative z-20 flex items-center justify-between px-5 py-3 j-panel j-bracket"
      style={{ borderBottom: "1px solid rgba(0,207,255,0.3)" }}>

      {/* ── Left block ── */}
      <div className="flex flex-col gap-0.5 font-mono min-w-[160px]">
        <span className="text-[10px] tracking-[0.25em] opacity-50 j-glow" style={{ color: "var(--j-cyan)" }}>SYS.CLOCK</span>
        <span className="text-xl font-bold tracking-widest j-glow" style={{ color: "var(--j-cyan)" }}>
          {format(time, "HH:mm:ss")}
          <span className="text-sm opacity-60">.{format(time, "SSS")}</span>
        </span>
        <span className="text-[10px] opacity-45 tracking-widest" style={{ color: "var(--j-cyan)" }}>
          {format(time, "yyyy.MM.dd")} — UPTIME {formatUptime(uptime)}
        </span>
      </div>

      {/* ── Center title ── */}
      <div className="flex flex-col items-center gap-1 absolute left-1/2 -translate-x-1/2">
        <div className="flex items-center gap-[3px]">
          {"J.A.R.V.I.S.".split("").map((ch, i) => (
            <motion.span
              key={i}
              initial={{ opacity: 0, y: -14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.07, duration: 0.4 }}
              className="font-display font-bold tracking-widest j-glow"
              style={{ fontSize: "clamp(1.4rem,3.5vw,2.5rem)", color: "var(--j-cyan)" }}
            >
              {ch}
            </motion.span>
          ))}
        </div>

        {/* animated underline */}
        <motion.div
          initial={{ scaleX: 0 }} animate={{ scaleX: 1 }}
          transition={{ delay: 1, duration: 0.6 }}
          className="relative h-[1px] w-full overflow-hidden"
          style={{ background: "rgba(0,207,255,0.3)" }}
        >
          <motion.div
            animate={{ x: ["0%", "100%"] }}
            transition={{ duration: 2.5, repeat: Infinity, ease: "linear" }}
            className="absolute top-0 left-0 h-full w-1/4"
            style={{ background: "linear-gradient(to right, transparent, var(--j-cyan), transparent)" }}
          />
        </motion.div>

        <span className="text-[9px] tracking-[0.35em] opacity-40 font-mono" style={{ color: "var(--j-cyan)" }}>
          ARTIFICIAL INTELLIGENCE SYSTEM
        </span>
      </div>

      {/* ── Right block ── */}
      <div className="flex flex-col items-end gap-1 font-mono min-w-[180px]">
        {/* ARC REACTOR power bar */}
        <div className="flex items-center gap-2">
          <span className="text-[10px] tracking-widest opacity-50" style={{ color: "var(--j-cyan)" }}>ARC REACTOR</span>
          <div className="flex gap-[2px] h-[6px] w-[80px]">
            {Array.from({ length: 20 }).map((_, i) => {
              const lit = i < Math.round(powerLevel / 5);
              const col = lit
                ? i > 15 ? "#00fff7" : i > 10 ? "#00cfff" : "#00cfff"
                : "rgba(0,207,255,0.1)";
              return (
                <div key={i} style={{ flex: 1, background: col, borderRadius: 1,
                  boxShadow: lit ? "0 0 4px rgba(0,207,255,0.6)" : "none" }} />
              );
            })}
          </div>
          <span className="text-xs font-bold j-glow" style={{ color: "var(--j-cyan)" }}>
            {powerLevel.toFixed(0)}%
          </span>
        </div>

        {/* Status */}
        <div className="flex items-center gap-2">
          <span className="text-[10px] tracking-widest opacity-50" style={{ color: "var(--j-cyan)" }}>GLOBAL_STATUS</span>
          <span className="relative flex h-2.5 w-2.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full opacity-60"
              style={{ background: status === "ONLINE" ? "var(--j-teal)" : "var(--j-red)" }} />
            <span className="relative inline-flex rounded-full h-2.5 w-2.5"
              style={{
                background: status === "ONLINE" ? "var(--j-teal)" : "var(--j-red)",
                boxShadow: `0 0 8px ${status === "ONLINE" ? "var(--j-teal)" : "var(--j-red)"}`
              }} />
          </span>
          <span className="text-sm font-bold tracking-wider"
            style={{ color: status === "ONLINE" ? "var(--j-teal)" : "var(--j-red)",
              textShadow: `0 0 8px ${status === "ONLINE" ? "var(--j-teal)" : "var(--j-red)"}` }}>
            {status}
          </span>
        </div>
      </div>
    </header>
  );
}
