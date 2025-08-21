import Link from 'next/link';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const isAdmin = cookies().get('admin')?.value === '1';
  if (!isAdmin) redirect('/login');

  return (
    <div className="grid grid-cols-1 md:grid-cols-[220px_1fr] gap-4">
      <aside className="md:sticky md:top-6 h-fit bg-slate-900/60 border border-slate-800 rounded-xl p-4">
        <div className="text-sm text-slate-300 mb-3">Admin</div>
        <nav className="text-sm flex flex-col gap-2">
          <Link className="hover:bg-slate-800/80 rounded px-3 py-2" href="/admin">Overview</Link>
          <Link className="hover:bg-slate-800/80 rounded px-3 py-2" href="/admin/students">Students</Link>
          <Link className="hover:bg-slate-800/80 rounded px-3 py-2" href="/admin/reports">Reports</Link>
          <form action="/api/logout" method="post"><button className="hover:bg-slate-800/80 rounded px-3 py-2 w-full text-left">Logout</button></form>
          <Link className="hover:bg-slate-800/80 rounded px-3 py-2 text-slate-400" href="/">Back to site</Link>
        </nav>
      </aside>
      <section>{children}</section>
    </div>
  );
}
