import { useEffect, useRef } from "react";

interface AiCoreProps {
  isListening: boolean;
  cpuLoad: number;
  powerLevel: number;
}

export function AiCore({ isListening, cpuLoad, powerLevel }: AiCoreProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const frameRef = useRef<number>(0);
  const timeRef = useRef<number>(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const resize = () => {
      const parent = canvas.parentElement!;
      const size = Math.min(parent.clientWidth, parent.clientHeight, 560);
      canvas.width = size;
      canvas.height = size;
    };
    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(canvas.parentElement!);

    // ---------- helpers ----------
    const TAU = Math.PI * 2;
    const C = { r: 0, g: 207, b: 255 }; // JARVIS cyan #00CFFF
    const T = { r: 0, g: 255, b: 247 }; // teal accent #00FFF7
    const rgba = (col: typeof C, a: number) =>
      `rgba(${col.r},${col.g},${col.b},${a})`;

    const drawRing = (
      cx: number, cy: number, r: number,
      lineW: number, alpha: number,
      dash: number[] = [], rotation = 0
    ) => {
      ctx.save();
      ctx.translate(cx, cy);
      ctx.rotate(rotation);
      ctx.beginPath();
      ctx.arc(0, 0, r, 0, TAU);
      ctx.strokeStyle = rgba(C, alpha);
      ctx.lineWidth = lineW;
      ctx.setLineDash(dash);
      ctx.stroke();
      ctx.setLineDash([]);
      ctx.restore();
    };

    const drawArcFill = (
      cx: number, cy: number, r: number,
      startAngle: number, endAngle: number,
      lineW: number, col: typeof C, alpha: number
    ) => {
      ctx.save();
      ctx.beginPath();
      ctx.arc(cx, cy, r, startAngle, endAngle);
      ctx.strokeStyle = rgba(col, alpha);
      ctx.lineWidth = lineW;
      ctx.shadowColor = rgba(C, 0.8);
      ctx.shadowBlur = 10;
      ctx.stroke();
      ctx.restore();
    };

    const drawText = (
      text: string, x: number, y: number,
      size: number, alpha: number, col = C
    ) => {
      ctx.save();
      ctx.font = `${size}px 'Share Tech Mono', monospace`;
      ctx.fillStyle = rgba(col, alpha);
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillText(text, x, y);
      ctx.restore();
    };

    const drawTick = (
      cx: number, cy: number, r1: number, r2: number,
      angle: number, lineW: number, alpha: number
    ) => {
      ctx.save();
      ctx.strokeStyle = rgba(C, alpha);
      ctx.lineWidth = lineW;
      ctx.beginPath();
      ctx.moveTo(cx + Math.cos(angle) * r1, cy + Math.sin(angle) * r1);
      ctx.lineTo(cx + Math.cos(angle) * r2, cy + Math.sin(angle) * r2);
      ctx.stroke();
      ctx.restore();
    };

    const safeCpu = cpuLoad ?? 42;
    const safePwr = powerLevel ?? 80;

    const draw = (ts: number) => {
      const w = canvas.width;
      const h = canvas.height;
      const cx = w / 2;
      const cy = h / 2;
      const dt = (ts - (timeRef.current || ts)) / 1000;
      timeRef.current = ts;
      const t = ts / 1000;

      ctx.clearRect(0, 0, w, h);

      const base = w * 0.46; // base radius for outermost ring

      // ── 0. Ambient background glow ──────────────────
      {
        const g = ctx.createRadialGradient(cx, cy, 0, cx, cy, base * 0.9);
        g.addColorStop(0, rgba(C, isListening ? 0.10 : 0.06));
        g.addColorStop(0.5, rgba(C, 0.03));
        g.addColorStop(1, "transparent");
        ctx.fillStyle = g;
        ctx.beginPath();
        ctx.arc(cx, cy, base * 0.9, 0, TAU);
        ctx.fill();
      }

      // ── 1. Outer dashed orbit ring (slow CW) ────────
      drawRing(cx, cy, base, 1, 0.18, [4, 8], t * 0.08);

      // Ticks at 16 positions on outer ring
      for (let i = 0; i < 16; i++) {
        const a = (TAU / 16) * i + t * 0.08;
        const major = i % 4 === 0;
        drawTick(cx, cy, base - (major ? 14 : 7), base, a, major ? 1.5 : 0.8, major ? 0.7 : 0.35);
      }

      // Cardinal labels outside ring
      const cardinals = ["N", "E", "S", "W"];
      for (let i = 0; i < 4; i++) {
        const a = (TAU / 4) * i - Math.PI / 2 + t * 0.08;
        const lx = cx + Math.cos(a) * (base + 16);
        const ly = cy + Math.sin(a) * (base + 16);
        drawText(cardinals[i], lx, ly, Math.round(w * 0.022), 0.45);
      }

      // ── 2. Data arc ring (segments, slow CCW) ───────
      const r2 = base * 0.84;
      const segCount = 24;
      const rotation2 = -t * 0.15;
      for (let i = 0; i < segCount; i++) {
        const a0 = (TAU / segCount) * i + rotation2;
        const a1 = a0 + (TAU / segCount) * 0.72;
        const active = i < Math.round(segCount * safeCpu / 100);
        drawArcFill(cx, cy, r2, a0, a1, 3,
          active ? T : C,
          active ? 0.65 : 0.18
        );
      }

      // ── 3. Diagnostic ring (medium, CW) ─────────────
      const r3 = base * 0.68;
      drawRing(cx, cy, r3, 1, 0.30, [2, 6], t * 0.22);
      // 8 major ticks
      for (let i = 0; i < 8; i++) {
        const a = (TAU / 8) * i + t * 0.22;
        drawTick(cx, cy, r3 - 10, r3 + 5, a, 1, 0.55);
      }
      // readout labels at 4 cardinal positions of this ring
      const r3Labels = [
        `PWR ${safePwr.toFixed(0)}%`,
        `CPU ${safeCpu.toFixed(0)}%`,
        `ALT 0.00km`,
        `RNG 2.4km`,
      ];
      for (let i = 0; i < 4; i++) {
        const a = (TAU / 4) * i - Math.PI / 2 + t * 0.22;
        const lx = cx + Math.cos(a) * (r3 + 22);
        const ly = cy + Math.sin(a) * (r3 + 22);
        drawText(r3Labels[i], lx, ly, Math.round(w * 0.019), 0.6);
      }

      // ── 4. Radar sweep ──────────────────────────────
      const r4 = base * 0.56;
      {
        const sweepAngle = (t * 1.2) % TAU - Math.PI / 2;
        // Sweep gradient (cone trailing behind sweep line)
        const sweepGrad = ctx.createConicalGradient
          ? null
          : null; // fallback: manual arc fade
        ctx.save();
        const SWEEP_ARC = Math.PI * 0.45;
        for (let step = 0; step < 30; step++) {
          const frac = step / 30;
          const a0 = sweepAngle - SWEEP_ARC * (1 - frac);
          const a1 = sweepAngle - SWEEP_ARC * (1 - frac - 1 / 30);
          ctx.beginPath();
          ctx.moveTo(cx, cy);
          ctx.arc(cx, cy, r4, a0, a1);
          ctx.closePath();
          ctx.fillStyle = rgba(C, frac * 0.12);
          ctx.fill();
        }
        // Sweep line
        ctx.beginPath();
        ctx.moveTo(cx, cy);
        ctx.lineTo(cx + Math.cos(sweepAngle) * r4, cy + Math.sin(sweepAngle) * r4);
        ctx.strokeStyle = rgba(C, 0.85);
        ctx.lineWidth = 1.5;
        ctx.shadowColor = rgba(C, 1);
        ctx.shadowBlur = 8;
        ctx.stroke();
        ctx.restore();

        // Radar ring
        drawRing(cx, cy, r4, 1, 0.40, [], 0);
        // Cross hairs
        for (let i = 0; i < 4; i++) {
          const a = (TAU / 4) * i;
          drawTick(cx, cy, r4 - 6, r4 + 4, a, 1, 0.5);
        }
      }

      // ── 5. Inner diagnostic ring (CCW) ──────────────
      const r5 = base * 0.40;
      drawRing(cx, cy, r5, 1.5, 0.45, [3, 3], -t * 0.4);
      // Power arc fill (CCW from top)
      {
        const pArc = (safePwr / 100) * TAU;
        drawArcFill(cx, cy, r5, -Math.PI / 2, -Math.PI / 2 + pArc, 3, T, 0.75);
        // Animated dot at tip of power arc
        const tipA = -Math.PI / 2 + pArc - t * 0.4;
        ctx.beginPath();
        ctx.arc(
          cx + Math.cos(tipA) * r5,
          cy + Math.sin(tipA) * r5,
          3, 0, TAU
        );
        ctx.fillStyle = rgba(T, 0.9);
        ctx.shadowColor = rgba(T, 1);
        ctx.shadowBlur = 10;
        ctx.fill();
        ctx.shadowBlur = 0;
      }

      // ── 6. Targeting reticle (static, thin) ─────────
      const r6 = base * 0.28;
      drawRing(cx, cy, r6, 1, 0.35, [], 0);
      // 4 gap segments (open crosshair style)
      for (let i = 0; i < 4; i++) {
        const a = (TAU / 4) * i;
        const gap = 0.25; // radians gap
        drawArcFill(cx, cy, r6, a + gap, a + Math.PI / 2 - gap, 2, C, 0.7);
      }
      // Cross lines through center
      [0, Math.PI / 2].forEach(a => {
        ctx.save();
        ctx.strokeStyle = rgba(C, 0.30);
        ctx.lineWidth = 0.8;
        ctx.beginPath();
        ctx.moveTo(cx + Math.cos(a) * (r6 - 8), cy + Math.sin(a) * (r6 - 8));
        ctx.lineTo(cx - Math.cos(a) * (r6 - 8), cy - Math.sin(a) * (r6 - 8));
        ctx.stroke();
        ctx.restore();
      });
      // Small ticks at 45° inside reticle
      for (let i = 0; i < 4; i++) {
        const a = (TAU / 4) * i + Math.PI / 4;
        drawTick(cx, cy, r6 - 10, r6, a, 1, 0.5);
      }

      // ── 7. Arc reactor core (6 arcs) ────────────────
      const r7 = base * 0.14;
      // Outer glow
      {
        const g = ctx.createRadialGradient(cx, cy, 0, cx, cy, r7 * 2.5);
        g.addColorStop(0, rgba(C, isListening ? 0.35 : 0.22));
        g.addColorStop(0.5, rgba(C, isListening ? 0.12 : 0.07));
        g.addColorStop(1, "transparent");
        ctx.fillStyle = g;
        ctx.beginPath();
        ctx.arc(cx, cy, r7 * 2.5, 0, TAU);
        ctx.fill();
      }
      // 6 arcs
      for (let i = 0; i < 6; i++) {
        const a0 = (TAU / 6) * i + t * 0.5;
        const a1 = a0 + TAU / 12;
        drawArcFill(cx, cy, r7, a0, a1, 4, C, isListening ? 0.95 : 0.75);
      }
      // Inner ring
      drawRing(cx, cy, r7 * 0.55, 1.5, 0.6, [], t * 0.8);
      // Core dot
      {
        const g = ctx.createRadialGradient(cx, cy, 0, cx, cy, r7 * 0.4);
        g.addColorStop(0, rgba(C, 0.95));
        g.addColorStop(0.5, rgba(C, 0.5));
        g.addColorStop(1, rgba(C, 0.0));
        ctx.fillStyle = g;
        ctx.beginPath();
        ctx.arc(cx, cy, r7 * 0.4, 0, TAU);
        ctx.fill();
      }

      // ── 8. Listening waveform bars ───────────────────
      if (isListening) {
        const bars = 18;
        const wY = cy + base * 0.62;
        const wW = base * 0.55;
        for (let i = 0; i < bars; i++) {
          const bh = (Math.sin(t * 8 + i * 0.6) * 0.5 + 0.5) * 24 + 4;
          const bx = cx - wW / 2 + (wW / bars) * i + wW / bars / 2;
          ctx.save();
          ctx.fillStyle = rgba(T, 0.85);
          ctx.shadowColor = rgba(T, 0.9);
          ctx.shadowBlur = 6;
          ctx.fillRect(bx - 1.5, wY - bh / 2, 3, bh);
          ctx.restore();
        }
      }

      // ── 9. Corner bracket labels ─────────────────────
      {
        const fs = Math.round(w * 0.018);
        // top-left
        drawText("SUIT: MARK L", cx - base * 0.6, cy - base * 0.78, fs, 0.5);
        drawText("STATUS: OPERATIONAL", cx - base * 0.6, cy - base * 0.71, fs, 0.45);
        // top-right
        drawText("THREAT: NONE", cx + base * 0.6, cy - base * 0.78, fs, 0.5);
        drawText(`INTEGRITY: ${(100 - cpuLoad * 0.3).toFixed(0)}%`, cx + base * 0.6, cy - base * 0.71, fs, 0.45);
        // bottom readouts
        const spd = (cpuLoad * 2.3 + 180).toFixed(0);
        drawText(`SPEED ${spd} km/h`, cx, cy + base * 0.88, fs, 0.45);
      }

      frameRef.current = requestAnimationFrame(draw);
    };

    frameRef.current = requestAnimationFrame(draw);
    return () => {
      cancelAnimationFrame(frameRef.current);
      ro.disconnect();
    };
  }, [isListening, cpuLoad ?? 0, powerLevel ?? 80]);

  return (
    <div className="relative flex items-center justify-center w-full h-full min-h-[340px] md:min-h-[500px]">
      <canvas
        ref={canvasRef}
        className="relative z-10"
        style={{ maxWidth: "100%", maxHeight: "100%" }}
      />
    </div>
  );
}
