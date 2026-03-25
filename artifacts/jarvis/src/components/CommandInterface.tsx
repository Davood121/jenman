import { useState, useRef, useEffect } from "react";
import { CommandLog } from "@/hooks/use-jarvis-system";
import { Send, Mic, Download } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

function downloadLog(logs: CommandLog[]) {
  const header = [
    "╔══════════════════════════════════════════════════╗",
    "║         J.A.R.V.I.S.  —  SESSION LOG             ║",
    "║   Just A Rather Very Intelligent System v3.0.1   ║",
    "╚══════════════════════════════════════════════════╝",
    `  Exported: ${new Date().toLocaleString()}`,
    "──────────────────────────────────────────────────",
    "",
  ].join("\n");

  const body = logs
    .map((l) => {
      const ts = l.timestamp.toLocaleTimeString();
      const label = l.sender === "JARVIS" ? "[JARVIS]" : "[ USER ]";
      return `${ts}  ${label}  ${l.text}`;
    })
    .join("\n");

  const footer = [
    "",
    "──────────────────────────────────────────────────",
    "  END OF SESSION LOG  //  STARK INDUSTRIES SECURE",
  ].join("\n");

  const blob = new Blob([header + body + footer], { type: "text/plain" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `jarvis-session-${Date.now()}.txt`;
  a.click();
  URL.revokeObjectURL(url);
}

interface CommandInterfaceProps {
  logs: CommandLog[];
  onCommand: (text: string) => void;
  isListening: boolean;
}

export function CommandInterface({ logs, onCommand, isListening }: CommandInterfaceProps) {
  const [input, setInput] = useState("");
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [logs]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (input.trim() && !isListening) {
      onCommand(input);
      setInput("");
    }
  };

  return (
    <div className="w-full relative j-panel j-bracket flex flex-col h-full max-h-[280px] z-20"
      style={{ borderTop: "1px solid rgba(0,207,255,0.3)" }}>

      {/* Header bar */}
      <div className="flex items-center justify-between px-4 py-2 font-mono text-[10px] tracking-widest"
        style={{ borderBottom: "1px solid rgba(0,207,255,0.15)", background: "rgba(0,207,255,0.03)" }}>
        <div className="flex items-center gap-2" style={{ color: "var(--j-cyan)" }}>
          <div className="w-2 h-2 rounded-full animate-pulse"
            style={{ background: isListening ? "var(--j-teal)" : "var(--j-cyan)", boxShadow: `0 0 6px ${isListening ? "var(--j-teal)" : "var(--j-cyan)"}` }} />
          <span className="j-glow" style={{ color: "var(--j-cyan)" }}>COMM LINK — JARVIS v3.0</span>
        </div>
        <div className="flex items-center gap-3">
          {/* Download session log button */}
          <button
            onClick={() => downloadLog(logs)}
            title="EXPORT SESSION LOG"
            className="flex items-center gap-1.5 px-2 py-1 font-mono text-[9px] tracking-widest transition-all hover:opacity-100 opacity-60"
            style={{
              border: "1px solid rgba(0,207,255,0.35)",
              background: "rgba(0,207,255,0.06)",
              color: "var(--j-cyan)",
              borderRadius: 2,
            }}
          >
            <Download className="w-3 h-3" />
            <span>EXPORT LOG</span>
          </button>
          {[0.3, 0.6, 1].map((o, i) => (
            <div key={i} className="w-1.5 h-1.5 rounded-full"
              style={{ background: "var(--j-cyan)", opacity: o }} />
          ))}
        </div>
      </div>

      {/* Messages */}
      <div ref={scrollRef} className="flex-1 overflow-y-auto px-4 py-3 space-y-2 font-mono text-sm">
        <AnimatePresence initial={false}>
          {logs.map((log) => (
            <motion.div
              key={log.id}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.25 }}
              className={`flex gap-3 ${log.sender === "USER" ? "flex-row-reverse" : "flex-row"}`}
            >
              {/* Avatar */}
              <div className="shrink-0 font-mono text-[9px] tracking-widest opacity-60 pt-0.5 w-12 text-center"
                style={{ color: log.sender === "JARVIS" ? "var(--j-teal)" : "var(--j-cyan)" }}>
                {log.sender}
              </div>
              {/* Bubble */}
              <div className="max-w-[75%] flex flex-col gap-0.5">
                <span className="text-[9px] font-mono opacity-35" style={{ color: "var(--j-cyan)" }}>
                  {log.timestamp.toLocaleTimeString()}
                </span>
                <div className="px-3 py-2 text-xs"
                  style={{
                    border: `1px solid ${log.sender === "JARVIS" ? "rgba(0,255,247,0.25)" : "rgba(0,207,255,0.25)"}`,
                    background: log.sender === "JARVIS" ? "rgba(0,255,247,0.05)" : "rgba(0,207,255,0.05)",
                    color: log.sender === "JARVIS" ? "var(--j-teal)" : "hsl(195 80% 85%)",
                    textShadow: log.sender === "JARVIS" ? "0 0 8px rgba(0,255,247,0.4)" : "none",
                    borderRadius: "2px",
                  }}>
                  {log.sender === "JARVIS" ? (
                    <span>
                      <span className="opacity-50">{">> "}</span>{log.text}
                      <span className="j-blink">_</span>
                    </span>
                  ) : log.text}
                </div>
              </div>
            </motion.div>
          ))}

          {isListening && (
            <motion.div key="thinking" initial={{ opacity: 0 }} animate={{ opacity: 1 }}
              className="flex gap-3">
              <div className="shrink-0 text-[9px] font-mono tracking-widest opacity-60 pt-0.5 w-12 text-center"
                style={{ color: "var(--j-teal)" }}>JARVIS</div>
              <div className="flex items-center gap-1.5 px-3 py-2"
                style={{ border: "1px solid rgba(0,255,247,0.2)", background: "rgba(0,255,247,0.04)", borderRadius: 2 }}>
                {[0, 150, 300].map((d) => (
                  <motion.div key={d} animate={{ scaleY: [1, 2, 1] }}
                    transition={{ duration: 0.5, repeat: Infinity, delay: d / 1000 }}
                    className="w-1 h-3 rounded-full"
                    style={{ background: "var(--j-teal)", boxShadow: "0 0 6px var(--j-teal)" }}
                  />
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Input */}
      <div className="px-3 py-2" style={{ borderTop: "1px solid rgba(0,207,255,0.12)" }}>
        <form onSubmit={handleSubmit} className="flex gap-2">
          <div className="flex-1 flex items-center gap-2 px-3"
            style={{ border: "1px solid rgba(0,207,255,0.3)", background: "rgba(0,207,255,0.04)", borderRadius: 2 }}>
            <span className="font-mono text-sm j-blink" style={{ color: "var(--j-cyan)" }}>{">"}</span>
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              disabled={isListening}
              placeholder="Enter command directive..."
              className="flex-1 bg-transparent outline-none text-sm font-mono py-2.5 placeholder:opacity-30"
              style={{ color: "hsl(195 80% 85%)" }}
            />
          </div>

          <button type="button" disabled={isListening}
            className="px-3 py-2 transition-all"
            style={{
              border: "1px solid rgba(0,207,255,0.3)",
              background: isListening ? "rgba(0,255,247,0.1)" : "rgba(0,207,255,0.06)",
              color: isListening ? "var(--j-teal)" : "var(--j-cyan)",
              borderRadius: 2
            }}>
            <Mic className={`w-4 h-4 ${isListening ? "animate-pulse" : ""}`} />
          </button>

          <button type="submit" disabled={!input.trim() || isListening}
            className="flex items-center gap-2 px-4 py-2 font-display font-bold text-xs tracking-widest transition-all disabled:opacity-30"
            style={{
              border: "1px solid rgba(0,207,255,0.5)",
              background: "rgba(0,207,255,0.1)",
              color: "var(--j-cyan)",
              textShadow: "0 0 6px var(--j-cyan)",
              borderRadius: 2
            }}>
            <span>EXECUTE</span>
            <Send className="w-3.5 h-3.5" />
          </button>
        </form>
      </div>
    </div>
  );
}
