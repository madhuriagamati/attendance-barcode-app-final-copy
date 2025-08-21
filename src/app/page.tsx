import Link from 'next/link';
import { SCHOOL_NAME } from '@/lib/config';

export default function HomePage() {
  return (
    <div className="space-y-16">
      {/* Hero */}
      <section className="text-center pt-10 pb-14">
        <h1 className="mx-auto max-w-3xl text-4xl md:text-6xl font-semibold leading-tight tracking-tight">
          Attendance that feels invisible.
        </h1>
        <p className="mx-auto max-w-2xl mt-4 text-lg text-white/70">
          {SCHOOL_NAME} helps you check students in with a scan. Parents get notified. You get peace of mind.
        </p>
        <div className="mt-7 flex items-center justify-center gap-3">
          <Link href="/kiosk" className="btn">Open Kiosk</Link>
          <Link href="/admin" className="btn-ghost">Admin</Link>
        </div>
      </section>

      {/* Feature tiles */}
      <section className="grid md:grid-cols-3 gap-6">
        {[
          { title: 'Effortless', desc: 'Barcode or camera scanning. No typing.' },
          { title: 'Reassuring', desc: 'Parents receive confirmations automatically.' },
          { title: 'Powerful', desc: 'Live feed, reports, and exports built-in.' },
        ].map((c, i) => (
          <div key={i} className="card">
            <div className="text-xl font-semibold">{c.title}</div>
            <p className="text-white/70 mt-2">{c.desc}</p>
          </div>
        ))}
      </section>
    </div>
  );
}
