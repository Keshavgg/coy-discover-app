import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Coy | Discover Tab & Mutual Crush Matching',
  description: 'A swipe-based discovery tab built for Coy with private mutual matching.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <body className="bg-coy-bg text-white min-h-screen antialiased flex flex-col items-center justify-center p-0 md:p-6">
        {/* Ambient background glow */}
        <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
          <div className="absolute -top-40 -left-40 w-96 h-96 bg-coy-pink/15 rounded-full blur-3xl opacity-60"></div>
          <div className="absolute -bottom-40 -right-40 w-96 h-96 bg-coy-purple/20 rounded-full blur-3xl opacity-60"></div>
        </div>

        <main className="relative z-10 w-full max-w-md h-[100dvh] md:h-[844px] md:max-h-[92vh] bg-coy-card md:rounded-[40px] md:border md:border-coy-border shadow-2xl flex flex-col overflow-hidden">
          {children}
        </main>
      </body>
    </html>
  );
}
