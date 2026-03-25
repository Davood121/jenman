import { Link } from "wouter";
import { AlertTriangle } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-background p-4 relative overflow-hidden">
      
      {/* Tech Background Grid */}
      <div className="absolute inset-0 z-0 pointer-events-none" 
           style={{ 
             background: 'linear-gradient(rgba(255, 0, 0, 0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(255, 0, 0, 0.05) 1px, transparent 1px)',
             backgroundSize: '40px 40px'
           }} 
      />

      <div className="glass-panel border-destructive/50 max-w-md w-full p-8 text-center relative z-10 tech-border">
        
        <div className="flex justify-center mb-6">
          <div className="relative">
            <div className="absolute inset-0 bg-destructive/20 blur-xl rounded-full" />
            <AlertTriangle className="h-20 w-20 text-destructive relative z-10 animate-pulse" />
          </div>
        </div>

        <h1 className="text-4xl font-display font-bold text-destructive mb-2 tracking-widest" style={{ textShadow: '0 0 20px rgba(255,0,0,0.5)' }}>
          ERR_404
        </h1>
        
        <p className="text-foreground font-mono mb-8 text-sm">
          DIRECTIVE NOT FOUND. <br/>
          THE REQUESTED PROTOCOL DOES NOT EXIST IN MAINFRAME.
        </p>

        <Link 
          href="/" 
          className="inline-flex items-center justify-center px-6 py-3 border border-primary text-primary hover:bg-primary/20 hover:text-white font-display font-bold tracking-widest rounded transition-all duration-300 uppercase glow-box"
        >
          Return to Dashboard
        </Link>
      </div>
    </div>
  );
}
