import './globals.css'
import type { Metadata } from 'next'
import { Architects_Daughter } from 'next/font/google'
import { ThemeProvider } from '@/components/ThemeProvider'
import { Toaster } from '@/components/ui/toaster'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
const architectsDaughter = Architects_Daughter({
  weight: '400',
  subsets: ['latin'],
})

export const metadata: Metadata = {
  title: 'Just Let Me Cook - Extract Recipes Without The Fluff',
  description:
    'Get straight to cooking with clear, concise recipes extracted from verbose cooking blogs.',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={architectsDaughter.className}>
        <ThemeProvider
          attribute="class"
          defaultTheme="light"
          enableSystem
          disableTransitionOnChange
        >
          <Header />
          {children}
          <Footer />
          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  )
}
