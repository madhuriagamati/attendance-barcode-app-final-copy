import './globals.css';
import Link from 'next/link';
import { SCHOOL_NAME, LOGO_URL } from '@/lib/config';

export const metadata = {
  title: `${SCHOOL_NAME} – Attendance`,
  description: 'Barcode-based attendance and notifications',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="font-sans antialiased">
        <div className="min-h-screen">
          <header className="sticky top-0 z-40 backdrop-blur bg-black/50 border-b border-white/10">
            <div className="mx-auto max-w-6xl px-4 h-14 flex items-center justify-between">
              <Link href="/" className="flex items-center gap-2">
                {LOGO_URL ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={LOGO_URL} alt="Logo" className="h-6 w-6 rounded-full " />
                ) : (
                  <div className="h-6 w-6 rounded-full bg-white/80" />
                )}
                <span className="text-sm text-white/80">{SCHOOL_NAME}</span>
              </Link>
              <nav className="text-sm text-white/80 flex items-center gap-4">
                <Link className="hover:text-white transition" href="/">Home</Link>
                <Link className="hover:text-white transition" href="/kiosk">Kiosk</Link>
                <Link className="hover:text-white transition" href="/feed">Live Feed</Link>
                <Link className="hover:text-white transition" href="/admin">Admin</Link>
              </nav>
            </div>
          </header>

          <main className="mx-auto max-w-6xl px-4 py-10">
            {children}
          </main>

          <footer className="border-t border-white/10">
            <div className="mx-auto max-w-6xl px-4 py-10 text-xs text-white/60">
              © {new Date().getFullYear()} {SCHOOL_NAME}
            </div>
          </footer>
        </div>
      </body>
    </html>
  );
}
