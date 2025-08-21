'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function EditForm({ student }: { student: any }) {
  const router = useRouter();
  const [form, setForm] = useState({ ...student });
  const [msg, setMsg] = useState('');

  function update(k: string, v: any) { setForm(prev => ({ ...prev, [k]: v })); }

  async function save(e: React.FormEvent) {
    e.preventDefault(); setMsg('Saving...');
    const res = await fetch(`/api/students/${student.id}`, { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(form) });
    setMsg(res.ok ? 'Saved.' : ('Failed: ' + (await res.text())));
    if (res.ok) router.refresh();
  }

  async function remove() {
    if (!confirm('Delete this student? This cannot be undone.')) return;
    const res = await fetch(`/api/students/${student.id}`, { method: 'DELETE' });
    if (res.ok) { window.location.href = '/admin/students'; } else setMsg('Failed to delete.');
  }

  return (
    <form onSubmit={save} className="bg-slate-900/60 rounded-xl p-5 border border-slate-800 space-y-3 max-w-xl">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        <label className="text-sm">Name<input className="input mt-1" value={form.name} onChange={e => update('name', e.target.value)} /></label>
        <label className="text-sm">Barcode<input className="input mt-1" value={form.barcode} onChange={e => update('barcode', e.target.value)} /></label>
        <label className="text-sm">Parent Email #1<input className="input mt-1" value={form.email1 || ''} onChange={e => update('email1', e.target.value)} /></label>
        <label className="text-sm">Parent Email #2<input className="input mt-1" value={form.email2 || ''} onChange={e => update('email2', e.target.value)} /></label>
        <label className="text-sm">Grade<input className="input mt-1" value={form.grade || ''} onChange={e => update('grade', e.target.value)} /></label>
        <label className="text-sm">Active
          <select className="input mt-1" value={form.active ? '1' : '0'} onChange={e => update('active', e.target.value === '1')}>
            <option value="1">Yes</option><option value="0">No</option>
          </select>
        </label>
      </div>
      <div className="flex gap-2">
        <button className="btn">Save</button>
        <button type="button" className="px-3 py-2 rounded-lg bg-red-500 hover:bg-red-600 transition font-medium" onClick={remove}>Delete</button>
      </div>
      {msg && <div className="text-sm text-slate-300">{msg}</div>}
    </form>
  );
}
