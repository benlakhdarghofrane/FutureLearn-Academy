import type { Metadata } from 'next';
import './globals.css';
import { Providers } from './providers';
import { Toaster } from 'sonner';

export const metadata: Metadata = {
  title: 'FutureLearn Academy — Build Real Digital Skills',
  description: 'Learn programming, design, and entrepreneurship through live online training, expert mentors, and career-focused projects.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <Providers>
          {children}
          <Toaster
            theme="dark"
            toastOptions={{
              style: { background: '#1A1A2E', border: '1px solid #2A2A45', color: '#fff' },
            }}
          />
        </Providers>
      </body>
    </html>
  );
}
