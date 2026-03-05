import { useState, useCallback } from "react";

export interface PortResult {
  port: number;
  status: "open" | "closed" | "filtered";
  service?: string;
}

export interface ScanTarget {
  id: string;
  host: string;
  ports: string;
  status: "idle" | "scanning" | "complete" | "error";
  results: PortResult[];
  progress: number;
}

const COMMON_SERVICES: Record<number, string> = {
  21: "FTP", 22: "SSH", 23: "Telnet", 25: "SMTP", 53: "DNS",
  80: "HTTP", 110: "POP3", 143: "IMAP", 443: "HTTPS", 445: "SMB",
  993: "IMAPS", 995: "POP3S", 1433: "MSSQL", 3306: "MySQL",
  3389: "RDP", 5432: "PostgreSQL", 5900: "VNC", 6379: "Redis",
  8080: "HTTP-Alt", 8443: "HTTPS-Alt", 27017: "MongoDB",
};

function parsePorts(portStr: string): number[] {
  const ports: number[] = [];
  const parts = portStr.split(",").map(s => s.trim());
  for (const part of parts) {
    if (part.includes("-")) {
      const [start, end] = part.split("-").map(Number);
      if (!isNaN(start) && !isNaN(end) && start <= end && start > 0 && end <= 65535) {
        for (let i = start; i <= end; i++) ports.push(i);
      }
    } else {
      const p = Number(part);
      if (!isNaN(p) && p > 0 && p <= 65535) ports.push(p);
    }
  }
  return [...new Set(ports)].sort((a, b) => a - b);
}

function simulateScan(port: number): PortResult {
  const rand = Math.random();
  const status = rand < 0.25 ? "open" : rand < 0.35 ? "filtered" : "closed";
  return { port, status, service: COMMON_SERVICES[port] || (status === "open" ? "unknown" : undefined) };
}

export function usePortScanner() {
  const [targets, setTargets] = useState<ScanTarget[]>([]);

  const addTarget = useCallback((host: string, ports: string) => {
    const id = crypto.randomUUID();
    setTargets(prev => [...prev, { id, host, ports, status: "idle", results: [], progress: 0 }]);
    return id;
  }, []);

  const removeTarget = useCallback((id: string) => {
    setTargets(prev => prev.filter(t => t.id !== id));
  }, []);

  const scanTarget = useCallback(async (id: string) => {
    setTargets(prev => prev.map(t => t.id === id ? { ...t, status: "scanning", results: [], progress: 0 } : t));

    const target = targets.find(t => t.id === id);
    if (!target) return;

    const portList = parsePorts(target.ports);
    if (portList.length === 0) {
      setTargets(prev => prev.map(t => t.id === id ? { ...t, status: "error" } : t));
      return;
    }

    for (let i = 0; i < portList.length; i++) {
      await new Promise(r => setTimeout(r, 30 + Math.random() * 70));
      const result = simulateScan(portList[i]);
      setTargets(prev => prev.map(t =>
        t.id === id ? { ...t, results: [...t.results, result], progress: ((i + 1) / portList.length) * 100 } : t
      ));
    }

    setTargets(prev => prev.map(t => t.id === id ? { ...t, status: "complete", progress: 100 } : t));
  }, [targets]);

  const scanAll = useCallback(async () => {
    for (const target of targets) {
      if (target.status === "idle" || target.status === "complete" || target.status === "error") {
        await scanTarget(target.id);
      }
    }
  }, [targets, scanTarget]);

  const clearAll = useCallback(() => setTargets([]), []);

  return { targets, addTarget, removeTarget, scanTarget, scanAll, clearAll };
}
