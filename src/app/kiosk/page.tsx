'use client';
import { useEffect, useRef, useState } from 'react';
import dayjs from 'dayjs';

type CheckinResponse = {
  ok: boolean;
  message: string;
  studentName?: string;
  timestamp?: string; // ISO
  type?: 'checkin' | 'checkout';
};

type FeedRow = { id: string; timestamp: string; student: string; barcode: string; type: string; note: string };

type OverlayState =
  | { kind: 'none' }
  | { kind: 'processing' }
  | { kind: 'success'; text: string }
  | { kind: 'error'; text: string };

export default function KioskPage() {
  const inputRef = useRef<HTMLInputElement>(null);
  const submittingRef = useRef(false);
  const [camera, setCamera] = useState(false);
  const [feed, setFeed] = useState<FeedRow[]>([]);
  const [overlay, setOverlay] = useState<OverlayState>({ kind: 'none' });

  // Autofocus the scan input
  useEffect(() => {
    inputRef.current?.focus();
    const onKeyDown = () => {
      if (document.activeElement !== inputRef.current) inputRef.current?.focus();
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, []);

  // Dismiss overlay helper
  function dismissOverlay() {
    setOverlay({ kind: 'none' });
    inputRef.current?.focus();
  }

  // Do the checkin (awaits until email is sent on the server)
  async function doCheckin(code: string) {
    if (!code || submittingRef.current) return;
    submittingRef.current = true;

    setOverlay({ kind: 'processing' }); // show full-screen spinner

    try {
      const res = await fetch('/api/checkin', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code })
      });
      const data = (await res.json()) as CheckinResponse;
      const ok = res.ok && data.ok;

      if (ok) {
        const name = data.studentName ?? 'Student';
        const when = data.timestamp ? dayjs(data.timestamp).format('h:mm A') : dayjs().format('h:mm A');
        const verb = (data.type ?? 'checkin') === 'checkin' ? 'checked in' : 'checked out';
        const text = `Student '${name}' successfully ${verb} at '${when}'.`;
        setOverlay({ kind: 'success', text });

        // Auto-dismiss after ~4 seconds
        setTimeout(() => dismissOverlay(), 4000);
      } else {
        setOverlay({ kind: 'error', text: data.message || 'Failed to check in.' });
      }
    } catch {
      setOverlay({ kind: 'error', text: 'Network error while checking in.' });
    } finally {
      submittingRef.current = false;
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const code = inputRef.current?.value?.trim();
    if (!code) return;
    inputRef.current!.value = '';
    await doCheckin(code);
  }

  // Poll live feed from DB every 5s so it persists/updates
  useEffect(() => {
    let stop = false;
    async function load() {
      try {
        const res = await fetch('/api/attendance?limit=25', { cache: 'no-store' });
        const rows = (await res.json()) as FeedRow[];
        if (!stop) setFeed(rows);
      } catch {}
    }
    load();
    const id = setInterval(load, 5000);
    return () => {
      stop = true;
      clearInterval(id);
    };
  }, []);

  // Camera scanner
  useEffect(() => {
    if (!camera) return;
    let qr: any;
    (async () => {
      try {
        const mod = await import('html5-qrcode');
        const Html5QrcodeScanner = (mod as any).Html5QrcodeScanner;
        qr = new Html5QrcodeScanner('reader', { fps: 10, qrbox: 250 }, false);
        qr.render(async (decodedText: string) => {
          await doCheckin(decodedText);
        });
      } catch (err) {
        console.error('Camera scanning unavailable:', err);
        alert('Camera scanning library unavailable. USB barcode scanning still works.');
      }
    })();
    return () => {
      try {
        qr?.clear?.();
      } catch {}
    };
  }, [camera]);

  return (
    <div className="max-w-3xl mx-auto">
      {/* FULL-SCREEN OVERLAY (processing + result) */}
      {overlay.kind !== 'none' && (
        <div
          className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4"
          onClick={overlay.kind === 'processing' ? undefined : dismissOverlay}
          role="dialog"
          aria-modal="true"
        >
          <div
            className="max-w-xl w-full rounded-2xl border border-slate-700 bg-slate-900 p-8 text-center shadow-xl"
            onClick={(e) => e.stopPropagation()}
          >
            {overlay.kind === 'processing' ? (
              <div className="flex flex-col items-center gap-4">
                <div className="h-20 w-20 rounded-full border-4 border-slate-300 border-t-sky-500 animate-spin" />
                <div className="text-2xl font-semibold">Processing scan…</div>
                <div className="text-slate-300">Sending email confirmation…</div>
              </div>
            ) : overlay.kind === 'success' ? (
              <>
                <div className="text-3xl font-bold text-emerald-300">Success</div>
                <div className="mt-3 text-xl">{overlay.text}</div>
                <button className="btn mt-6" onClick={dismissOverlay}>OK</button>
              </>
            ) : (
              <>
                <div className="text-3xl font-bold text-red-300">Error</div>
                <div className="mt-3 text-xl">{overlay.text}</div>
                <button className="btn mt-6" onClick={dismissOverlay}>Close</button>
              </>
            )}
          </div>
        </div>
      )}

      <div className="card">
        <h1 className="text-xl font-semibold">Kiosk – Scan to Check In</h1>
        <p className="text-slate-400 text-sm">
          Plug in your USB barcode scanner. It behaves like a keyboard and will enter the code here automatically.
        </p>
        <form onSubmit={handleSubmit} className="mt-4 flex gap-2">
          <input ref={inputRef} className="input text-2xl" placeholder="Scan or type barcode, then press Enter" autoFocus />
          <button className="btn">Submit</button>
        </form>
        <div className="mt-4">
          <button className="btn" onClick={() => setCamera((v) => !v)}>
            {camera ? 'Stop Camera' : 'Use Camera Scanner (QR/Barcodes)'}
          </button>
        </div>
        {camera && <div id="reader" className="mt-4"></div>}
      </div>

      <div className="card mt-4">
        <h2 className="text-lg font-semibold mb-2">Live Feed (Last 25)</h2>
        <ul className="text-sm space-y-1">
          {feed.map((r) => (
            <li key={r.id}>
              <span className="text-slate-400">{new Date(r.timestamp).toLocaleString('en-US')} — </span>
              <strong>{r.student}</strong> <span className="badge ml-1">{r.type}</span>
              <span className="ml-2 text-slate-400">[{r.barcode}]</span>
              {r.note ? <span className="ml-2">{r.note}</span> : null}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
