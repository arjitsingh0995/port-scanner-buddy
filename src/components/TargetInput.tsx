import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, X } from "lucide-react";

interface TargetInputProps {
  onAdd: (host: string, ports: string) => void;
}

const TargetInput = ({ onAdd }: TargetInputProps) => {
  const [host, setHost] = useState("");
  const [ports, setPorts] = useState("21-25, 80, 443, 3306, 8080");

  const handleAdd = () => {
    if (!host.trim()) return;
    onAdd(host.trim(), ports.trim());
    setHost("");
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="rounded-lg border border-border bg-card p-4 glow-border"
    >
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end">
        <div className="flex-1 space-y-1.5">
          <label className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
            Target Host / IP
          </label>
          <input
            value={host}
            onChange={e => setHost(e.target.value)}
            onKeyDown={e => e.key === "Enter" && handleAdd()}
            placeholder="e.g. 192.168.1.1 or example.com"
            className="w-full rounded border border-border bg-muted px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary"
          />
        </div>
        <div className="flex-1 space-y-1.5">
          <label className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
            Ports (comma / range)
          </label>
          <input
            value={ports}
            onChange={e => setPorts(e.target.value)}
            onKeyDown={e => e.key === "Enter" && handleAdd()}
            placeholder="e.g. 80, 443, 1000-2000"
            className="w-full rounded border border-border bg-muted px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary"
          />
        </div>
        <button
          onClick={handleAdd}
          className="flex items-center gap-1.5 rounded bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground transition-all hover:brightness-110 active:scale-95"
        >
          <Plus size={16} /> Add Target
        </button>
      </div>
    </motion.div>
  );
};

export default TargetInput;
