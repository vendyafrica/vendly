import type { Metadata } from 'next'
import { Geist, Geist_Mono } from 'next/font/google'
import '@vendly/ui/globals.css'
import { StreamingProvider } from '@/contexts/streaming-context'
import { SWRProvider } from '@/components/providers/swr-provider'
import { SessionProvider } from '@/components/providers/session-provider'
import { AiSidebar } from '@/components/ai-sidebar'
import { SidebarInset, SidebarProvider } from '@vendly/ui/components/sidebar'

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
})

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
})

export const metadata: Metadata = {
  title: 'Vendly',
  description:
    'Vendly - AI-powered React component generator and preview tool for building modern web applications',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
                  document.documentElement.classList.add('dark');
                } else {
                  document.documentElement.classList.remove('dark');
                }
                
                // Listen for changes in system preference
                window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', function(e) {
                  if (e.matches) {
                    document.documentElement.classList.add('dark');
                  } else {
                    document.documentElement.classList.remove('dark');
                  }
                });
              })();
            `,
          }}
        />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <SessionProvider>
          <SWRProvider>
            <StreamingProvider>
              <SidebarProvider defaultOpen={false}>
                <AiSidebar />
                <SidebarInset>{children}</SidebarInset>
              </SidebarProvider>
            </StreamingProvider>
          </SWRProvider>
        </SessionProvider>
      </body>
    </html>
  )
}
