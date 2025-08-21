'use client';
import { useEffect, useState } from 'react';

type Row = { id: string; timestamp: string; student: string; barcode: string; type: string; note: string };

export default function LiveFeedPage() {
  const [rows, setRows] = useState<Row[]>([]);

  useEffect(() => {
    let stop = false;
    async function load() {
      try {
        const res = await fetch('/api/attendance?limit=25', { cache: 'no-store' });
        const data = await res.json();
        if (!stop) setRows(data);
      } catch {}
    }
    load();
    const id = setInterval(load, 5000);
    return () => { stop = true; clearInterval(id); };
  }, []);

  return (
    <div className="max-w-3xl mx-auto space-y-4">
      <h1 className="text-xl font-semibold">Live Feed (Last 25)</h1>
      <div className="card">
        <ul className="text-sm space-y-1">
          {rows.map(r => (
            <li key={r.id}>
              <span className="text-slate-400">{new Date(r.timestamp).toLocaleString('en-US')} — </span>
              <strong>{r.student}</strong> <span className="badge ml-1">{r.type}</span>
              {r.barcode ? <span className="ml-2 text-slate-400">[{r.barcode}]</span> : null}
              {r.note ? <span className="ml-2">{r.note}</span> : null}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
