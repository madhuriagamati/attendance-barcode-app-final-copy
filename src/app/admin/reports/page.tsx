'use client';
import { useEffect, useState } from 'react';

type Student = { id: string; name: string };
type Row = { id: string; timestamp: string; student: string; barcode: string; type: string; note: string };

export default function ReportsPage() {
  const [from, setFrom] = useState('');
  const [to, setTo] = useState('');
  const [studentId, setStudentId] = useState('');
  const [rows, setRows] = useState<Row[]>([]);
  const [students, setStudents] = useState<Student[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetch('/api/students', { cache: 'no-store' })
      .then(r => r.json())
      .then((s) => setStudents(s.map((x:any)=>({ id:x.id, name:x.name }))));
  }, []);

  async function run() {
    setLoading(true);
    const sp = new URLSearchParams();
    if (from) sp.set('from', from);
    if (to) sp.set('to', to);
    if (studentId) sp.set('studentId', studentId);
    const res = await fetch('/api/attendance?' + sp.toString(), { cache: 'no-store' });
    const data = await res.json();
    setRows(data);
    setLoading(false);
  }

  const exportUrl = (fmt: 'csv' | 'xlsx') => {
    const sp = new URLSearchParams();
    if (from) sp.set('from', from);
    if (to) sp.set('to', to);
    if (studentId) sp.set('studentId', studentId);
    sp.set('format', fmt);
    return '/api/export/attendance?' + sp.toString();
  };

  return (
    <div className="space-y-4">
      <h1 className="text-xl font-semibold">Reports</h1>
      <div className="bg-slate-900/60 rounded-xl p-4 border border-slate-800">
        <div className="grid md:grid-cols-4 gap-3">
          <label className="text-sm">From<input type="date" className="input mt-1" value={from} onChange={e => setFrom(e.target.value)} /></label>
          <label className="text-sm">To<input type="date" className="input mt-1" value={to} onChange={e => setTo(e.target.value)} /></label>
          <label className="text-sm">Student<select className="input mt-1" value={studentId} onChange={e => setStudentId(e.target.value)}><option value="">All</option>{students.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}</select></label>
          <div className="flex items-end gap-2">
            <button className="btn" onClick={run} disabled={loading}>{loading ? 'Loading...' : 'Run Report'}</button>
            <a className="btn" href={exportUrl('csv')}>CSV</a>
            <a className="btn" href={exportUrl('xlsx')}>Excel</a>
          </div>
        </div>
      </div>
      <div className="bg-slate-900/60 rounded-xl p-4 border border-slate-800">
        <div className="overflow-auto">
          <table className="table">
            <thead><tr><th>Time</th><th>Student</th><th>Barcode</th><th>Type</th><th>Note</th></tr></thead>
            <tbody>
              {rows.map(r => (
                <tr key={r.id} className="hover:bg-slate-800/40">
                  <td>{new Date(r.timestamp).toLocaleString('en-US')}</td>
                  <td>{r.student}</td>
                  <td>{r.barcode}</td>
                  <td><span className="badge">{r.type}</span></td>
                  <td>{r.note}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
