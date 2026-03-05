import { motion } from "framer-motion";
import { Radar, Zap, Trash2 } from "lucide-react";
import TargetInput from "@/components/TargetInput";
import ScanResults from "@/components/ScanResults";
import { usePortScanner } from "@/hooks/usePortScanner";

const Index = () => {
  const { targets, addTarget, removeTarget, scanTarget, scanAll, clearAll } = usePortScanner();

  return (
    <div className="min-h-screen bg-background scanline">
      <div className="mx-auto max-w-4xl px-4 py-10">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8 text-center"
        >
          <div className="mb-3 flex items-center justify-center gap-2">
            <Radar className="text-primary" size={28} />
            <h1 className="font-display text-3xl font-bold tracking-tight text-foreground glow-text">
              Port Scanner
            </h1>
          </div>
          <p className="text-sm text-muted-foreground">
            Add targets, specify port ranges, and simulate network reconnaissance.
          </p>
        </motion.div>

        {/* Input */}
        <div className="mb-6">
          <TargetInput onAdd={addTarget} />
        </div>

        {/* Action bar */}
        {targets.length > 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="mb-4 flex items-center justify-between"
          >
            <span className="text-xs text-muted-foreground">
              {targets.length} target{targets.length !== 1 ? "s" : ""}
            </span>
            <div className="flex gap-2">
              <button
                onClick={clearAll}
                className="flex items-center gap-1.5 rounded border border-border px-3 py-1.5 text-xs text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
              >
                <Trash2 size={12} /> Clear All
              </button>
              <button
                onClick={scanAll}
                className="flex items-center gap-1.5 rounded bg-primary px-3 py-1.5 text-xs font-semibold text-primary-foreground transition-all hover:brightness-110 active:scale-95"
              >
                <Zap size={12} /> Scan All
              </button>
            </div>
          </motion.div>
        )}

        {/* Results */}
        <ScanResults targets={targets} onRemove={removeTarget} onScan={scanTarget} />
      </div>
    </div>
  );
};

export default Index;
