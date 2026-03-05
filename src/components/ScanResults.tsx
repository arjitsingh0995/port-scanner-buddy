import { motion, AnimatePresence } from "framer-motion";
import { Trash2, Play, Shield, ShieldAlert, ShieldX, ShieldCheck } from "lucide-react";
import type { ScanTarget } from "@/hooks/usePortScanner";

interface ScanResultsProps {
  targets: ScanTarget[];
  onRemove: (id: string) => void;
  onScan: (id: string) => void;
}

const statusColors: Record<string, string> = {
  open: "text-primary",
  closed: "text-muted-foreground",
  filtered: "text-cyber-amber",
};

const statusIcons: Record<string, typeof Shield> = {
  open: ShieldAlert,
  closed: ShieldCheck,
  filtered: ShieldX,
};

const ScanResults = ({ targets, onRemove, onScan }: ScanResultsProps) => {
  if (targets.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-muted-foreground">
        <Shield size={48} className="mb-4 opacity-30" />
        <p className="text-sm">No targets added yet. Add a target above to begin scanning.</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <AnimatePresence>
        {targets.map(target => {
          const openPorts = target.results.filter(r => r.status === "open");
          const filteredPorts = target.results.filter(r => r.status === "filtered");

          return (
            <motion.div
              key={target.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20, height: 0 }}
              className="rounded-lg border border-border bg-card overflow-hidden glow-border"
            >
              {/* Header */}
              <div className="flex items-center justify-between border-b border-border px-4 py-3">
                <div className="flex items-center gap-3">
                  <span className="font-display font-semibold text-foreground">{target.host}</span>
                  <span className="text-xs text-muted-foreground">{target.ports}</span>
                  {target.status === "complete" && (
                    <span className="rounded-full bg-primary/10 px-2 py-0.5 text-xs text-primary">
                      {openPorts.length} open · {filteredPorts.length} filtered
                    </span>
                  )}
                  {target.status === "scanning" && (
                    <span className="rounded-full bg-cyber-amber/10 px-2 py-0.5 text-xs text-cyber-amber animate-pulse">
                      Scanning...
                    </span>
                  )}
                  {target.status === "error" && (
                    <span className="rounded-full bg-destructive/10 px-2 py-0.5 text-xs text-destructive">
                      Error
                    </span>
                  )}
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => onScan(target.id)}
                    disabled={target.status === "scanning"}
                    className="rounded p-1.5 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground disabled:opacity-30"
                  >
                    <Play size={14} />
                  </button>
                  <button
                    onClick={() => onRemove(target.id)}
                    className="rounded p-1.5 text-muted-foreground transition-colors hover:bg-destructive/10 hover:text-destructive"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>

              {/* Progress bar */}
              {target.status === "scanning" && (
                <div className="h-0.5 bg-muted">
                  <motion.div
                    className="h-full bg-primary"
                    initial={{ width: 0 }}
                    animate={{ width: `${target.progress}%` }}
                    transition={{ ease: "linear" }}
                  />
                </div>
              )}

              {/* Results table */}
              {target.results.length > 0 && (
                <div className="max-h-64 overflow-auto">
                  <table className="w-full text-xs">
                    <thead className="sticky top-0 bg-card">
                      <tr className="border-b border-border text-left text-muted-foreground">
                        <th className="px-4 py-2 font-medium">Port</th>
                        <th className="px-4 py-2 font-medium">Status</th>
                        <th className="px-4 py-2 font-medium">Service</th>
                      </tr>
                    </thead>
                    <tbody>
                      {target.results
                        .filter(r => r.status !== "closed")
                        .map(r => {
                          const Icon = statusIcons[r.status];
                          return (
                            <motion.tr
                              key={r.port}
                              initial={{ opacity: 0 }}
                              animate={{ opacity: 1 }}
                              className="border-b border-border/50 last:border-0"
                            >
                              <td className="px-4 py-1.5 font-mono text-foreground">{r.port}</td>
                              <td className={`px-4 py-1.5 flex items-center gap-1.5 ${statusColors[r.status]}`}>
                                <Icon size={12} /> {r.status}
                              </td>
                              <td className="px-4 py-1.5 text-muted-foreground">{r.service || "—"}</td>
                            </motion.tr>
                          );
                        })}
                    </tbody>
                  </table>
                  {target.status === "complete" && target.results.filter(r => r.status !== "closed").length === 0 && (
                    <p className="px-4 py-3 text-xs text-muted-foreground">All scanned ports are closed.</p>
                  )}
                </div>
              )}
            </motion.div>
          );
        })}
      </AnimatePresence>
    </div>
  );
};

export default ScanResults;
