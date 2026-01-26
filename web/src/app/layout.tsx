/**
 * Root layout component with metadata and global styles.
 */
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { SessionProvider } from 'next-auth/react';
import { AuthProvider } from '@/contexts/AuthContext';
import { ThemeProvider } from '@/contexts/ThemeContext';
import { PreferencesProvider } from '@/contexts/PreferencesContext';
import { ActivityProvider } from '@/contexts/ActivityContext';
import { Toaster } from '@/components/ui/toaster';
import { AOSInit } from '@/components/ui/aos-init';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Todo Management App',
  description: 'Phase II Todo Management - Create, view, update, and delete todos',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <SessionProvider>
          <ThemeProvider>
            <AuthProvider>
              <PreferencesProvider>
                <ActivityProvider>
                  <AOSInit />
                  {children}
                  <Toaster />
                </ActivityProvider>
              </PreferencesProvider>
            </AuthProvider>
          </ThemeProvider>
        </SessionProvider>
      </body>
    </html>
  );
}
